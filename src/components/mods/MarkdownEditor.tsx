"use client";

import { useState } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your description in Markdown...",
  rows = 12,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="border border-obsidian-700 rounded-lg overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-obsidian-700 bg-obsidian-900">
        <button
          type="button"
          onClick={() => setTab("write")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "write"
              ? "text-ember border-b-2 border-ember"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "preview"
              ? "text-ember border-b-2 border-ember"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          Preview
        </button>
      </div>

      {/* Content */}
      {tab === "write" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 bg-obsidian-950 text-stone-200 text-sm font-mono placeholder:text-stone-500 focus:outline-none resize-y"
        />
      ) : (
        <div className="px-4 py-3 min-h-[200px] bg-obsidian-950">
          {value.trim() ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-stone-500 text-sm italic">Nothing to preview</p>
          )}
        </div>
      )}
    </div>
  );
}
