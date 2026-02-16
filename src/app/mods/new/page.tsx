"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { MOD_CATEGORIES } from "@/lib/constants";
import { MarkdownEditor } from "@/components/mods/MarkdownEditor";
import { PackageIcon } from "@/components/icons";

export default function NewModPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [webhookInfo, setWebhookInfo] = useState<{ url: string; secret: string } | null>(null);

  const [form, setForm] = useState({
    slug: "",
    name: "",
    shortDescription: "",
    longDescription: "",
    githubRepo: "",
    category: "",
    useGithubReadme: false,
  });

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  // Auto-generate slug from name
  function handleNameChange(name: string) {
    updateField("name", name);
    if (!form.slug || form.slug === slugify(form.name)) {
      updateField("slug", slugify(name));
    }
  }

  function slugify(s: string): string {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 64);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/mods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (await res.json()) as any;

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ _form: data.error || "Something went wrong" });
        }
        return;
      }

      setWebhookInfo(data.webhook);
    } catch {
      setErrors({ _form: "Network error" });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-ember border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <PackageIcon className="w-12 h-12 text-obsidian-600 mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-stone-100 mb-2">Sign in required</h1>
          <p className="text-stone-400 mb-6">You need to sign in with GitHub to submit a mod.</p>
          <a
            href="/api/auth/github"
            className="inline-flex px-6 py-3 rounded-lg bg-ember text-obsidian-950 font-medium hover:bg-ember-light transition-colors"
          >
            Sign in with GitHub
          </a>
        </div>
      </div>
    );
  }

  if (webhookInfo) {
    return (
      <div className="min-h-screen grid-overlay py-16">
        <div className="mx-auto max-w-2xl px-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
              <PackageIcon className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-stone-100">Mod Created!</h1>
            <p className="text-stone-400 mt-2">
              Set up the webhook below to auto-publish releases from GitHub.
            </p>
          </div>

          <div className="rounded-xl border border-obsidian-700 bg-obsidian-900 p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-stone-300 block mb-1">Webhook URL</label>
              <div className="terminal rounded-lg px-4 py-3 font-mono text-sm text-ember break-all">
                {webhookInfo.url}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-stone-300 block mb-1">Webhook Secret</label>
              <div className="terminal rounded-lg px-4 py-3 font-mono text-sm text-forge-gold break-all">
                {webhookInfo.secret}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Save this secret — it won&apos;t be shown again.
              </p>
            </div>
            <div className="pt-2 border-t border-obsidian-700">
              <h3 className="text-sm font-medium text-stone-200 mb-2">Setup Instructions</h3>
              <ol className="text-sm text-stone-400 space-y-1 list-decimal list-inside">
                <li>Go to your GitHub repo &rarr; Settings &rarr; Webhooks</li>
                <li>Add webhook with the URL above</li>
                <li>Set content type to <code className="text-ember">application/json</code></li>
                <li>Enter the secret above</li>
                <li>Select &quot;Releases&quot; events only</li>
              </ol>
            </div>
          </div>

          <div className="flex gap-3 mt-6 justify-center">
            <button
              onClick={() => router.push(`/mods/${form.slug}`)}
              className="px-6 py-3 rounded-lg bg-ember text-obsidian-950 font-medium hover:bg-ember-light transition-colors"
            >
              View Mod Page
            </button>
            <button
              onClick={() => router.push("/mods")}
              className="px-6 py-3 rounded-lg bg-obsidian-800 text-stone-300 font-medium border border-obsidian-700 hover:border-ember/30 transition-colors"
            >
              Browse Mods
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-overlay py-16">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-stone-100">Submit a Mod</h1>
          <p className="text-stone-400 mt-2">
            List your mod on the Alloy Mod Explorer. A GitHub webhook will be configured for auto-publishing releases.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors._form && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {errors._form}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="text-sm font-medium text-stone-200 block mb-1">
              Mod Name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-obsidian-700 bg-obsidian-900 text-stone-200 text-sm placeholder:text-stone-500 focus:outline-none focus:border-ember/50 transition-colors"
              placeholder="My Awesome Mod"
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="text-sm font-medium text-stone-200 block mb-1">
              Slug <span className="text-red-400">*</span>
            </label>
            <input
              id="slug"
              type="text"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="w-full px-3 py-2.5 rounded-lg border border-obsidian-700 bg-obsidian-900 text-stone-200 text-sm font-mono placeholder:text-stone-500 focus:outline-none focus:border-ember/50 transition-colors"
              placeholder="my-awesome-mod"
            />
            <p className="text-xs text-stone-500 mt-1">URL: alloymc.net/mods/{form.slug || "..."}</p>
            {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="text-sm font-medium text-stone-200 block mb-1">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-obsidian-700 bg-obsidian-900 text-stone-200 text-sm focus:outline-none focus:border-ember/50 transition-colors"
            >
              <option value="">Select a category</option>
              {MOD_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
          </div>

          {/* Short Description */}
          <div>
            <label htmlFor="shortDescription" className="text-sm font-medium text-stone-200 block mb-1">
              Short Description <span className="text-red-400">*</span>
            </label>
            <input
              id="shortDescription"
              type="text"
              value={form.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              maxLength={200}
              className="w-full px-3 py-2.5 rounded-lg border border-obsidian-700 bg-obsidian-900 text-stone-200 text-sm placeholder:text-stone-500 focus:outline-none focus:border-ember/50 transition-colors"
              placeholder="A brief description of what your mod does (10-200 chars)"
            />
            <p className="text-xs text-stone-500 mt-1">{form.shortDescription.length}/200</p>
            {errors.shortDescription && <p className="text-xs text-red-400 mt-1">{errors.shortDescription}</p>}
          </div>

          {/* GitHub Repo */}
          <div>
            <label htmlFor="githubRepo" className="text-sm font-medium text-stone-200 block mb-1">
              GitHub Repository
            </label>
            <input
              id="githubRepo"
              type="text"
              value={form.githubRepo}
              onChange={(e) => updateField("githubRepo", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-obsidian-700 bg-obsidian-900 text-stone-200 text-sm font-mono placeholder:text-stone-500 focus:outline-none focus:border-ember/50 transition-colors"
              placeholder="owner/repo"
            />
            {errors.githubRepo && <p className="text-xs text-red-400 mt-1">{errors.githubRepo}</p>}
          </div>

          {/* Use GitHub README */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.useGithubReadme}
              onChange={(e) => updateField("useGithubReadme", e.target.checked)}
              className="accent-ember w-4 h-4"
            />
            <div>
              <span className="text-sm text-stone-200">Use GitHub README as description</span>
              <p className="text-xs text-stone-500">Auto-fetches your repo&apos;s README.md</p>
            </div>
          </label>

          {/* Long Description */}
          {!form.useGithubReadme && (
            <div>
              <label className="text-sm font-medium text-stone-200 block mb-1">
                Long Description
              </label>
              <MarkdownEditor
                value={form.longDescription}
                onChange={(v) => updateField("longDescription", v)}
                placeholder="Write a detailed description in Markdown..."
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-ember text-obsidian-950 font-medium text-lg hover:bg-ember-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Creating..." : "Create Mod"}
          </button>
        </form>
      </div>
    </div>
  );
}
