"use client";

const SPARKS = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  size: 1.5 + (i % 4) * 1.2,
  left: 5 + ((i * 17) % 90),
  bottom: (i * 7) % 35,
  delay: (i * 0.47) % 5,
  duration: 1.8 + (i % 5) * 0.6,
  color: i % 3 === 0 ? "bg-forge-gold" : "bg-ember",
}));

export function ForgeSparks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {SPARKS.map((s) => (
        <div
          key={s.id}
          className={`absolute rounded-full ${s.color} animate-spark-rise`}
          style={{
            width: `${s.size}px`,
            height: `${s.size}px`,
            left: `${s.left}%`,
            bottom: `${s.bottom}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
