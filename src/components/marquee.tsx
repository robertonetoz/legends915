import { Scissors } from "lucide-react";

const items = ["Walk-ins welcome", "Kids welcome", "Open 7 days", "Two locations", "Appointments available"];

export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((t) => (
        <li key={t} className="flex items-center">
          <span className="display px-8 text-4xl text-ink sm:text-5xl">{t}</span>
          <Scissors className="size-7 -rotate-90 text-red" aria-hidden />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative overflow-hidden bg-chalk py-5">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
