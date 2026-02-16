import { DownloadIcon } from "@/components/icons";
import { formatRelativeTime, formatFileSize } from "@/lib/utils/format";

interface Version {
  id: number;
  version: string;
  changelog: string | null;
  downloadUrl: string;
  minecraftVersion: string | null;
  fileSize: number | null;
  createdAt: string;
}

interface VersionListProps {
  versions: Version[];
}

export function VersionList({ versions }: VersionListProps) {
  if (versions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-500">No versions published yet.</p>
        <p className="text-sm text-stone-600 mt-1">
          Set up a GitHub webhook to auto-publish releases.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {versions.map((v, i) => (
        <div
          key={v.id}
          className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
            i === 0
              ? "border-ember/30 bg-ember/5"
              : "border-obsidian-700 bg-obsidian-900/50"
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-semibold text-stone-100">v{v.version}</span>
              {i === 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-ember/20 text-ember font-medium">
                  Latest
                </span>
              )}
              {v.minecraftVersion && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-obsidian-800 text-stone-400">
                  MC {v.minecraftVersion}
                </span>
              )}
              {v.fileSize && (
                <span className="text-xs text-stone-500">
                  {formatFileSize(v.fileSize)}
                </span>
              )}
            </div>
            {v.changelog && (
              <p className="text-sm text-stone-400 mt-2 line-clamp-3 whitespace-pre-wrap">
                {v.changelog}
              </p>
            )}
            <p className="text-xs text-stone-500 mt-2">
              {formatRelativeTime(new Date(v.createdAt))}
            </p>
          </div>

          <a
            href={v.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-obsidian-800 text-stone-300 text-sm hover:text-ember hover:bg-obsidian-700 border border-obsidian-700 transition-colors"
          >
            <DownloadIcon className="w-4 h-4" />
            Download
          </a>
        </div>
      ))}
    </div>
  );
}
