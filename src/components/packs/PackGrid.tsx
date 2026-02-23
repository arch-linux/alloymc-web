import { PackCard } from "./PackCard";
import { PackageIcon } from "@/components/icons";

interface PackData {
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

interface PackGridProps {
  packs: PackData[];
  emptyMessage?: string;
}

export function PackGrid({ packs, emptyMessage = "No packs found" }: PackGridProps) {
  if (packs.length === 0) {
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
      {packs.map((pack) => (
        <PackCard key={pack.slug} {...pack} />
      ))}
    </div>
  );
}
