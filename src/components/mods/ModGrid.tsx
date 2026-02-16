import { ModCard } from "./ModCard";
import { PackageIcon } from "@/components/icons";

interface ModData {
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

interface ModGridProps {
  mods: ModData[];
  emptyMessage?: string;
}

export function ModGrid({ mods, emptyMessage = "No mods found" }: ModGridProps) {
  if (mods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageIcon className="w-12 h-12 text-obsidian-600 mb-4" />
        <p className="text-stone-400 text-lg">{emptyMessage}</p>
        <p className="text-stone-500 text-sm mt-1">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mods.map((mod) => (
        <ModCard key={mod.slug} {...mod} />
      ))}
    </div>
  );
}
