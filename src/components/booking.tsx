"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Loader2, MessageSquareText, Phone } from "lucide-react";
import { barbers, hours, locations, services, site, telHref } from "@/lib/site";
import { formatTime, shopNow } from "@/lib/hours";
import { onBookingIntent } from "@/lib/book-intent";
import { useClientValue } from "@/lib/use-client-value";

type Day = { key: string; weekday: number; short: string; dayNum: string; long: string; isToday: boolean };

function upcomingDays(count = 7): Day[] {
  const tz = site.timezone;
  const out: Day[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const d = new Date(now + i * 86_400_000);
    const part = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { timeZone: tz, ...o }).format(d);
    const short = part({ weekday: "short" });
    out.push({
      key: part({ year: "numeric", month: "2-digit", day: "2-digit" }),
      weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(short),
      short: i === 0 ? "Today" : i === 1 ? "Tmrw" : short,
      dayNum: part({ day: "numeric" }),
      long: part({ weekday: "long", month: "long", day: "numeric" }),
      isToday: i === 0,
    });
  }
  return out;
}

function slotsFor(day: Day): string[] {
  const h = hours.find((x) => x.day === day.weekday);
  if (!h) return [];
  const [oh, om] = h.open.split(":").map(Number);
  const [ch, cm] = h.close.split(":").map(Number);
  const start = oh * 60 + om;
  const end = ch * 60 + cm - 30; // last booking 30 min before close
  const nowMin = day.isToday ? shopNow().minutes + 30 : -1;
  const slots: string[] = [];
  for (let m = start; m <= end; m += 30) {
    if (m < nowMin) continue;
    slots.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return slots;
}

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

type Status = "idle" | "sending" | "sent" | "text";

export function Booking() {
  // Re-computed when the shop's calendar date changes; empty during server render.
  const stamp = useClientValue(() => `${shopNow().day}`);
  const days = useMemo(() => (stamp === null ? [] : upcomingDays()), [stamp]);
  const [location, setLocation] = useState<string>(locations[0].name);
  const [barber, setBarber] = useState("First available");
  const [service, setService] = useState(services[0].name);
  const [dayKey, setDayKey] = useState("");
  const [pickedTime, setPickedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(
    () =>
      onBookingIntent((i) => {
        if (i.barber) setBarber(i.barber);
        if (i.service) setService(i.service);
        setStatus("idle");
      }),
    [],
  );

  const day = days.find((d) => d.key === dayKey) ?? days.find((d) => slotsFor(d).length > 0) ?? days[0];
  const slots = useMemo(() => (day ? slotsFor(day) : []), [day]);
  const time = slots.includes(pickedTime) ? pickedTime : (slots[0] ?? "");
  const setTime = setPickedTime;

  const message = day
    ? [
        `Hi Legends! I'd like to book:`,
        `${service}${barber !== "First available" ? ` with ${barber}` : ""}`,
        `${day.long} at ${time ? formatTime(time) : "any time"}`,
        `${location} shop`,
        `Name: ${name}`,
        `Phone: ${phone}`,
        notes ? `Notes: ${notes}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  const smsHref = `sms:${site.phones.appointments.e164}?&body=${encodeURIComponent(message)}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Add your name so your barber knows who's coming.");
    if (phone.replace(/\D/g, "").length < 10) return setError("Add a 10-digit phone number so we can text you back.");
    if (!time) return setError("That day is fully past closing. Pick another day.");

    setStatus("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          barber,
          service,
          date: day?.long,
          time: formatTime(time),
          name,
          phone,
          notes,
          website: honey,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Request failed");
      setStatus(json.delivered ? "sent" : "text");
    } catch {
      setStatus("text");
    }
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const pill = (on: boolean) =>
    `h-11 rounded-full px-4 text-[0.95rem] font-semibold transition-colors ${
      on ? "bg-chalk text-ink" : "border border-white/20 text-white/80 hover:border-white/60 hover:text-white"
    }`;

  const label = "mb-3 block text-sm font-semibold text-white/60";
  const field =
    "h-12 w-full rounded-md border border-white/20 bg-transparent px-4 text-base text-white placeholder:text-white/35 focus:border-white focus:outline-none";

  return (
    <section id="book" className="relative border-t border-line bg-ink">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-20 lg:px-10 lg:py-32">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="display text-[clamp(3.5rem,9vw,7rem)]">Book a chair</h2>
          <p className="mt-6 max-w-sm text-lg text-white/70">
            Pick your shop, barber and time. We&apos;ll text you back to confirm, usually within the hour during shop
            hours.
          </p>
          <p className="mt-6 max-w-sm text-white/70">Rather talk to someone? Call or text the appointments line.</p>
          <div className="mt-4 flex flex-col gap-2">
            <a href={telHref(site.phones.appointments.e164)} className="inline-flex items-center gap-3 text-xl font-semibold hover:text-red">
              <Phone className="size-5 text-red" aria-hidden />
              {site.phones.appointments.display}
            </a>
          </div>
          <p className="mt-10 text-sm text-white/50">No appointment? Walk in. Both shops take walk-ins all day.</p>
        </div>

        <div className="relative min-h-[40rem] rounded-2xl border border-line bg-asphalt p-5 sm:p-8 lg:p-10">
          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" || status === "text" ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="flex h-full flex-col"
                aria-live="polite"
              >
                {status === "sent" ? (
                  <>
                    <span className="grid size-16 place-items-center rounded-full bg-red">
                      <Check className="size-8" aria-hidden />
                    </span>
                    <h3 className="display mt-8 text-6xl">Request sent</h3>
                    <p className="mt-4 max-w-md text-lg text-white/75">
                      Thanks, {name.split(" ")[0]}. We&apos;ll text {phone} to confirm {service.toLowerCase()} on{" "}
                      {day?.long} at {formatTime(time)}. Your spot is held once you get that text.
                    </p>
                  </>
                ) : (
                  <>
                    <span className="grid size-16 place-items-center rounded-full bg-red">
                      <MessageSquareText className="size-7" aria-hidden />
                    </span>
                    <h3 className="display mt-8 text-6xl">Last step: send the text</h3>
                    <p className="mt-4 max-w-md text-lg text-white/75">
                      Your request is ready. Send it to our appointments line at {site.phones.appointments.display} and
                      we&apos;ll text you back to confirm.
                    </p>
                    <pre className="mt-6 whitespace-pre-wrap rounded-lg border border-line bg-ink p-4 font-sans text-[0.95rem] text-white/85">
                      {message}
                    </pre>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a href={smsHref} className="btn btn-red">
                        <MessageSquareText className="size-4" aria-hidden />
                        Open in Messages
                      </a>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={async () => {
                          await navigator.clipboard.writeText(message);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                      >
                        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                        {copied ? "Copied" : "Copy message"}
                      </button>
                    </div>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-auto self-start pt-10 text-sm font-semibold text-white/60 underline-offset-4 hover:text-white hover:underline"
                >
                  Change details
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                noValidate
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-8"
              >
                <fieldset className="min-w-0">
                  <legend className={label}>Shop</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {locations.map((l) => (
                      <button
                        type="button"
                        key={l.id}
                        aria-pressed={location === l.name}
                        onClick={() => setLocation(l.name)}
                        className={`rounded-lg px-4 py-3 text-left transition-colors ${
                          location === l.name ? "bg-chalk text-ink" : "border border-white/20 hover:border-white/60"
                        }`}
                      >
                        <span className="block font-semibold">{l.name}</span>
                        <span className={`block text-sm ${location === l.name ? "text-ink/60" : "text-white/50"}`}>
                          {l.street}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="min-w-0">
                  <legend className={label}>Barber</legend>
                  <div className="flex flex-wrap gap-2">
                    {["First available", ...barbers.map((b) => b.name)].map((b) => (
                      <button type="button" key={b} aria-pressed={barber === b} onClick={() => setBarber(b)} className={pill(barber === b)}>
                        {b}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="service" className={label}>
                    Service
                  </label>
                  <select id="service" value={service} onChange={(e) => setService(e.target.value)} className={`${field} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat`}>
                    {services.map((s) => (
                      <option key={s.name} value={s.name} className="bg-asphalt">
                        {s.name}, {s.from ? "from " : ""}${s.price}
                      </option>
                    ))}
                  </select>
                </div>

                <fieldset className="min-w-0">
                  <legend className={label}>Day</legend>
                  <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                    {days.map((d) => {
                      const none = slotsFor(d).length === 0;
                      const on = d.key === day?.key;
                      return (
                        <button
                          type="button"
                          key={d.key}
                          disabled={none}
                          aria-pressed={on}
                          aria-label={d.long}
                          onClick={() => setDayKey(d.key)}
                          className={`flex w-16 shrink-0 flex-col items-center rounded-lg py-2.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                            on ? "bg-red text-chalk" : "border border-white/20 hover:border-white/60"
                          }`}
                        >
                          <span className="text-xs font-semibold">{d.short}</span>
                          <span className="display text-3xl leading-tight">{d.dayNum}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="min-w-0">
                  <legend className={label}>Time</legend>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {slots.map((s) => (
                      <button type="button" key={s} aria-pressed={time === s} onClick={() => setTime(s)} className={`${pill(time === s)} px-2! tabular-nums`}>
                        {formatTime(s)}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={label}>
                      Your name
                    </label>
                    <input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="First and last" />
                  </div>
                  <div>
                    <label htmlFor="phone" className={label}>
                      Mobile number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      className={field}
                      placeholder="(915) 555-0123"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className={label}>
                    Anything we should know? <span className="font-normal text-white/40">Optional</span>
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`${field} h-auto py-3`}
                    placeholder="Low taper with a part, booking for two kids…"
                  />
                </div>

                {/* Honeypot: hidden from people, filled by bots */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honey}
                  onChange={(e) => setHoney(e.target.value)}
                  className="absolute -left-[9999px] h-px w-px opacity-0"
                  aria-hidden
                />

                {error && (
                  <p role="alert" className="rounded-md border border-red/50 bg-red/10 px-4 py-3 text-[0.95rem]">
                    {error}
                  </p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button type="submit" disabled={status === "sending"} className="btn btn-red w-full sm:w-auto">
                    {status === "sending" && <Loader2 className="size-4 animate-spin" aria-hidden />}
                    Send request
                  </button>
                  <p className="text-sm text-white/50">This is a request. Your time is held once we text back.</p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
