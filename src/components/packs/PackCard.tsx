import Link from "next/link";
import { DownloadIcon, StarIcon } from "@/components/icons";
import { formatNumber } from "@/lib/utils/format";

interface PackCardProps {
  slug: string;
  name: string;
  shortDescription: string;
  iconUrl: string | null;
  category: string;
  downloadCount: number;
  starCount: number;
  ownerUsername: string;
  ownerAvatar: string;
}

export function PackCard({
  slug,
  name,
  shortDescription,
  iconUrl,
  category,
  downloadCount,
  starCount,
  ownerUsername,
  ownerAvatar,
}: PackCardProps) {
  return (
    <Link
      href={`/packs/${slug}`}
      className="stage-card group block rounded-xl border border-obsidian-700/50 bg-obsidian-900/50 p-5 transition-all hover:border-ember/30 hover:bg-obsidian-800/50"
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-obsidian-800 border border-obsidian-700 overflow-hidden flex items-center justify-center">
          {iconUrl ? (
            <img src={iconUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-heading font-bold text-ember/60">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-stone-100 group-hover:text-ember transition-colors truncate">
            {name}
          </h3>
          <p className="text-sm text-stone-400 mt-1 line-clamp-2">{shortDescription}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={ownerAvatar}
            alt={ownerUsername}
            className="w-5 h-5 rounded-full"
          />
          <span className="text-xs text-stone-400">{ownerUsername}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-500">
          <span className="inline-flex items-center gap-1 capitalize rounded-full bg-obsidian-800 px-2 py-0.5 text-stone-400">
            {category}
          </span>
          <span className="inline-flex items-center gap-1">
            <DownloadIcon className="w-3.5 h-3.5" />
            {formatNumber(downloadCount)}
          </span>
          <span className="inline-flex items-center gap-1">
            <StarIcon className="w-3.5 h-3.5" />
            {formatNumber(starCount)}
          </span>
        </div>
      </div>
    </Link>
  );
}
