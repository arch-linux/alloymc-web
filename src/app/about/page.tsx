import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MoltenCracks } from "@/components/effects/MoltenCracks";
import { ZapIcon, LayersIcon, CpuIcon, UsersIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Alloy exists — a from-scratch Minecraft modding ecosystem built for the future.",
};

const pillars = [
  {
    icon: <ZapIcon className="w-8 h-8 text-ember" />,
    title: "No Legacy Baggage",
    description:
      "Every decision is made for the current and future state of Minecraft. We don't carry forward years of workarounds and compatibility hacks.",
  },
  {
    icon: <LayersIcon className="w-8 h-8 text-ember" />,
    title: "Developer Experience",
    description:
      "If a modder has to fight the tools to get work done, the tools are wrong. Alloy is designed around the developer, not the other way around.",
  },
  {
    icon: <CpuIcon className="w-8 h-8 text-ember" />,
    title: "Automation First",
    description:
      "Mappings updates, build pipelines, version support — everything that can be automated, is. Humans should write mods, not babysit infrastructure.",
  },
  {
    icon: <UsersIcon className="w-8 h-8 text-ember" />,
    title: "Community Governed",
    description:
      "No single point of failure. No benevolent dictator. Alloy is built by the community, governed transparently, and open to contribution from day one.",
  },
];

const roadmap = [
  {
    phase: "Phase 1",
    title: "Foundation",
    status: "In Progress",
    items: [
      "Core mod loader implementation",
      "Initial modding API design",
      "Automated mappings pipeline",
      "Project website and documentation",
    ],
  },
  {
    phase: "Phase 2",
    title: "Developer Preview",
    status: "Upcoming",
    items: [
      "Public API release for mod developers",
      "Gradle plugin and mod templates",
      "Example mods and tutorials",
      "Community feedback integration",
    ],
  },
  {
    phase: "Phase 3",
    title: "Launch",
    status: "Planned",
    items: [
      "Stable 1.0 release",
      "Launcher with modpack support",
      "Mod repository / distribution",
      "Full documentation and guides",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 px-6">
        <MoltenCracks />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-stone-100 mb-6">
            Why <span className="text-ember">Alloy</span> Exists
          </h1>
          <p className="text-lg text-stone-400 leading-relaxed">
            The Minecraft modding ecosystem is fractured, bogged down by technical debt,
            and governed by drama. The existing platforms started as passion projects
            that grew beyond their architecture. Rather than patch what&apos;s broken,
            we&apos;re building what should have existed all along.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 px-6 bg-obsidian-900/50">
        <div className="mx-auto max-w-4xl">
          <SectionHeading title="Our Philosophy" />
          <div className="prose prose-invert max-w-none text-stone-300 space-y-6 text-lg leading-relaxed">
            <p>
              Alloy is not a fork. It is not built on top of Forge, Fabric, Quilt, or anything
              else. Every component — the mod loader, the API, the mappings, the modpack
              format, the launcher — is original work, designed together as a cohesive system.
            </p>
            <p>
              We believe the next generation of Minecraft modding should be built on
              modern tooling, automated pipelines, and clean architecture. Modders deserve
              an ecosystem that respects their time and doesn&apos;t fight them at every turn.
            </p>
            <p>
              This isn&apos;t about being different for the sake of it. It&apos;s about doing things
              right — the way they should have been done from the start.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            title="Core Pillars"
            subtitle="The principles that guide every decision we make."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <Card key={pillar.title} glow className="flex flex-col items-start gap-4">
                <div className="p-3 rounded-lg bg-ember/10 border border-ember/20">
                  {pillar.icon}
                </div>
                <h3 className="font-heading text-xl font-semibold text-stone-100">
                  {pillar.title}
                </h3>
                <p className="text-stone-400 leading-relaxed">{pillar.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-24 px-6 bg-obsidian-900/50">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            title="Roadmap"
            subtitle="Where we are and where we're headed."
          />
          <div className="space-y-8">
            {roadmap.map((phase, i) => (
              <div
                key={phase.phase}
                className="relative pl-8 border-l-2 border-obsidian-600"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${
                    i === 0
                      ? "bg-ember border-ember"
                      : "bg-obsidian-800 border-obsidian-600"
                  }`}
                />
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-heading font-bold text-stone-100 text-lg">
                    {phase.phase}: {phase.title}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      i === 0
                        ? "bg-ember/15 text-ember"
                        : "bg-obsidian-700 text-stone-400"
                    }`}
                  >
                    {phase.status}
                  </span>
                </div>
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="text-stone-400 flex items-start gap-2">
                      <span className="text-ember mt-1.5 text-xs">&#9670;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
