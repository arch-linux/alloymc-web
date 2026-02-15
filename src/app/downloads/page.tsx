import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GridOverlay } from "@/components/effects/GridOverlay";
import { DownloadIcon, TerminalIcon, PackageIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Download the Alloy launcher, installer, and mod development templates.",
};

const downloads = [
  {
    icon: <TerminalIcon className="w-8 h-8 text-ember" />,
    title: "Alloy Launcher",
    description:
      "Fast, minimal Minecraft launcher with native Alloy mod and modpack support. Available for Windows, macOS, and Linux.",
    platforms: ["Windows", "macOS", "Linux"],
    badge: "Coming Soon",
  },
  {
    icon: <DownloadIcon className="w-8 h-8 text-ember" />,
    title: "Alloy Installer",
    description:
      "Install Alloy into your existing Minecraft installation. One click, no configuration required.",
    platforms: ["Windows", "macOS", "Linux"],
    badge: "Coming Soon",
  },
  {
    icon: <PackageIcon className="w-8 h-8 text-ember" />,
    title: "Mod Template",
    description:
      "Pre-configured Gradle project template with Alloy API dependencies, example mod, and hot-reload support.",
    platforms: ["Gradle / IntelliJ IDEA"],
    badge: "Coming Soon",
  },
];

export default function DownloadsPage() {
  return (
    <>
      <section className="relative py-24 px-6">
        <GridOverlay />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-stone-100 mb-6">
            Downloads
          </h1>
          <p className="text-lg text-stone-400">
            Everything you need to get started with Alloy. All tools are free and
            open source.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6">
            {downloads.map((item) => (
              <Card key={item.title} glow className="flex flex-col sm:flex-row items-start gap-6">
                <div className="p-4 rounded-xl bg-ember/10 border border-ember/20 shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-heading text-xl font-semibold text-stone-100">
                      {item.title}
                    </h2>
                    <Badge variant="gold">{item.badge}</Badge>
                  </div>
                  <p className="text-stone-400 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.platforms.map((p) => (
                      <Badge key={p}>{p}</Badge>
                    ))}
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="shrink-0 opacity-50 cursor-not-allowed" disabled>
                  Coming Soon
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            title="Stay Updated"
            subtitle="Join our Discord or follow us on GitHub to be the first to know when downloads are available."
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/community" variant="secondary">
              Join the Community
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
