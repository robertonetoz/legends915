"use client";

import { Clock } from "lucide-react";
import { services } from "@/lib/site";
import { requestBooking } from "@/lib/book-intent";

export function Services() {
  return (
    <section id="menu" className="bg-paper text-ink">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-20 lg:px-10 lg:py-32">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="display text-[clamp(3.5rem,9vw,7rem)]">The menu</h2>
          <p className="mt-6 max-w-sm text-lg text-ink/70">
            Every cut is finished with a line up and a hot towel. Prices are a starting point; long hair or detailed
            designs may cost a little more. Your barber will tell you before they start.
          </p>
        </div>

        <ul className="border-t-2 border-ink">
          {services.map((s) => (
            <li key={s.name} className="group border-b border-ink/15">
              <button
                type="button"
                onClick={() => requestBooking({ service: s.name })}
                className="grid w-full grid-cols-[1fr_auto] items-baseline gap-x-4 py-6 text-left sm:py-7"
                aria-label={`Book ${s.name}, $${s.price}`}
              >
                <span className="flex items-baseline gap-3">
                  <span className="display text-[2.1rem] leading-none transition-colors group-hover:text-red sm:text-5xl">
                    {s.name}
                  </span>
                  <span
                    className="hidden h-px flex-1 translate-y-[-0.35rem] border-b-2 border-dotted border-ink/25 sm:block"
                    aria-hidden
                  />
                </span>
                <span className="display text-right text-[2.1rem] leading-none sm:text-5xl">
                  {s.from && <span className="mr-1.5 align-middle font-sans text-sm font-semibold normal-case tracking-normal text-ink/60">from</span>}
                  ${s.price}
                </span>

                <span className="col-span-2 mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.95rem] text-ink/65">
                  <span className="max-w-md">{s.note}</span>
                  <span className="inline-flex items-center gap-1.5 text-ink/50">
                    <Clock className="size-3.5" aria-hidden />
                    {s.minutes} min
                  </span>
                  <span className="ml-auto font-semibold text-red opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:hidden">
                    Book this
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
