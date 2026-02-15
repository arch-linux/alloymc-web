"use client";

const RINGS = [
  { size: 300, delay: 0, duration: 5 },
  { size: 500, delay: 1.2, duration: 5.5 },
  { size: 750, delay: 2.4, duration: 6 },
  { size: 1050, delay: 3.6, duration: 6.5 },
];

export function AnvilRings() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {RINGS.map((ring, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border animate-anvil-ring"
            style={{
              width: `${ring.size}px`,
              height: `${ring.size}px`,
              animationDelay: `${ring.delay}s`,
              animationDuration: `${ring.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
