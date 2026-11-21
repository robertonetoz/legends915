import { NextResponse } from "next/server";

/**
 * Booking requests.
 *
 * If RESEND_API_KEY and BOOKING_EMAIL_TO are set, each request is emailed to the
 * shop. Without them the endpoint answers { configured: false } and the form
 * falls back to sending the request as a text message to the appointments line.
 */

type Body = {
  location: string;
  barber: string;
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes?: string;
  website?: string; // honeypot
};

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let raw: Partial<Body>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Bots fill hidden fields; quietly accept and drop.
  if (clean(raw.website)) return NextResponse.json({ ok: true, delivered: true });

  const data: Body = {
    location: clean(raw.location),
    barber: clean(raw.barber),
    service: clean(raw.service),
    date: clean(raw.date),
    time: clean(raw.time),
    name: clean(raw.name, 80),
    phone: clean(raw.phone, 30),
    notes: clean(raw.notes, 600),
  };

  const digits = data.phone.replace(/\D/g, "");
  if (!data.name || digits.length < 10 || !data.service || !data.date || !data.time || !data.location) {
    return NextResponse.json({ ok: false, error: "Some required details are missing." }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_EMAIL_TO;
  if (!key || !to) {
    return NextResponse.json({ ok: true, delivered: false, configured: false });
  }

  const rows = [
    ["Name", data.name],
    ["Phone", data.phone],
    ["Shop", data.location],
    ["Barber", data.barber || "First available"],
    ["Service", data.service],
    ["Day", data.date],
    ["Time", data.time],
    ["Notes", data.notes || "None"],
  ];

  const html = `
    <h2 style="font-family:sans-serif">New booking request</h2>
    <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#666">${k}</td><td style="padding:6px 0"><b>${esc(v)}</b></td></tr>`).join("")}
    </table>
    <p style="font-family:sans-serif;color:#666">Text or call the client to confirm.</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.BOOKING_EMAIL_FROM ?? "Legends Website <onboarding@resend.dev>",
      to: to.split(",").map((s) => s.trim()),
      subject: `Booking request: ${data.name}, ${data.date} ${data.time}`,
      html,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ ok: true, delivered: false, configured: true });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
