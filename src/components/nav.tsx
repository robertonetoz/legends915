"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { site, telHref } from "@/lib/site";
import { InstagramIcon, FacebookIcon } from "./brand-icons";

const links = [
  { href: "#menu", label: "Services" },
  { href: "#work", label: "Our work" },
  { href: "#team", label: "Barbers" },
  { href: "#visit", label: "Locations" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
          scrolled || open ? "border-b border-line bg-ink/85 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-10" aria-label="Main">
          <a href="#top" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Image src="/brand/emblem-160.png" alt="" width={44} height={44} priority />
            <span className="display text-2xl tracking-wide">Legends</span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-[0.95rem] font-medium text-white/75 transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={telHref(site.phones.walkIns.e164)}
              className="hidden items-center gap-2 text-[0.95rem] font-semibold md:flex"
            >
              <Phone className="size-4 text-red" aria-hidden />
              {site.phones.walkIns.display}
            </a>
            <a href="#book" className="btn btn-red hidden min-h-11! px-5! sm:inline-flex">
              Book a chair
            </a>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full border border-line lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink px-6 pt-28 pb-10 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
          >
            <ul className="flex flex-col gap-1">
              {[...links, { href: "#book", label: "Book a chair" }].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="display block py-2 text-6xl hover:text-red">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between border-t border-line pt-6">
              <a href={telHref(site.phones.walkIns.e164)} className="text-lg font-semibold">
                {site.phones.walkIns.display}
              </a>
              <div className="flex gap-4">
                <a href={site.social.instagram.url} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <InstagramIcon className="size-6" />
                </a>
                <a href={site.social.facebook.url} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <FacebookIcon className="size-6" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
