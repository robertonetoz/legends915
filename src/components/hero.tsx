"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Phone } from "lucide-react";
import { site, telHref } from "@/lib/site";
import { BarberPole } from "./barber-pole";
import { OpenStatus } from "./open-status";
import { GoogleIcon, Stars } from "./brand-icons";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const lines = ["Fresh", "cuts for", "the 915."];

  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
      {/* Big quiet watermark of the area code */}
      <div
        className="display pointer-events-none absolute -right-[4vw] bottom-[-6vw] -z-10 select-none text-[38vw] text-white/[0.035] lg:text-[30vw]"
        aria-hidden
      >
        915
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-10">
        <div className="relative">
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <OpenStatus />
          </motion.div>

          <h1 className="display mt-7 text-[clamp(4.25rem,15vw,10.5rem)]">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className={`block ${i === 2 ? "text-red" : ""}`}
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.25 + i * 0.12, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease }}
          >
            <p className="mt-8 max-w-[34rem] text-lg text-white/75 sm:text-xl">
              Fades, freehand designs, beard work and kids&apos; cuts at two shops in El Paso and Horizon City. Walk in any
              day of the week, or book your barber ahead.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#book" className="btn btn-red">
                Book a chair
              </a>
              <a href={telHref(site.phones.walkIns.e164)} className="btn btn-ghost">
                <Phone className="size-4" aria-hidden />
                Call {site.phones.walkIns.display}
              </a>
            </div>

            <a
              href={site.rating.google.url}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex items-center gap-3 text-sm text-white/70 hover:text-white"
            >
              <GoogleIcon className="size-5" />
              <span className="font-semibold text-white">{site.rating.google.score}</span>
              <Stars value={site.rating.google.score} className="text-base" />
              <span>{site.rating.google.count} Google reviews</span>
            </a>
          </motion.div>
        </div>

        {/* Emblem + spinning pole */}
        <div className="relative mx-auto flex w-full max-w-[34rem] items-center justify-center lg:justify-end">
          <motion.div
            className="relative z-10 w-[72%] lg:w-[82%]"
            initial={reduce ? false : { opacity: 0, scale: 1.25, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.2, 1.4, 0.4, 1] }}
          >
            <Image
              src="/brand/emblem-720.png"
              alt="Legends Barbershop Team emblem"
              width={720}
              height={720}
              priority
              className="h-auto w-full drop-shadow-[0_30px_60px_rgba(226,0,26,0.25)]"
            />
          </motion.div>

          <motion.div
            className="absolute top-1/2 right-0 h-[118%] w-[13%] lg:-right-2"
            initial={reduce ? false : { opacity: 0, y: "-40%" }}
            animate={{ opacity: 1, y: "-50%" }}
            transition={{ duration: 1, delay: 0.3, ease }}
          >
            <BarberPole className="h-full w-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
