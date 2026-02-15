import { cn } from "@/lib/cn";

type CodeBlockProps = {
  children: string;
  language?: string;
  filename?: string;
  className?: string;
};

export function CodeBlock({ children, language, filename, className }: CodeBlockProps) {
  return (
    <div className={cn("terminal rounded-xl overflow-hidden", className)}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <div className="terminal-dot bg-[#ff5f57]" />
        <div className="terminal-dot bg-[#febc2e]" />
        <div className="terminal-dot bg-[#28c840]" />
        {(filename || language) && (
          <span className="ml-3 font-mono text-xs text-stone-500">
            {filename || language}
          </span>
        )}
      </div>
      {/* Body */}
      <pre className="p-5 overflow-x-auto">
        <code className="font-mono text-sm text-stone-200 leading-relaxed">
          {children}
        </code>
      </pre>
    </div>
  );
}
