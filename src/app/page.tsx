import { Button } from "@/components/ui/Button";
import { AnvilRings } from "@/components/effects/AnvilRings";
import { MoltenCracks } from "@/components/effects/MoltenCracks";
import { LavaDrips } from "@/components/effects/LavaDrips";
import { EmberGlow } from "@/components/effects/EmberGlow";
import { ArrowRightIcon } from "@/components/icons";

const PIPELINE_STAGES = [
  {
    num: "01",
    label: "Framework",
    title: "Custom Mod Loader",
    desc: "Not a fork. Not built on Forge, Fabric, or Quilt. A clean-room mod loader designed for how Minecraft actually works today — fast classloading, zero legacy overhead, built for modern JVMs.",
  },
  {
    num: "02",
    label: "API",
    title: "Modding API",
    desc: "A single, coherent API surface. Event-driven, well-typed, documented from day one. No guessing which of three deprecated methods is the right one.",
  },
  {
    num: "03",
    label: "Toolchain",
    title: "Automated Mappings",
    desc: "Deobfuscation that updates itself. When Mojang ships a snapshot, the pipeline runs. No waiting weeks for volunteers. No broken builds.",
  },
  {
    num: "04",
    label: "Client",
    title: "Alloy Launcher",
    desc: "Purpose-built launcher with native modpack support. Install, update, and launch — no manual jar shuffling, no third-party wrappers.",
  },
  {
    num: "05",
    label: "IDE",
    title: "Dev Environment",
    desc: "Gradle plugin, project templates, hot-reload, integrated debugging. Idea to running mod in minutes, not hours of environment wrestling.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <EmberGlow />
        <MoltenCracks />
        <AnvilRings />
        <LavaDrips />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          {/* Monospaced tag */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-obsidian-600 bg-obsidian-900/80 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-ember animate-glow-pulse" />
            <span className="font-mono text-xs text-stone-400 tracking-wider uppercase">
              Building in public
            </span>
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl font-bold text-stone-100 mb-6 leading-[0.95] tracking-tight">
            One ecosystem.<br />
            <span className="text-glow text-ember">Zero compromises.</span>
          </h1>

          <p className="text-lg md:text-xl text-stone-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Alloy is a complete Minecraft modding stack — custom framework, launcher,
            toolchain, and IDE — engineered together from a blank page. Every layer
            talks to every other. Nothing is bolted on.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button href="/getting-started" size="lg">
              Start Building
              <ArrowRightIcon className="w-5 h-5" />
            </Button>
            <Button href="/about" variant="secondary" size="lg">
              Read the Manifesto
            </Button>
          </div>

          {/* Pipeline preview — horizontal flow */}
          <div className="hidden md:flex items-center justify-center gap-0 max-w-3xl mx-auto" aria-label="The Alloy pipeline">
            {["Framework", "API", "Toolchain", "Client", "IDE"].map(
              (stage, i, arr) => (
                <div key={stage} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-lg border border-obsidian-500 bg-obsidian-800/80 backdrop-blur flex items-center justify-center text-xs font-mono text-ember font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <span className="text-[11px] font-mono text-stone-500 uppercase tracking-widest">
                      {stage}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-10 h-px pipeline-line mx-2 mt-[-18px]" />
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-obsidian-950 to-transparent" />
      </section>

      {/* ===== THE STACK — CORE PITCH ===== */}
      <section className="relative py-32 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl mb-20">
            <p className="font-mono text-xs text-ember uppercase tracking-widest mb-4">
              The full picture
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-stone-100 mb-6 leading-tight">
              Others give you a mod loader.<br />
              <span className="text-stone-500">We built the entire stack.</span>
            </h2>
            <p className="text-stone-400 text-lg leading-relaxed">
              Every existing modding platform is a patchwork — a loader here, a
              community-maintained mapping there, three competing launchers, and an
              API designed by committee a decade ago. Alloy is one integrated pipeline
              where every piece was designed to work with every other piece.
            </p>
          </div>

          {/* Pipeline stages — staggered layout */}
          <div className="space-y-6">
            {PIPELINE_STAGES.map((stage, i) => (
              <div
                key={stage.num}
                className="stage-card group grid md:grid-cols-[80px_1fr] gap-6 p-6 md:p-8 rounded-2xl border border-obsidian-700/50 bg-obsidian-900/40 hover:border-ember/20 hover:bg-obsidian-900/80 transition-all duration-500"
              >
                {/* Number */}
                <div className="flex md:flex-col items-center md:items-start gap-3">
                  <span className="stat-number font-heading text-3xl md:text-4xl font-bold">
                    {stage.num}
                  </span>
                  <span className="font-mono text-[11px] text-stone-500 uppercase tracking-widest">
                    {stage.label}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-heading text-xl md:text-2xl font-semibold text-stone-100 mb-3 group-hover:text-ember transition-colors duration-300">
                    {stage.title}
                  </h3>
                  <p className="text-stone-400 leading-relaxed max-w-2xl">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TERMINAL DEMO ===== */}
      <section className="relative py-32 px-6 overflow-hidden">
        <EmberGlow />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="font-mono text-xs text-ember uppercase tracking-widest mb-4">
              Developer experience
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-stone-100 mb-6">
              Idea to running mod.<br />
              <span className="text-stone-500">Three commands.</span>
            </h2>
          </div>

          {/* Terminal mockup */}
          <div className="terminal rounded-xl overflow-hidden max-w-3xl mx-auto">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="terminal-dot bg-[#ff5f57]" />
              <div className="terminal-dot bg-[#febc2e]" />
              <div className="terminal-dot bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-stone-500">terminal</span>
            </div>
            {/* Body */}
            <div className="p-6 font-mono text-sm leading-loose">
              <div className="flex gap-2">
                <span className="text-ember select-none">$</span>
                <span className="text-stone-200">alloy init my-mod</span>
              </div>
              <div className="text-stone-500 ml-5 text-xs">
                &#10003; Scaffolded project from template
              </div>
              <div className="text-stone-500 ml-5 text-xs">
                &#10003; Resolved Alloy API 1.0.0
              </div>
              <div className="text-stone-500 ml-5 text-xs mb-3">
                &#10003; Generated mappings for 1.21.4
              </div>
              <div className="flex gap-2">
                <span className="text-ember select-none">$</span>
                <span className="text-stone-200">cd my-mod && alloy dev</span>
              </div>
              <div className="text-stone-500 ml-5 text-xs">
                &#10003; Compiled in 340ms
              </div>
              <div className="text-stone-500 ml-5 text-xs">
                &#10003; Hot-reload enabled
              </div>
              <div className="text-forge-gold ml-5 text-xs mb-3">
                Minecraft 1.21.4 running with my-mod@0.1.0
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-ember select-none">$</span>
                <span className="text-stone-200">alloy publish</span>
              </div>
              <div className="text-stone-500 ml-5 text-xs">
                &#10003; Built release artifact
              </div>
              <div className="text-stone-500 ml-5 text-xs">
                &#10003; Published my-mod@0.1.0
              </div>
              <div className="flex gap-2 items-center mt-4">
                <span className="text-ember select-none">$</span>
                <span className="w-2 h-4 bg-stone-400 animate-blink" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT'S DIFFERENT ===== */}
      <section className="relative py-32 px-6">
        <MoltenCracks />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <p className="font-mono text-xs text-ember uppercase tracking-widest mb-4">
              Not incremental
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-stone-100">
              What this actually means
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left — the old way */}
            <div className="p-8 rounded-2xl border border-obsidian-700/50 bg-obsidian-900/30">
              <p className="font-mono text-xs text-stone-500 uppercase tracking-widest mb-6">
                The current state
              </p>
              <ul className="space-y-4">
                {[
                  "Pick a loader. Hope it supports the version you need.",
                  "Find community mappings. Wait for updates.",
                  "Three different launchers, none designed for modding.",
                  "API designed around Minecraft 1.7. In 2025.",
                  "Documentation scattered across wikis, Discord pins, and blog posts from 2019.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-stone-500">
                    <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-stone-600" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — the Alloy way */}
            <div className="p-8 rounded-2xl border border-ember/20 bg-obsidian-900/40">
              <p className="font-mono text-xs text-ember uppercase tracking-widest mb-6">
                With Alloy
              </p>
              <ul className="space-y-4">
                {[
                  "One loader, always current. Version support is automated.",
                  "Mappings update themselves when Mojang ships.",
                  "A launcher built for mods — install, update, launch.",
                  "API designed for modern Minecraft, modern Java.",
                  "Documentation is a first-class deliverable, not an afterthought.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-stone-200">
                    <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-ember" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-32 px-6 overflow-hidden">
        <EmberGlow />
        <AnvilRings />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-stone-100 mb-6 leading-tight">
            The best mods haven&apos;t<br />
            been written yet.
          </h2>
          <p className="text-lg text-stone-400 mb-12 max-w-xl mx-auto leading-relaxed">
            We&apos;re building Alloy in public. The code is open, the roadmap is
            transparent, and we ship every week. Come build with us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/getting-started" size="lg">
              Get Started
              <ArrowRightIcon className="w-5 h-5" />
            </Button>
            <Button href="/community" variant="secondary" size="lg">
              Join the Community
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
