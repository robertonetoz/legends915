/**
 * A CSS barber pole: chrome caps, a glass tube, and stripes that climb forever.
 * Pure CSS so it costs nothing at runtime.
 */
export function BarberPole({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`} aria-hidden>
      {/* top cap */}
      <div className="h-[6%] w-[118%] rounded-t-full bg-[linear-gradient(90deg,#3a3a3a,#e8e8e8_35%,#ffffff_45%,#8a8a8a_75%,#2a2a2a)]" />
      <div className="h-[2%] w-[100%] bg-[linear-gradient(90deg,#1a1a1a,#9a9a9a_40%,#1a1a1a)]" />

      {/* tube */}
      <div className="relative w-full flex-1 overflow-hidden">
        <div className="stripes absolute inset-0 animate-pole" />
        {/* cylinder shading */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.55),rgba(0,0,0,.05)_30%,rgba(255,255,255,.45)_42%,rgba(255,255,255,0)_55%,rgba(0,0,0,.6))]" />
        {/* glass edges */}
        <div className="absolute inset-y-0 left-0 w-px bg-white/40" />
        <div className="absolute inset-y-0 right-0 w-px bg-white/20" />
      </div>

      <div className="h-[2%] w-[100%] bg-[linear-gradient(90deg,#1a1a1a,#9a9a9a_40%,#1a1a1a)]" />
      {/* bottom cap */}
      <div className="h-[6%] w-[118%] rounded-b-full bg-[linear-gradient(90deg,#3a3a3a,#e8e8e8_35%,#ffffff_45%,#8a8a8a_75%,#2a2a2a)]" />
    </div>
  );
}
