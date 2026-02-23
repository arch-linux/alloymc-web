"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type Step = {
  label: string;
  code?: string;
};

type SetupInstructionsProps = {
  steps: Step[];
};

export function SetupInstructions({ steps }: SetupInstructionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-ember transition-colors"
      >
        <svg
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            open && "rotate-45"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Setup Instructions
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-ember/15 border border-ember/30 text-ember text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-300">{step.label}</p>
                  {step.code && (
                    <pre className="mt-1.5 px-3 py-2 rounded-lg bg-obsidian-950 border border-obsidian-600 text-xs text-stone-400 font-mono overflow-x-auto">
                      <code>{step.code}</code>
                    </pre>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
