"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { MOD_CATEGORIES } from "@/lib/constants";
import { MarkdownEditor } from "@/components/mods/MarkdownEditor";
import { ImageIcon } from "@/components/icons";

export default function EditModPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState<string | null>(null);
  const [regenLoading, setRegenLoading] = useState(false);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [iconUploading, setIconUploading] = useState(false);
  const [iconError, setIconError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    longDescription: "",
    githubRepo: "",
    category: "",
    useGithubReadme: false,
  });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/mods/${slug}`);
      if (!res.ok) {
        router.push("/mods");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (await res.json()) as any;
      if (!data.isOwner) {
        router.push(`/mods/${slug}`);
        return;
      }
      setForm({
        name: data.mod.name,
        shortDescription: data.mod.shortDescription,
        longDescription: data.mod.longDescription || "",
        githubRepo: data.mod.githubRepo || "",
        category: data.mod.category,
        useGithubReadme: data.mod.useGithubReadme,
      });
      setIconUrl(data.mod.iconUrl);
      setWebhookUrl(`${window.location.origin}/api/webhooks/github/${slug}`);
      setLoading(false);
    }
    if (!authLoading) load();
  }, [slug, router, authLoading]);

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleIconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIconError("");
    setIconUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "icon");

      const res = await fetch(`/api/mods/${slug}/images`, {
        method: "POST",
        body: formData,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (await res.json()) as any;
      if (!res.ok) {
        setIconError(data.error || "Upload failed");
        return;
      }

      setIconUrl(data.url);
    } catch {
      setIconError("Network error");
    } finally {
      setIconUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRegenSecret() {
    if (!confirm("Regenerate webhook secret? Your existing GitHub webhook will stop working until you update it with the new secret.")) return;

    setRegenLoading(true);
    try {
      const res = await fetch(`/api/mods/${slug}/webhook-secret`, { method: "POST" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (await res.json()) as any;
      if (res.ok) {
        setWebhookSecret(data.secret);
      }
    } catch {
      // ignore
    } finally {
      setRegenLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch(`/api/mods/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (await res.json()) as any;
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else setErrors({ _form: data.error || "Something went wrong" });
        return;
      }

      router.push(`/mods/${slug}`);
    } catch {
      setErrors({ _form: "Network error" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this mod? This cannot be undone.")) return;

    const res = await fetch(`/api/mods/${slug}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/mods");
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-ember border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/api/auth/github");
    return null;
  }

  return (
    <div className="min-h-screen grid-overlay py-16">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-stone-100">Edit Mod</h1>
          <p className="text-stone-400 mt-2">Update your mod&apos;s information.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors._form && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {errors._form}
            </div>
          )}

          {/* Icon Upload */}
          <div>
            <label className="text-sm font-medium text-stone-200 block mb-2">
              Mod Icon
            </label>
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-xl border-2 border-dashed border-obsidian-600 bg-obsidian-900 flex items-center justify-center overflow-hidden cursor-pointer hover:border-ember/40 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {iconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={iconUrl.startsWith("/images/") ? `/api${iconUrl}` : iconUrl}
                    alt="Mod icon"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-obsidian-500" />
                )}
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={iconUploading}
                  className="px-4 py-2 rounded-lg bg-obsidian-800 text-stone-300 text-sm font-medium border border-obsidian-700 hover:border-obsidian-600 disabled:opacity-50 transition-colors"
                >
                  {iconUploading ? "Uploading..." : iconUrl ? "Change Icon" : "Upload Icon"}
                </button>
                <p className="text-xs text-stone-500 mt-1.5">
                  PNG, JPEG, WebP, or GIF. Max 512KB.
                </p>
                {iconError && <p className="text-xs text-red-400 mt-1">{iconError}</p>}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleIconUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="text-sm font-medium text-stone-200 block mb-1">
              Mod Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-obsidian-700 bg-obsidian-900 text-stone-200 text-sm focus:outline-none focus:border-ember/50 transition-colors"
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="text-sm font-medium text-stone-200 block mb-1">
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-obsidian-700 bg-obsidian-900 text-stone-200 text-sm focus:outline-none focus:border-ember/50 transition-colors"
            >
              {MOD_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
          </div>

          {/* Short Description */}
          <div>
            <label htmlFor="shortDescription" className="text-sm font-medium text-stone-200 block mb-1">
              Short Description
            </label>
            <input
              id="shortDescription"
              type="text"
              value={form.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              maxLength={200}
              className="w-full px-3 py-2.5 rounded-lg border border-obsidian-700 bg-obsidian-900 text-stone-200 text-sm focus:outline-none focus:border-ember/50 transition-colors"
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
              className="w-full px-3 py-2.5 rounded-lg border border-obsidian-700 bg-obsidian-900 text-stone-200 text-sm font-mono focus:outline-none focus:border-ember/50 transition-colors"
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
              />
            </div>
          )}

          {/* Webhook Config */}
          {webhookUrl && (
            <div className="rounded-xl border border-obsidian-700 bg-obsidian-900/50 p-4">
              <h3 className="text-sm font-medium text-stone-200 mb-2">Webhook Configuration</h3>
              <div className="terminal rounded-lg px-3 py-2 font-mono text-xs text-ember break-all">
                {webhookUrl}
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Point your GitHub webhook to this URL with &quot;Releases&quot; events.
              </p>

              {webhookSecret && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-stone-300 mb-1">New Webhook Secret:</p>
                  <div className="terminal rounded-lg px-3 py-2 font-mono text-xs text-forge-gold break-all select-all">
                    {webhookSecret}
                  </div>
                  <p className="text-xs text-yellow-500/80 mt-1">
                    Copy this now — it won&apos;t be shown again.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleRegenSecret}
                disabled={regenLoading}
                className="mt-3 px-3 py-1.5 rounded-lg border border-obsidian-600 text-xs text-stone-400 hover:text-stone-200 hover:border-obsidian-500 disabled:opacity-50 transition-colors"
              >
                {regenLoading ? "Regenerating..." : "Regenerate Webhook Secret"}
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-lg bg-ember text-obsidian-950 font-medium hover:bg-ember-light disabled:opacity-50 transition-colors"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/mods/${slug}`)}
              className="px-6 py-3 rounded-lg bg-obsidian-800 text-stone-300 font-medium border border-obsidian-700 hover:border-obsidian-600 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Danger zone */}
          <div className="pt-6 border-t border-obsidian-700">
            <h3 className="text-sm font-medium text-red-400 mb-2">Danger Zone</h3>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg border border-red-500/30 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Delete Mod
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
