"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AlloyLogo, MenuIcon, CloseIcon, GitHubIcon } from "@/components/icons";
import { NAV_ITEMS, SITE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { UserMenu } from "@/components/auth/UserMenu";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isModsSection = pathname.startsWith("/mods");
  const isPacksSection = pathname.startsWith("/packs");

  return (
    <header className="sticky top-0 z-50 border-b border-obsidian-700/50 bg-obsidian-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 font-heading text-xl font-bold text-stone-100 hover:text-ember transition-colors"
        >
          <AlloyLogo className="w-8 h-8" />
          {SITE.name}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="px-4 py-2 text-sm text-stone-300 hover:text-ember transition-colors rounded-lg hover:bg-obsidian-800"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-stone-400 hover:text-stone-100 transition-colors"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <Button href="/downloads" size="sm">
            Download
          </Button>
          {(isModsSection || isPacksSection) && <UserMenu />}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-stone-300 hover:text-ember transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden border-t border-obsidian-700/50 bg-obsidian-950/95 backdrop-blur-xl">
          <ul className="flex flex-col px-6 py-4 gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-stone-200 hover:text-ember hover:bg-obsidian-800 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 border-t border-obsidian-700 mt-2">
              <Button href="/downloads" className="w-full" onClick={() => setMobileOpen(false)}>
                Download
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
