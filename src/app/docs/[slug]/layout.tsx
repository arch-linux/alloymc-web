import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { getAllDocs, DOC_CATEGORIES } from "@/lib/docs";

export default function DocSlugLayout({ children }: { children: React.ReactNode }) {
  const docs = getAllDocs();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex gap-10">
        <DocsSidebar categories={DOC_CATEGORIES} docs={docs} />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
