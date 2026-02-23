import { notFound } from "next/navigation";
import { getAllDocs, getDocBySlug } from "@/lib/docs";
import { DocContent } from "@/components/docs/DocContent";

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return { title: "Not Found" };
  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  return (
    <article className="min-w-0">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-stone-100 mb-2">
          {doc.title}
        </h1>
        <p className="text-stone-400">{doc.description}</p>
      </div>
      <DocContent sections={doc.sections} />
    </article>
  );
}
