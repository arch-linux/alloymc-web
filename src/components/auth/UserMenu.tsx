"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ChevronDownIcon, LogOutIcon, StarIcon, PackageIcon } from "@/components/icons";

export function UserMenu() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-obsidian-700 animate-pulse" />;
  }

  if (!user) {
    return (
      <a
        href="/api/auth/github"
        className="px-4 py-2 text-sm text-stone-300 hover:text-ember border border-obsidian-600 hover:border-ember/50 rounded-lg transition-colors"
      >
        Sign In
      </a>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-obsidian-800 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <img
          src={user.avatarUrl}
          alt={user.displayName}
          className="w-8 h-8 rounded-full border border-obsidian-600"
        />
        <ChevronDownIcon className={`w-4 h-4 text-stone-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-obsidian-700 bg-obsidian-900 shadow-xl shadow-black/40 py-1 z-50">
          <div className="px-4 py-3 border-b border-obsidian-700">
            <p className="text-sm font-medium text-stone-100 truncate">{user.displayName}</p>
            <p className="text-xs text-stone-400 truncate">@{user.githubUsername}</p>
          </div>

          <div className="py-1">
            <Link
              href="/mods?owner=me"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-stone-300 hover:text-ember hover:bg-obsidian-800 transition-colors"
            >
              <PackageIcon className="w-4 h-4" />
              My Mods
            </Link>
            <Link
              href="/mods?starred=true"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-stone-300 hover:text-ember hover:bg-obsidian-800 transition-colors"
            >
              <StarIcon className="w-4 h-4" />
              Starred
            </Link>
          </div>

          <div className="border-t border-obsidian-700 py-1">
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-stone-400 hover:text-red-400 hover:bg-obsidian-800 transition-colors"
            >
              <LogOutIcon className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
