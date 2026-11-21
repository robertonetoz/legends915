"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { site, telHref } from "@/lib/site";

/** Thumb-reach call/book bar on phones, shown after the hero scrolls away. */
export function MobileBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const book = document.getElementById("book");
      const nearBook = book ? book.getBoundingClientRect().top < window.innerHeight * 0.6 : false;
      setShow(window.scrollY > window.innerHeight * 0.7 && !nearBook);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 p-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-2 gap-2">
        <a href={telHref(site.phones.walkIns.e164)} className="btn btn-ghost min-h-12!" tabIndex={show ? 0 : -1}>
          <Phone className="size-4" aria-hidden />
          Call
        </a>
        <a href="#book" className="btn btn-red min-h-12!" tabIndex={show ? 0 : -1}>
          Book a chair
        </a>
      </div>
    </div>
  );
}
