"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { StarIcon, StarFilledIcon } from "@/components/icons";
import { formatNumber } from "@/lib/utils/format";

interface StarButtonProps {
  slug: string;
  initialStarred: boolean;
  initialCount: number;
}

export function StarButton({ slug, initialStarred, initialCount }: StarButtonProps) {
  const { user } = useAuth();
  const [starred, setStarred] = useState(initialStarred);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const toggle = useCallback(async () => {
    if (!user) {
      window.location.href = "/api/auth/github";
      return;
    }

    // Optimistic update
    setStarred(!starred);
    setCount(starred ? count - 1 : count + 1);
    setLoading(true);

    try {
      const res = await fetch(`/api/mods/${slug}/star`, { method: "POST" });
      if (res.ok) {
        const data = (await res.json()) as { starred: boolean; starCount: number };
        setStarred(data.starred);
        setCount(data.starCount);
      } else {
        // Revert on error
        setStarred(starred);
        setCount(count);
      }
    } catch {
      setStarred(starred);
      setCount(count);
    } finally {
      setLoading(false);
    }
  }, [user, starred, count, slug]);

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        starred
          ? "bg-ember/15 text-ember border border-ember/30 hover:bg-ember/25"
          : "bg-obsidian-800 text-stone-300 border border-obsidian-700 hover:border-ember/30 hover:text-ember"
      }`}
    >
      {starred ? (
        <StarFilledIcon className="w-4 h-4 text-ember" />
      ) : (
        <StarIcon className="w-4 h-4" />
      )}
      <span>{formatNumber(count)}</span>
    </button>
  );
}
