import type { Metadata, Viewport } from "next";
import { Barlow, Big_Shoulders } from "next/font/google";
import { hours, locations, site } from "@/lib/site";
import "./globals.css";

const shoulders = Big_Shoulders({
  variable: "--font-shoulders",
  subsets: ["latin"],
  axes: ["opsz"],
  adjustFontFallback: false,
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Legends Barbershop | Fades, Designs & Kids Cuts in El Paso, TX",
  description: site.description,
  keywords: [
    "barbershop El Paso",
    "barber El Paso TX",
    "fade El Paso",
    "Horizon City barber",
    "kids haircut El Paso",
    "hair designs",
    "walk-in barber",
  ],
  openGraph: {
    title: "Legends Barbershop · El Paso & Horizon City",
    description: site.description,
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

const dayCodes = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": locations.map((l) => ({
    "@type": "BarberShop",
    "@id": `${site.url}#${l.id}`,
    name: `${site.name} – ${l.name}`,
    image: `${site.url}/brand/emblem-720.png`,
    telephone: site.phones.walkIns.e164,
    priceRange: "$$",
    url: site.url,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${l.street}${l.suite ? ` ${l.suite}` : ""}`,
      addressLocality: l.city,
      addressRegion: l.state,
      postalCode: l.zip,
      addressCountry: "US",
    },
    openingHours: hours.map((h) => `${dayCodes[h.day]} ${h.open}-${h.close}`),
    sameAs: [site.social.instagram.url, site.social.facebook.url],
    ...(l.id === "eastside"
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: site.rating.google.score,
            reviewCount: site.rating.google.count,
          },
        }
      : {}),
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${shoulders.variable} ${barlow.variable}`}>
      <body className="min-h-dvh">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
