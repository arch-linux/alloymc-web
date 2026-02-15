import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { MoltenCracks } from "@/components/effects/MoltenCracks";
import {
  DiscordIcon,
  GitHubIcon,
  ExternalLinkIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Community",
  description: "Join the Alloy community on Discord and GitHub. Contribute to the project.",
};

export default function CommunityPage() {
  return (
    <>
      <section className="relative py-24 px-6">
        <MoltenCracks />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-stone-100 mb-6">
            Community
          </h1>
          <p className="text-lg text-stone-400">
            Alloy is built in the open. Join us, ask questions, report issues, or
            contribute code.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* Discord */}
            <Card glow className="flex flex-col items-start gap-4">
              <div className="p-4 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20">
                <DiscordIcon className="w-10 h-10 text-[#5865F2]" />
              </div>
              <h2 className="font-heading text-2xl font-semibold text-stone-100">
                Discord
              </h2>
              <p className="text-stone-400 leading-relaxed flex-1">
                The main hub for real-time discussion. Get help with modding, chat with
                the team, share your work, and stay updated on development progress.
              </p>
              <Button href={SITE.discord} external>
                Join Discord
                <ExternalLinkIcon />
              </Button>
            </Card>

            {/* GitHub */}
            <Card glow className="flex flex-col items-start gap-4">
              <div className="p-4 rounded-xl bg-stone-100/5 border border-stone-100/10">
                <GitHubIcon className="w-10 h-10 text-stone-100" />
              </div>
              <h2 className="font-heading text-2xl font-semibold text-stone-100">
                GitHub
              </h2>
              <p className="text-stone-400 leading-relaxed flex-1">
                All Alloy source code is open. Browse the repos, file issues, submit
                pull requests, and track our development in real time.
              </p>
              <Button href={SITE.github} external variant="secondary">
                View on GitHub
                <ExternalLinkIcon />
              </Button>
            </Card>
          </div>

          {/* Contributing */}
          <div id="contributing">
            <SectionHeading
              title="Contributing"
              subtitle="Alloy thrives on community contributions. Here's how to get involved."
            />
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Report Bugs",
                  description:
                    "Found something broken? Open an issue on GitHub with steps to reproduce.",
                },
                {
                  title: "Submit PRs",
                  description:
                    "Code contributions are welcome. Check our issues for 'good first issue' labels.",
                },
                {
                  title: "Write Docs",
                  description:
                    "Help us improve documentation, write tutorials, or create example mods.",
                },
              ].map((item) => (
                <Card key={item.title} className="text-center">
                  <h3 className="font-heading font-semibold text-stone-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-400">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-stone-400 mb-6">
              Ready to start building? Grab the tools and jump in.
            </p>
            <Button href="/getting-started">
              Get Started
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
