import type { DocSection, ApiMethod, ApiField, EnumValue } from "@/lib/docs/types";

function MethodBlock({ method }: { method: ApiMethod }) {
  return (
    <div className="border border-obsidian-700/50 rounded-xl bg-obsidian-900/40 overflow-hidden">
      <div className="px-4 py-3 border-b border-obsidian-700/50 bg-obsidian-900/60">
        <code className="font-mono text-sm text-ember break-all">{method.signature}</code>
      </div>
      <div className="px-4 py-3 space-y-3">
        <p className="text-sm text-stone-300 leading-relaxed">{method.description}</p>

        {method.params && method.params.length > 0 && (
          <div>
            <p className="font-mono text-[11px] text-stone-500 uppercase tracking-widest mb-1.5">Parameters</p>
            <div className="space-y-1">
              {method.params.map((p) => (
                <div key={p.name} className="flex items-baseline gap-2 text-sm">
                  <code className="font-mono text-ember-light shrink-0">{p.name}</code>
                  <span className="font-mono text-[11px] text-stone-500">{p.type}</span>
                  <span className="text-stone-400">{p.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {method.returns && (
          <div>
            <p className="font-mono text-[11px] text-stone-500 uppercase tracking-widest mb-1">Returns</p>
            <div className="flex items-baseline gap-2 text-sm">
              <code className="font-mono text-forge-gold">{method.returns.type}</code>
              <span className="text-stone-400">{method.returns.description}</span>
            </div>
          </div>
        )}

        {method.example && (
          <pre className="terminal rounded-lg p-3 text-xs font-mono text-stone-300 overflow-x-auto">
            <code>{method.example}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

function FieldTable({ fields }: { fields: ApiField[] }) {
  return (
    <div className="border border-obsidian-700/50 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-obsidian-900/60 border-b border-obsidian-700/50">
            <th className="px-4 py-2 text-left font-mono text-[11px] text-stone-500 uppercase tracking-widest">Field</th>
            <th className="px-4 py-2 text-left font-mono text-[11px] text-stone-500 uppercase tracking-widest">Type</th>
            <th className="px-4 py-2 text-left font-mono text-[11px] text-stone-500 uppercase tracking-widest">Description</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.name} className="border-b border-obsidian-700/30 last:border-0">
              <td className="px-4 py-2.5">
                <code className="font-mono text-ember text-xs">{f.name}</code>
                {f.required && <span className="ml-1 text-[10px] text-red-400">*</span>}
              </td>
              <td className="px-4 py-2.5">
                <code className="font-mono text-stone-400 text-xs">{f.type}</code>
              </td>
              <td className="px-4 py-2.5 text-stone-300 text-xs">
                {f.description}
                {f.defaultValue && (
                  <span className="ml-1 text-stone-500">
                    (default: <code className="font-mono">{f.defaultValue}</code>)
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EnumTable({ values }: { values: EnumValue[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {values.map((v) => (
        <div key={v.name} className="px-3 py-2 rounded-lg border border-obsidian-700/50 bg-obsidian-900/30">
          <code className="font-mono text-xs text-ember">{v.name}</code>
          {v.description && (
            <p className="text-xs text-stone-400 mt-0.5">{v.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function SectionContent({ section, depth = 2 }: { section: DocSection; depth?: number }) {
  const HeadingTag = `h${Math.min(depth, 4)}` as keyof React.JSX.IntrinsicElements;
  const headingSizes: Record<number, string> = {
    2: "text-2xl",
    3: "text-xl",
    4: "text-lg",
  };

  return (
    <div id={section.id} className="scroll-mt-24">
      <HeadingTag
        className={`font-heading ${headingSizes[Math.min(depth, 4)] || "text-lg"} font-semibold text-stone-100 mb-4 mt-10 first:mt-0`}
      >
        {section.title}
      </HeadingTag>

      {section.content && (
        <div className="text-stone-400 leading-relaxed mb-4 space-y-3">
          {section.content.split("\n\n").map((paragraph, i) => (
            <p key={i} dangerouslySetInnerHTML={{
              __html: paragraph
                .replace(/`([^`]+)`/g, '<code class="font-mono text-xs text-ember bg-obsidian-800 px-1.5 py-0.5 rounded">$1</code>')
                .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-stone-200 font-medium">$1</strong>')
            }} />
          ))}
        </div>
      )}

      {section.code && (
        <pre className="terminal rounded-xl p-4 text-sm font-mono text-stone-300 overflow-x-auto mb-4">
          <code>{section.code}</code>
        </pre>
      )}

      {section.fields && section.fields.length > 0 && (
        <div className="mb-4">
          <FieldTable fields={section.fields} />
        </div>
      )}

      {section.enumValues && section.enumValues.length > 0 && (
        <div className="mb-4">
          <EnumTable values={section.enumValues} />
        </div>
      )}

      {section.methods && section.methods.length > 0 && (
        <div className="space-y-3 mb-4">
          {section.methods.map((m, i) => (
            <MethodBlock key={i} method={m} />
          ))}
        </div>
      )}

      {section.subsections?.map((sub) => (
        <SectionContent key={sub.id} section={sub} depth={depth + 1} />
      ))}
    </div>
  );
}

export function DocContent({ sections }: { sections: DocSection[] }) {
  return (
    <div className="space-y-2">
      {sections.map((section) => (
        <SectionContent key={section.id} section={section} />
      ))}
    </div>
  );
}
