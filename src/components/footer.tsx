import Image from "next/image";
import { locations, site, telHref } from "@/lib/site";
import { FacebookIcon, InstagramIcon } from "./brand-icons";
import { Year } from "./year";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink pb-28 lg:pb-10">
      <div className="stripes h-2 w-full" aria-hidden />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <Image src="/brand/emblem-160.png" alt="Legends Barbershop Team" width={96} height={96} />
          <p className="mt-5 max-w-xs text-white/60">Barbers for El Paso and Horizon City. Walk-ins welcome, kids welcome.</p>
          <div className="mt-6 flex gap-3">
            <a
              href={site.social.instagram.url}
              target="_blank"
              rel="noreferrer"
              aria-label="Legends on Instagram"
              className="grid size-11 place-items-center rounded-full border border-line hover:border-white"
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href={site.social.facebook.url}
              target="_blank"
              rel="noreferrer"
              aria-label="Legends on Facebook"
              className="grid size-11 place-items-center rounded-full border border-line hover:border-white"
            >
              <FacebookIcon className="size-5" />
            </a>
          </div>
        </div>

        {locations.map((l) => (
          <address key={l.id} className="not-italic">
            <p className="display text-3xl">{l.name}</p>
            <p className="mt-3 text-white/60">
              {l.street}
              {l.suite ? `, ${l.suite}` : ""}
              <br />
              {l.city}, {l.state} {l.zip}
            </p>
          </address>
        ))}

        <div>
          <p className="display text-3xl">Call us</p>
          <ul className="mt-3 space-y-1 text-white/60">
            {Object.values(site.phones).map((p) => (
              <li key={p.e164}>
                {p.label}:{" "}
                <a href={telHref(p.e164)} className="font-semibold text-white hover:text-red">
                  {p.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl flex-col gap-2 border-t border-line px-4 pt-6 text-sm text-white/40 sm:flex-row sm:justify-between sm:px-6 lg:px-10">
        <p>© <Year /> Legends Barbershop. El Paso, Texas.</p>
        <p>Made in the 915.</p>
      </div>
    </footer>
  );
}
