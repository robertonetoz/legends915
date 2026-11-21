"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus as Status } from "@/lib/hours";

/** Live open/closed badge, computed in the shop's timezone (Mountain Time). */
export function OpenStatus({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const tick = () => setStatus(getOpenStatus());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!status) return <span className={`inline-flex h-9 ${className}`} aria-hidden />;

  const text = status.open
    ? status.closingSoon
      ? `Open now, closing at ${status.closesAt}`
      : `Open now until ${status.closesAt}`
    : `Closed, opens ${status.opensDay} at ${status.opensAt}`;

  return (
    <span
      className={`inline-flex h-9 items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-medium ${className}`}
      role="status"
    >
      <span className="relative flex size-2.5">
        {status.open && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />}
        <span className={`relative size-2.5 rounded-full ${status.open ? "bg-emerald-400" : "bg-steel"}`} />
      </span>
      {text}
    </span>
  );
}
