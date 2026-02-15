import { Button } from "@/components/ui/Button";
import { EmberGlow } from "@/components/effects/EmberGlow";

export default function NotFound() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-6">
      <EmberGlow />
      <div className="relative z-10 text-center">
        <p className="font-mono text-ember text-lg mb-2">404</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-stone-100 mb-4">
          Page Not Found
        </h1>
        <p className="text-stone-400 mb-8 max-w-md mx-auto">
          This page doesn&apos;t exist — maybe it was consumed by the forge. Let&apos;s
          get you back on track.
        </p>
        <Button href="/">Back to Home</Button>
      </div>
    </section>
  );
}
