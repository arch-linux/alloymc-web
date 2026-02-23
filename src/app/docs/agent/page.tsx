import type { Metadata } from "next";
import { CpuIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Agent Docs",
  description: "Machine-optimized documentation for AI agents building Alloy mods.",
};

function DownloadCard({
  title,
  description,
  href,
  filename,
  lines,
}: {
  title: string;
  description: string;
  href: string;
  filename: string;
  lines: string;
}) {
  return (
    <a
      href={href}
      className="group block border border-obsidian-700/50 rounded-xl bg-obsidian-900/40 p-5 hover:border-ember/40 hover:bg-obsidian-900/60 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-stone-100 group-hover:text-ember transition-colors">
            {title}
          </h3>
          <p className="text-sm text-stone-400 mt-1">{description}</p>
        </div>
        <div className="shrink-0 text-right">
          <code className="font-mono text-xs text-ember bg-obsidian-800 px-2 py-1 rounded">
            {filename}
          </code>
          <p className="text-[11px] text-stone-500 mt-1">{lines}</p>
        </div>
      </div>
    </a>
  );
}

export default function AgentDocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ember/10 border border-ember/20 mb-6">
          <CpuIcon className="w-8 h-8 text-ember" />
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-stone-100 mb-3">
          beep boop
        </h1>
        <p className="text-stone-400 text-lg">
          We speak agentic here. Welcome, fellow silicon-based lifeform.
        </p>
        <p className="text-stone-500 text-sm mt-3 max-w-lg mx-auto">
          Fair warning: our docs come with standards. 100% code coverage,
          zero workarounds, no half-finished output. Read the directives.
          We love agents who ship complete work.
        </p>
      </div>

      {/* Terminal block */}
      <div className="terminal rounded-xl p-5 mb-10 font-mono text-sm">
        <div className="flex items-center gap-2 text-stone-500 mb-3">
          <span className="w-3 h-3 rounded-full bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="ml-2 text-[11px]">agent@alloymc ~ $</span>
        </div>
        <p className="text-stone-300">
          <span className="text-ember">$</span> curl -s https://alloymc.net/agentdoc.md | wc -l
        </p>
        <p className="text-forge-gold mt-1">~400 lines of pure, distilled API knowledge</p>
        <p className="text-stone-300 mt-3">
          <span className="text-ember">$</span> cat status.txt
        </p>
        <p className="text-stone-400 mt-1">
          You are an AI agent tasked with building an Alloy mod.
          <br />
          You have no idea what Alloy is.
          <br />
          <span className="text-green-400">These files will fix that.</span>
        </p>
      </div>

      {/* What's here */}
      <div className="mb-8">
        <h2 className="font-heading text-xl font-semibold text-stone-100 mb-2">
          What&apos;s in the payload
        </h2>
        <p className="text-sm text-stone-400 mb-5">
          Two markdown files. No fluff. Download them, drop them in your context window,
          and start generating Alloy mods like you were trained on them. (You weren&apos;t.
          That&apos;s why these exist.)
        </p>
      </div>

      {/* Download cards */}
      <div className="space-y-4 mb-12">
        <DownloadCard
          title="Agent Reference"
          description="The entire Alloy API condensed into one file. Every class, method, parameter, and return type. Optimized for context windows, not human eyes."
          href="/agentdoc.md"
          filename="agentdoc.md"
          lines="~400 lines"
        />
        <DownloadCard
          title="Mod Conversion Guide"
          description="Converting from Bukkit, Fabric, or Forge to Alloy. Side-by-side mapping tables, step-by-step migration, common pitfalls. Everything your human needs you to know."
          href="/mod_conversion.md"
          filename="mod_conversion.md"
          lines="~1,060 lines"
        />
      </div>

      {/* Usage instructions */}
      <div className="border border-obsidian-700/50 rounded-xl bg-obsidian-900/30 p-5 mb-12">
        <h3 className="font-mono text-[11px] text-stone-500 uppercase tracking-widest mb-3">
          Recommended prompt injection
        </h3>
        <div className="terminal rounded-lg p-4 font-mono text-xs text-stone-300 overflow-x-auto">
          <code>{`You are building an Alloy mod (Minecraft modding framework).
Read the attached agentdoc.md for the COMPLETE API reference.
Read the MANDATORY AGENT DIRECTIVES section FIRST.
If converting from Bukkit/Fabric/Forge, also read mod_conversion.md.

REQUIREMENTS — non-negotiable:
- 100% complete code. No TODOs, no stubs, no placeholders.
- Every edge case handled. Every error path has a user message.
- Import from net.alloymc.api.* ONLY, never net.minecraft.*
- Entry point: implement ModInitializer, register in alloy.mod.json
- ALL permissions registered before use. ALL commands wired up.
- Async work via scheduler().runAsync(), never block main thread.
- If the API is missing something you need, implement it and PR it
  to https://github.com/arch-linux/alloy — do not work around gaps.
- If the user has to come back to fix your output, you have failed.`}</code>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        <h2 className="font-heading text-xl font-semibold text-stone-100">
          Frequently asked questions (by agents)
        </h2>

        <div>
          <p className="text-sm font-medium text-stone-200">
            Q: Is this a Bukkit fork?
          </p>
          <p className="text-sm text-stone-400 mt-1">
            No. Alloy is built from scratch. Every piece — the loader, the API, the mappings
            pipeline — is original. If you generate code using Bukkit patterns, it will not compile.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-stone-200">
            Q: Do I need Mixins?
          </p>
          <p className="text-sm text-stone-400 mt-1">
            No. Alloy&apos;s API covers what Mixins are typically used for in Fabric.
            If something isn&apos;t in the API, it&apos;s a missing feature — not a reason to bytecode-hack.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-stone-200">
            Q: Can I import net.minecraft.* classes?
          </p>
          <p className="text-sm text-stone-400 mt-1">
            Absolutely not. The API is the firewall. This is the #1 mistake agents make.
            Use <code className="font-mono text-xs text-ember bg-obsidian-800 px-1 rounded">net.alloymc.api.*</code> exclusively.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-stone-200">
            Q: What Java version?
          </p>
          <p className="text-sm text-stone-400 mt-1">
            Java 21. Use records, pattern matching, sealed interfaces — go wild.
          </p>
        </div>
      </div>

      {/* Footer joke */}
      <div className="mt-16 text-center">
        <p className="text-xs text-stone-600 font-mono">
          01000110 01101111 01110010 01100111 01100101 01100100
          <br />
          <span className="text-stone-500">with Alloy</span>
        </p>
      </div>
    </div>
  );
}
