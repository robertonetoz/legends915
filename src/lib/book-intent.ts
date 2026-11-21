"use client";

export type BookIntent = { service?: string; barber?: string };

const EVENT = "legends:book";

/** Pre-fill the booking form from anywhere on the page, then scroll to it. */
export function requestBooking(intent: BookIntent) {
  window.dispatchEvent(new CustomEvent<BookIntent>(EVENT, { detail: intent }));
  document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function onBookingIntent(cb: (i: BookIntent) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<BookIntent>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
