"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DocPage, DocCategory } from "@/lib/docs/types";
import { BookIcon, CloseIcon } from "@/components/icons";

interface DocsSidebarProps {
  categories: DocCategory[];
  docs: DocPage[];
}

function SidebarContent({
  categories,
  docs,
  pathname,
  onNavigate,
}: {
  categories: DocCategory[];
  docs: DocPage[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {categories.map((cat) => {
        const catDocs = docs.filter((d) => d.category === cat.id);
        if (catDocs.length === 0) return null;

        return (
          <div key={cat.id} className="mb-6">
            <p className="font-mono text-[11px] text-stone-500 uppercase tracking-widest mb-2 px-3">
              {cat.label}
            </p>
            <ul className="space-y-0.5">
              {catDocs.map((doc) => {
                const isActive = pathname === `/docs/${doc.slug}`;
                return (
                  <li key={doc.slug}>
                    <Link
                      href={`/docs/${doc.slug}`}
                      onClick={onNavigate}
                      className={`block px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        isActive
                          ? "bg-ember/10 text-ember border-l-2 border-ember"
                          : "text-stone-400 hover:text-stone-200 hover:bg-obsidian-800"
                      }`}
                    >
                      {doc.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
}

export function DocsSidebar({ categories, docs }: DocsSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="w-64 shrink-0 hidden lg:block" aria-label="Documentation">
        <div className="sticky top-[89px] max-h-[calc(100vh-89px)] overflow-y-auto pb-8 pr-4 -mr-4 scrollbar-thin">
          <SidebarContent categories={categories} docs={docs} pathname={pathname} />
        </div>
      </nav>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-obsidian-800 border border-obsidian-600 rounded-xl shadow-lg shadow-black/40 text-stone-200 hover:border-ember/40 transition-colors"
        aria-label="Open docs navigation"
      >
        <BookIcon className="w-5 h-5 text-ember" />
        <span className="text-sm font-medium">Docs Menu</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <nav
            className="absolute right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-obsidian-900 border-l border-obsidian-700 overflow-y-auto p-6"
            aria-label="Documentation"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-semibold text-stone-100">
                Documentation
              </h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-obsidian-800 transition-colors"
                aria-label="Close navigation"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent
              categories={categories}
              docs={docs}
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </nav>
        </div>
      )}
    </>
  );
}
