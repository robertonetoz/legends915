"use client";

import { barbers } from "@/lib/site";
import { requestBooking } from "@/lib/book-intent";
import { InstagramIcon } from "./brand-icons";

export function Team() {
  return (
    <section id="team" className="bg-red text-chalk">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="display text-[clamp(3.5rem,9vw,7rem)]">Meet the team</h2>
          <p className="max-w-lg text-lg text-white/85 lg:justify-self-end">
            Every barber here takes walk-ins, kids and first-timers. If you already have someone in mind, book them by
            name.
          </p>
        </div>

        <ul className="mt-16 border-t-2 border-ink">
          {barbers.map((b) => (
            <li
              key={b.id}
              className="grid gap-6 border-b border-ink/30 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-12 lg:py-12"
            >
              <div>
                <h3 className="display text-[clamp(4.5rem,12vw,9rem)] text-ink">{b.name}</h3>
                {b.handle && (
                  <a
                    href={b.handleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 font-semibold text-white hover:underline"
                  >
                    <InstagramIcon className="size-4" />
                    {b.handle}
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-5 md:pt-3">
                <p className="text-xl font-semibold text-white">Known for {b.known.charAt(0).toLowerCase() + b.known.slice(1)}.</p>
                <ul className="flex flex-wrap gap-2">
                  {b.tags.map((t) => (
                    <li key={t} className="rounded-full border border-white/40 px-3 py-1 text-sm font-medium">
                      {t}
                    </li>
                  ))}
                </ul>
                <blockquote className="border-l-2 border-ink pl-4 text-white/90">
                  <p className="text-lg italic">&ldquo;{b.quote.text}&rdquo;</p>
                  <footer className="mt-1 text-sm text-white/70">{b.quote.author}, Google review</footer>
                </blockquote>
                <div>
                  <button type="button" onClick={() => requestBooking({ barber: b.name })} className="btn btn-ink hover:bg-chalk hover:text-ink">
                    Book with {b.name}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
