import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MoltenCracks } from "@/components/effects/MoltenCracks";
import { CpuIcon, DownloadIcon, TerminalIcon, PackageIcon } from "@/components/icons";
import { SetupInstructions } from "@/components/ui/SetupInstructions";

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
        <MoltenCracks />
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
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            title="Alloy MCP"
            subtitle="Give Claude complete control over your Alloy mod projects. 59 tools across 11 domains — project scaffolding, file management, Git, builds, block/GUI/animation editors, modpacks, and code intelligence."
          />
          <Card glow className="flex flex-col sm:flex-row items-start gap-6">
            <div className="p-4 rounded-xl bg-ember/10 border border-ember/20 shrink-0">
              <CpuIcon className="w-8 h-8 text-ember" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-heading text-xl font-semibold text-stone-100">
                  Alloy MCP Server
                </h2>
                <Badge variant="ember">v0.1.0</Badge>
              </div>
              <p className="text-stone-400 mb-4 leading-relaxed">
                Standalone MCP server binary that connects Claude to every Alloy IDE capability. Create projects, edit blocks, generate code, manage modpacks, run builds — all through natural language.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>macOS</Badge>
                <Badge>59 Tools</Badge>
                <Badge>4 Resources</Badge>
              </div>
              <SetupInstructions
                steps={[
                  {
                    label: "Download the binary and make it executable.",
                    code: "curl -L https://github.com/arch-linux/alloy/releases/download/v0.0.2/alloy-mcp -o /usr/local/bin/alloy-mcp && chmod +x /usr/local/bin/alloy-mcp",
                  },
                  {
                    label: "Add to your Claude Code MCP config at ~/.claude/mcp.json:",
                    code: `{
  "mcpServers": {
    "alloy-mcp": {
      "command": "alloy-mcp",
      "args": ["--project", "/path/to/your/alloy-project"]
    }
  }
}`,
                  },
                  {
                    label: "Restart Claude Code. All 59 tools will appear in /mcp.",
                  },
                ]}
              />
            </div>
            <Button
              href="https://github.com/arch-linux/alloy/releases/download/v0.0.2/alloy-mcp"
              external
              variant="primary"
              size="sm"
              className="shrink-0"
            >
              Download
            </Button>
          </Card>
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
