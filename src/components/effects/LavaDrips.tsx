"use client";

const DRIPS = [
  { left: 8, delay: 0, duration: 4.5, width: 2, opacity: 0.5 },
  { left: 18, delay: 2.2, duration: 5.2, width: 2.5, opacity: 0.4 },
  { left: 31, delay: 0.8, duration: 4.8, width: 1.5, opacity: 0.35 },
  { left: 42, delay: 3.5, duration: 5.5, width: 2, opacity: 0.45 },
  { left: 55, delay: 1.5, duration: 4.2, width: 3, opacity: 0.5 },
  { left: 67, delay: 4.0, duration: 5.0, width: 2, opacity: 0.4 },
  { left: 76, delay: 0.3, duration: 4.6, width: 1.5, opacity: 0.3 },
  { left: 85, delay: 2.8, duration: 5.3, width: 2.5, opacity: 0.45 },
  { left: 93, delay: 1.0, duration: 4.4, width: 2, opacity: 0.35 },
];

export function LavaDrips() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {DRIPS.map((drip, i) => (
        <div
          key={i}
          className="absolute top-0 animate-lava-drip"
          style={{
            left: `${drip.left}%`,
            animationDelay: `${drip.delay}s`,
            animationDuration: `${drip.duration}s`,
          }}
        >
          {/* Drip head */}
          <div
            className="rounded-full bg-ember"
            style={{
              width: `${drip.width * 2}px`,
              height: `${drip.width * 2}px`,
              opacity: drip.opacity,
              boxShadow: `0 0 ${drip.width * 4}px ${drip.width}px rgba(255, 107, 0, 0.3)`,
            }}
          />
          {/* Trail */}
          <div
            className="mx-auto -mt-px"
            style={{
              width: `${drip.width}px`,
              height: `${40 + i * 8}px`,
              opacity: drip.opacity * 0.6,
              background: `linear-gradient(to bottom, #ff6b00, transparent)`,
              borderRadius: `${drip.width}px`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
