import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { GridOverlay } from "@/components/effects/GridOverlay";
import { EmberGlow } from "@/components/effects/EmberGlow";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Getting Started",
  description: "Set up your development environment and create your first Alloy mod.",
};

const steps = [
  {
    number: 1,
    title: "Install Prerequisites",
    description:
      "You'll need JDK 21+ and an IDE with Gradle support. We recommend IntelliJ IDEA, but any Java IDE works.",
    code: `# Verify your Java version
java -version
# Should output: openjdk 21.x.x or higher`,
    filename: "terminal",
  },
  {
    number: 2,
    title: "Scaffold Your Mod",
    description:
      "Use the Alloy CLI to bootstrap a new mod project. It pulls the latest template, resolves dependencies, and generates mappings automatically.",
    code: `$ alloy init my-first-mod
✓ Scaffolded project from template
✓ Resolved Alloy API 1.0.0
✓ Generated mappings for 1.21.4

$ cd my-first-mod`,
    filename: "terminal",
  },
  {
    number: 3,
    title: "Configure Your Mod",
    description:
      "Edit alloy.mod.json in your project root to set your mod's ID, name, version, and description.",
    code: `{
  "id": "my-first-mod",
  "name": "My First Mod",
  "version": "1.0.0",
  "description": "A mod built with Alloy",
  "entrypoint": "com.example.MyMod",
  "minecraft": "1.21.x",
  "alloy": "1.0.x"
}`,
    filename: "alloy.mod.json",
  },
  {
    number: 4,
    title: "Write Your Mod",
    description:
      "Implement your mod's entry point. The Alloy API provides clean, well-documented hooks into the game.",
    code: `package com.example;

import net.alloymc.api.mod.AlloyMod;
import net.alloymc.api.mod.Mod;
import net.alloymc.api.event.lifecycle.InitEvent;

@Mod("my-first-mod")
public class MyMod implements AlloyMod {

    @Override
    public void onInit(InitEvent event) {
        event.logger().info("Hello from Alloy!");
    }
}`,
    filename: "src/main/java/com/example/MyMod.java",
  },
  {
    number: 5,
    title: "Build & Run",
    description:
      "One command. Alloy compiles your mod, launches Minecraft, and enables hot-reload so changes appear instantly.",
    code: `$ alloy dev
✓ Compiled in 340ms
✓ Hot-reload enabled
⚡ Minecraft 1.21.4 running with my-first-mod@1.0.0

# Make changes to your mod — they reload automatically.
# When you're ready to ship:

$ alloy publish
✓ Built release artifact
✓ Published my-first-mod@1.0.0`,
    filename: "terminal",
  },
];

export default function GettingStartedPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-32 px-6">
        <GridOverlay />
        <EmberGlow />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs text-ember uppercase tracking-widest mb-4">
            Developer Guide
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-stone-100 mb-6 leading-tight">
            Zero to running mod.<br />
            <span className="text-stone-500">Five steps.</span>
          </h1>
          <p className="text-lg text-stone-400 leading-relaxed">
            This guide assumes basic familiarity with Java. If you can write a class
            and run a Gradle task, you&apos;re ready.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="pb-32 px-6">
        <div className="mx-auto max-w-3xl space-y-16">
          {steps.map((step) => (
            <div key={step.number}>
              {/* Step header */}
              <div className="flex items-center gap-4 mb-6">
                <span className="stat-number font-heading text-3xl font-bold">
                  {String(step.number).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-heading text-xl font-semibold text-stone-100">
                    {step.title}
                  </h2>
                  <p className="text-sm text-stone-400 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Terminal */}
              <CodeBlock filename={step.filename}>
                {step.code}
              </CodeBlock>
            </div>
          ))}
        </div>
      </section>

      {/* What's Next */}
      <section className="relative pb-32 px-6 overflow-hidden">
        <EmberGlow />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-100 mb-4">
            You&apos;re in.
          </h2>
          <p className="text-stone-400 mb-10 text-lg leading-relaxed max-w-xl mx-auto">
            Explore the API docs, dig through example mods, or jump into Discord
            where the rest of the community builds in the open.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/docs">
              Read the Docs
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
            <Button href="/community" variant="secondary">
              Join Discord
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
