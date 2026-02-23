import Link from "next/link";
import { PackageIcon } from "@/components/icons";

export default function PackNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <PackageIcon className="w-16 h-16 text-obsidian-600 mx-auto mb-4" />
        <h1 className="font-heading text-3xl font-bold text-stone-100 mb-2">Pack Not Found</h1>
        <p className="text-stone-400 mb-6">
          The pack you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/packs"
          className="inline-flex px-6 py-3 rounded-lg bg-ember text-obsidian-950 font-medium hover:bg-ember-light transition-colors"
        >
          Browse Packs
        </Link>
      </div>
    </div>
  );
}
