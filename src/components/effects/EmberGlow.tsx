export function EmberGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Primary center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[800px] h-[500px] rounded-full bg-ember/6 blur-[150px] animate-glow-pulse" />
      {/* Off-center molten accent */}
      <div
        className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-molten/4 blur-[120px] animate-glow-pulse"
        style={{ animationDelay: "2s" }}
      />
      {/* Bottom forge warmth */}
      <div className="absolute -bottom-20 left-1/3 w-[600px] h-[200px] rounded-full bg-ember/5 blur-[100px]" />
    </div>
  );
}
