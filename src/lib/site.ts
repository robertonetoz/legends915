/**
 * Everything the shop might need to change lives in this file:
 * phones, addresses, hours, prices, barbers and reviews.
 */

export const site = {
  name: "Legends Barbershop",
  shortName: "Legends 915",
  url: "https://legendsbarbershop915.com", // TODO: replace with the final domain
  description:
    "Fades, designs, beard work and kids' cuts in El Paso and Horizon City, TX. Walk-ins welcome, appointments available.",
  timezone: "America/Denver", // El Paso runs on Mountain Time

  phones: {
    walkIns: { label: "Shop line", display: "(915) 471-9786", e164: "+19154719786" },
    appointments: { label: "Appointments", display: "(915) 920-5204", e164: "+19159205204" },
  },

  social: {
    instagram: { handle: "@legends915", url: "https://www.instagram.com/legends915/" },
    facebook: { handle: "Legends Barbershop 915", url: "https://www.facebook.com/legendsbarbershop915/" },
  },

  rating: {
    google: { score: 4.6, count: 394, url: "https://www.google.com/maps/search/?api=1&query=Legends+Barbershop+915+1505+George+Dieter+Dr+El+Paso+TX" },
    facebookRecommend: 98,
  },
} as const;

export type Location = {
  id: "eastside" | "horizon";
  name: string;
  area: string;
  street: string;
  suite?: string;
  city: string;
  state: string;
  zip: string;
  landmark?: string;
  mapQuery: string;
};

export const locations: Location[] = [
  {
    id: "eastside",
    name: "El Paso",
    area: "East El Paso",
    street: "1505 George Dieter Dr",
    suite: "Suite 105",
    city: "El Paso",
    state: "TX",
    zip: "79936",
    landmark: "Inside The Shops at Dieter Village",
    mapQuery: "Legends Barbershop 915, 1505 George Dieter Dr, El Paso, TX 79936",
  },
  {
    id: "horizon",
    name: "Horizon City",
    area: "Eastlake / Horizon City",
    street: "19021 Darrington Rd",
    city: "Horizon City",
    state: "TX",
    zip: "79928",
    mapQuery: "19021 Darrington Rd, Horizon City, TX 79928",
  },
];

/** 0 = Sunday … 6 = Saturday. Times in 24h, shop local time. */
export const hours: { day: number; label: string; open: string; close: string }[] = [
  { day: 1, label: "Monday", open: "09:00", close: "19:00" },
  { day: 2, label: "Tuesday", open: "09:00", close: "19:00" },
  { day: 3, label: "Wednesday", open: "09:00", close: "19:00" },
  { day: 4, label: "Thursday", open: "09:00", close: "19:00" },
  { day: 5, label: "Friday", open: "09:00", close: "19:00" },
  { day: 6, label: "Saturday", open: "08:00", close: "18:00" },
  { day: 0, label: "Sunday", open: "09:00", close: "17:00" },
];

export type Service = {
  name: string;
  price: number;
  from?: boolean;
  minutes: number;
  note: string;
};

/** TODO: confirm prices with the shop before launch. */
export const services: Service[] = [
  { name: "Haircut", price: 25, minutes: 30, note: "Fade, taper or scissor cut, finished with a hot towel and line up." },
  { name: "Haircut & beard", price: 35, minutes: 45, note: "Full cut plus beard shaping, razor lines and conditioning." },
  { name: "Kids cut", price: 20, minutes: 30, note: "12 and under. Patient barbers, no rushing." },
  { name: "Line up & beard", price: 20, minutes: 20, note: "Edge up the hairline and clean up the beard between cuts." },
  { name: "Beard trim", price: 15, minutes: 15, note: "Shape, trim and razor-sharp edges." },
  { name: "Freehand design", price: 10, from: true, minutes: 15, note: "Parts, lines or full artwork. Price depends on detail." },
  { name: "Eyebrows", price: 5, minutes: 5, note: "Clean up or add slits." },
];

export type Barber = {
  id: string;
  name: string;
  handle?: string;
  handleUrl?: string;
  known: string;
  tags: string[];
  quote: { text: string; author: string };
};

export const barbers: Barber[] = [
  {
    id: "rudy",
    name: "Rudy",
    known: "Kids' cuts, fades, and textured and curly hair",
    tags: ["Kids", "Curls & coils", "Fades"],
    quote: {
      text: "Very knowledgeable about a variety of hair textures and curl patterns.",
      author: "Jessica W.",
    },
  },
  {
    id: "moises",
    name: "Moises",
    known: "Detailed fades and easy conversation",
    tags: ["Fades", "Detail work", "New clients"],
    quote: {
      text: "Very detailed with his clients and very friendly and talkative.",
      author: "R.",
    },
  },
  {
    id: "oscar",
    name: "Oscar",
    known: "Clean, comfortable cuts for every age",
    tags: ["Kids", "Classic cuts", "Tapers"],
    quote: {
      text: "Super friendly, easygoing, and made my son feel comfortable.",
      author: "Patricia C.",
    },
  },
  {
    id: "brianna",
    name: "Brianna",
    handle: "@koldheartedblendz",
    handleUrl: "https://www.instagram.com/koldheartedblendz/",
    known: "Precise fades and freehand designs",
    tags: ["Designs", "Fades", "Walk-ins"],
    quote: {
      text: "Consistently delivers clean, precise fades and impressive designs.",
      author: "Justine H.",
    },
  },
];

export const reviews = [
  {
    text: "My boys' barber did an amazing job and really paid attention to every detail. The cut came out exactly how I wanted.",
    author: "Merary D.",
  },
  {
    text: "He gets him in and out in about 30 minutes and keeps him talking the whole time to help keep him calm.",
    author: "Pam R.",
  },
  {
    text: "Was a walk-in client, but now found my new barber. Super professional, does a great clean cut.",
    author: "Charles E.",
  },
  {
    text: "Very versatile and adaptable when I decided to switch from one hairstyle to another.",
    author: "D. S.",
  },
];

export const telHref = (e164: string) => `tel:${e164}`;

export function formatAddress(l: Location) {
  return `${l.street}${l.suite ? `, ${l.suite}` : ""}, ${l.city}, ${l.state} ${l.zip}`;
}
