"use client";

import { MapPin, Navigation, Phone } from "lucide-react";
import { formatAddress, hours, locations, site, telHref } from "@/lib/site";
import { formatTime, shopNow } from "@/lib/hours";
import { useClientValue } from "@/lib/use-client-value";

export function Visit() {
  const today = useClientValue(() => shopNow().day);

  return (
    <section id="visit" className="bg-paper text-ink">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="display text-[clamp(3.5rem,9vw,7rem)]">Two shops, one team</h2>
          <p className="max-w-lg text-lg text-ink/70 lg:justify-self-end">
            Same standards in East El Paso and Horizon City. Walk in at either shop, or call ahead to check the wait.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          {locations.map((l) => {
            const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(l.mapQuery)}`;
            return (
              <article key={l.id} className="flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-ink/15 bg-ink/5">
                  <iframe
                    title={`Map of Legends Barbershop ${l.name}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(l.mapQuery)}&z=15&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full grayscale-[0.85] contrast-[1.05]"
                  />
                </div>
                <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="display text-5xl">{l.name}</h3>
                    <p className="mt-3 flex items-start gap-2 text-lg">
                      <MapPin className="mt-1.5 size-4 shrink-0 text-red" aria-hidden />
                      <span>
                        {l.street}
                        {l.suite ? `, ${l.suite}` : ""}
                        <br />
                        {l.city}, {l.state} {l.zip}
                      </span>
                    </p>
                    {l.landmark && <p className="mt-1 pl-6 text-ink/60">{l.landmark}</p>}
                  </div>
                  <a
                    href={directions}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ink"
                    aria-label={`Get directions to ${formatAddress(l)}`}
                  >
                    <Navigation className="size-4" aria-hidden />
                    Directions
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-20 grid gap-12 border-t-2 border-ink pt-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-20">
          <div>
            <h3 className="display text-5xl">Hours</h3>
            <p className="mt-4 max-w-sm text-ink/70">
              Holiday hours can change. Check our Instagram or call before you head over on a holiday.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {Object.values(site.phones).map((p) => (
                <a key={p.e164} href={telHref(p.e164)} className="group inline-flex items-center gap-3">
                  <Phone className="size-4 text-red" aria-hidden />
                  <span className="text-ink/60">{p.label}</span>
                  <span className="font-semibold group-hover:text-red">{p.display}</span>
                </a>
              ))}
            </div>
          </div>

          <dl className="divide-y divide-ink/15">
            {hours.map((h) => {
              const isToday = h.day === today;
              return (
                <div
                  key={h.day}
                  className={`flex items-baseline justify-between px-3 py-3.5 text-lg ${
                    isToday ? "rounded-md bg-ink text-chalk" : ""
                  }`}
                >
                  <dt className="font-semibold">
                    {h.label}
                    {isToday && <span className="ml-3 text-sm font-medium text-red">Today</span>}
                  </dt>
                  <dd className="tabular-nums">
                    {formatTime(h.open)} – {formatTime(h.close)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
