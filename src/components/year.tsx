"use client";

import { useClientValue } from "@/lib/use-client-value";

export function Year() {
  const year = useClientValue(() => new Date().getFullYear());
  return <>{year ?? 2026}</>;
}
