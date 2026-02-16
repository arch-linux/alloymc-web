export const MOD_CATEGORIES = [
  "adventure",
  "decoration",
  "economy",
  "food",
  "library",
  "magic",
  "management",
  "mobs",
  "optimization",
  "storage",
  "technology",
  "transportation",
  "utility",
  "worldgen",
] as const;

export type ModCategory = (typeof MOD_CATEGORIES)[number];

export function validateSlug(slug: string): string | null {
  if (!slug || slug.length < 2 || slug.length > 64) {
    return "Slug must be 2-64 characters";
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return "Slug must be lowercase alphanumeric with hyphens (no leading/trailing hyphens)";
  }
  if (["new", "edit", "api", "admin"].includes(slug)) {
    return "This slug is reserved";
  }
  return null;
}

export function validateModName(name: string): string | null {
  if (!name || name.length < 2 || name.length > 100) {
    return "Name must be 2-100 characters";
  }
  return null;
}

export function validateDescription(desc: string, maxLength = 200): string | null {
  if (!desc || desc.length < 10 || desc.length > maxLength) {
    return `Description must be 10-${maxLength} characters`;
  }
  return null;
}

export function validateCategory(category: string): string | null {
  if (!MOD_CATEGORIES.includes(category as ModCategory)) {
    return "Invalid category";
  }
  return null;
}

export function validateGithubRepo(repo: string): string | null {
  if (!repo) return null; // optional
  if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repo)) {
    return "GitHub repo must be in format owner/repo";
  }
  return null;
}

export function sanitizeMarkdown(md: string): string {
  // Strip HTML tags but keep markdown syntax
  return md
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function validateCommentContent(content: string): string | null {
  if (!content || content.trim().length < 1) {
    return "Comment cannot be empty";
  }
  if (content.length > 2000) {
    return "Comment must be under 2000 characters";
  }
  return null;
}
