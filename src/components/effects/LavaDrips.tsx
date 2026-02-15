"use client";

const DRIPS = [
  { left: 7, delay: 0.5, duration: 6, size: 5 },
  { left: 19, delay: 3.2, duration: 7, size: 4 },
  { left: 33, delay: 1.0, duration: 5.5, size: 6 },
  { left: 48, delay: 4.5, duration: 6.5, size: 4 },
  { left: 58, delay: 2.0, duration: 5.8, size: 5 },
  { left: 71, delay: 5.5, duration: 7.2, size: 3 },
  { left: 82, delay: 0.2, duration: 6.2, size: 5 },
  { left: 92, delay: 3.8, duration: 5.6, size: 4 },
];

export function LavaDrips() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {DRIPS.map((drip, i) => (
        <div
          key={i}
          className="absolute animate-lava-drip"
          style={{
            left: `${drip.left}%`,
            top: -8,
            animationDelay: `${drip.delay}s`,
            animationDuration: `${drip.duration}s`,
          }}
        >
          {/* The droplet — a small rounded shape with glow */}
          <div
            style={{
              width: `${drip.size}px`,
              height: `${drip.size * 1.4}px`,
              borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
              background: "linear-gradient(to bottom, #f0b830, #ff6b00)",
              boxShadow: `0 0 ${drip.size * 2}px ${drip.size * 0.6}px rgba(255, 107, 0, 0.35), 0 ${drip.size}px ${drip.size * 3}px rgba(255, 107, 0, 0.15)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
