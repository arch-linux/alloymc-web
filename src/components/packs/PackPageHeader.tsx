"use client";

import { useState } from "react";
import Link from "next/link";
import { StarButton } from "./StarButton";
import { ReportModal } from "./ReportModal";
import { EditIcon, FlagIcon, GitHubIcon } from "@/components/icons";
import { useAuth } from "@/lib/auth";
import { formatNumber } from "@/lib/utils/format";

interface PackPageHeaderProps {
  slug: string;
  name: string;
  shortDescription: string;
  iconUrl: string | null;
  bannerUrl: string | null;
  category: string;
  downloadCount: number;
  starCount: number;
  hasStarred: boolean;
  isOwner: boolean;
  githubRepo: string | null;
  ownerUsername: string;
  ownerAvatar: string;
  ownerDisplayName: string;
}

export function PackPageHeader({
  slug,
  name,
  shortDescription,
  iconUrl,
  bannerUrl,
  category,
  downloadCount,
  starCount,
  hasStarred,
  isOwner,
  githubRepo,
  ownerUsername,
  ownerAvatar,
  ownerDisplayName,
}: PackPageHeaderProps) {
  const { user } = useAuth();
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <>
      {/* Banner */}
      {bannerUrl && (
        <div className="h-48 md:h-64 w-full overflow-hidden rounded-xl border border-obsidian-700 mb-6">
          <img
            src={bannerUrl}
            alt={`${name} banner`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Icon */}
        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-obsidian-800 border border-obsidian-700 overflow-hidden flex items-center justify-center">
          {iconUrl ? (
            <img src={iconUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-heading font-bold text-ember/60">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-stone-100">
                {name}
              </h1>
              <p className="text-stone-400 mt-1">{shortDescription}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <StarButton slug={slug} initialStarred={hasStarred} initialCount={starCount} />
              {isOwner && (
                <Link
                  href={`/packs/${slug}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-obsidian-800 text-stone-300 text-sm border border-obsidian-700 hover:border-ember/30 hover:text-ember transition-colors"
                >
                  <EditIcon className="w-4 h-4" />
                  Edit
                </Link>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <img src={ownerAvatar} alt={ownerDisplayName} className="w-5 h-5 rounded-full" />
              <span className="text-sm text-stone-300">{ownerDisplayName}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-obsidian-800 text-stone-400 capitalize border border-obsidian-700">
              {category}
            </span>
            <span className="text-sm text-stone-500">
              {formatNumber(downloadCount)} downloads
            </span>
            {githubRepo && (
              <a
                href={`https://github.com/${githubRepo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-ember transition-colors"
              >
                <GitHubIcon className="w-4 h-4" />
                Source
              </a>
            )}
            {user && !isOwner && (
              <button
                onClick={() => setReportOpen(true)}
                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-red-400 transition-colors"
              >
                <FlagIcon className="w-3.5 h-3.5" />
                Report
              </button>
            )}
          </div>
        </div>
      </div>

      <ReportModal slug={slug} open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
}
