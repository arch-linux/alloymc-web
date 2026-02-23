import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MoltenCracks } from "@/components/effects/MoltenCracks";
import { Button } from "@/components/ui/Button";
import {
  BookIcon,
  ZapIcon,
  PackageIcon,
  MapIcon,
  TerminalIcon,
  LayersIcon,
  CpuIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Alloy API reference, guides, and tutorials for mod developers.",
};

const categories = [
  {
    icon: <BookIcon className="w-7 h-7 text-ember" />,
    title: "Getting Started",
    description: "Installation, setup, and your first mod.",
    href: "/docs/getting-started",
    available: true,
  },
  {
    icon: <LayersIcon className="w-7 h-7 text-ember" />,
    title: "API Reference",
    description: "Complete reference for the Alloy modding API.",
    href: "/docs/api-overview",
    available: true,
  },
  {
    icon: <TerminalIcon className="w-7 h-7 text-ember" />,
    title: "Commands & Systems",
    description: "Commands, permissions, scheduling, and other systems.",
    href: "/docs/commands",
    available: true,
  },
  {
    icon: <PackageIcon className="w-7 h-7 text-ember" />,
    title: "Configuration",
    description: "Mod manifest, configuration API, and project setup.",
    href: "/docs/configuration",
    available: true,
  },
  {
    icon: <MapIcon className="w-7 h-7 text-ember" />,
    title: "Mappings",
    description: "Understanding Alloy's automated mappings pipeline.",
    href: "/docs/mappings",
    available: true,
  },
  {
    icon: <ZapIcon className="w-7 h-7 text-ember" />,
    title: "Examples",
    description: "Example mods and code snippets to learn from.",
    href: "/docs/examples",
    available: true,
  },
];

export default function DocsPage() {
  return (
    <>
      <section className="relative py-24 px-6">
        <MoltenCracks />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-stone-100 mb-6">
            Documentation
          </h1>
          <p className="text-lg text-stone-400 mb-6">
            Guides, references, and tutorials for building with Alloy.
          </p>
          <Badge variant="gold">Under Active Development</Badge>
          <div className="mt-6">
            <Button href="/docs/agent" variant="ghost" size="sm" className="gap-2 border border-obsidian-700 hover:border-ember/40">
              <CpuIcon className="w-4 h-4" />
              Are you an agent?
            </Button>
          </div>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            title="Browse by Category"
            subtitle="Select a topic to explore. More documentation is being added regularly."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Card key={cat.title} glow className="relative flex flex-col items-start gap-3">
                {!cat.available && (
                  <Badge variant="default" className="absolute top-4 right-4">
                    Soon
                  </Badge>
                )}
                <div className="p-3 rounded-lg bg-ember/10 border border-ember/20">
                  {cat.icon}
                </div>
                <h3 className="font-heading text-lg font-semibold text-stone-100">
                  {cat.title}
                </h3>
                <p className="text-sm text-stone-400 flex-1">{cat.description}</p>
                {cat.available ? (
                  <Button href={cat.href} variant="ghost" size="sm">
                    Read Docs &rarr;
                  </Button>
                ) : (
                  <span className="text-xs text-stone-400/60">Coming soon</span>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
