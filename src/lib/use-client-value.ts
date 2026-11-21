"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Reads a browser-only value without a hydration mismatch (null on the server). */
export function useClientValue<T extends string | number | boolean>(get: () => T): T | null {
  return useSyncExternalStore(noop, get, () => null);
}
