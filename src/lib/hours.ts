import { hours, site } from "./site";

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const formatTime = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")} ${suffix}` : `${hour} ${suffix}`;
};

/** Current weekday + minutes in the shop's own timezone. */
export function shopNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: site.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type OpenStatus =
  | { open: true; closesAt: string; closingSoon: boolean }
  | { open: false; opensAt: string; opensDay: string };

export function getOpenStatus(date = new Date()): OpenStatus {
  const { day, minutes } = shopNow(date);
  const today = hours.find((h) => h.day === day)!;

  if (minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return {
      open: true,
      closesAt: formatTime(today.close),
      closingSoon: toMinutes(today.close) - minutes <= 60,
    };
  }

  if (minutes < toMinutes(today.open)) {
    return { open: false, opensAt: formatTime(today.open), opensDay: "today" };
  }

  const next = hours.find((h) => h.day === (day + 1) % 7)!;
  return { open: false, opensAt: formatTime(next.open), opensDay: "tomorrow" };
}
