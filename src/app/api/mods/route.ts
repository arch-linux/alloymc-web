import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { mods, users } from "@/lib/db/schema";
import { eq, like, desc, asc, sql, and } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { validateSlug, validateModName, validateDescription, validateCategory, validateGithubRepo, sanitizeMarkdown } from "@/lib/validation";
import { getEnv } from "@/lib/cloudflare";

export async function GET(request: NextRequest) {
  const env = await getEnv();
  const db = getDb(env.DB);
  const url = new URL(request.url);

  const q = url.searchParams.get("q") || "";
  const category = url.searchParams.get("category") || "";
  const sort = url.searchParams.get("sort") || "newest";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const offset = (page - 1) * limit;

  const conditions = [];
  if (q) {
    conditions.push(like(mods.name, `%${q}%`));
  }
  if (category) {
    conditions.push(eq(mods.category, category));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderMap = {
    downloads: desc(mods.downloadCount),
    stars: desc(mods.starCount),
    newest: desc(mods.createdAt),
    updated: desc(mods.updatedAt),
  } as const;
  const orderBy = orderMap[sort as keyof typeof orderMap] ?? desc(mods.createdAt);

  const [results, countResult] = await Promise.all([
    db
      .select({
        id: mods.id,
        slug: mods.slug,
        name: mods.name,
        shortDescription: mods.shortDescription,
        iconUrl: mods.iconUrl,
        category: mods.category,
        downloadCount: mods.downloadCount,
        starCount: mods.starCount,
        createdAt: mods.createdAt,
        updatedAt: mods.updatedAt,
        ownerUsername: users.githubUsername,
        ownerAvatar: users.avatarUrl,
      })
      .from(mods)
      .innerJoin(users, eq(mods.ownerId, users.id))
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(mods)
      .where(whereClause),
  ]);

  const total = countResult[0]?.count ?? 0;

  return NextResponse.json({
    mods: results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const env = await getEnv();
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    slug: string; name: string; shortDescription: string;
    longDescription?: string; githubRepo?: string; category: string; useGithubReadme?: boolean;
  };
  const { slug, name, shortDescription, longDescription, githubRepo, category, useGithubReadme } = body;

  // Validate all fields
  const errors: Record<string, string> = {};
  const slugErr = validateSlug(slug);
  if (slugErr) errors.slug = slugErr;
  const nameErr = validateModName(name);
  if (nameErr) errors.name = nameErr;
  const descErr = validateDescription(shortDescription);
  if (descErr) errors.shortDescription = descErr;
  const catErr = validateCategory(category);
  if (catErr) errors.category = catErr;
  if (githubRepo) {
    const repoErr = validateGithubRepo(githubRepo);
    if (repoErr) errors.githubRepo = repoErr;
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const db = getDb(env.DB);

  // Check slug uniqueness
  const existing = await db.select({ id: mods.id }).from(mods).where(eq(mods.slug, slug)).get();
  if (existing) {
    return NextResponse.json({ errors: { slug: "This slug is already taken" } }, { status: 409 });
  }

  // Generate webhook secret
  const webhookSecret = crypto.randomUUID();

  const result = await db
    .insert(mods)
    .values({
      slug,
      name,
      shortDescription,
      longDescription: longDescription ? sanitizeMarkdown(longDescription) : null,
      githubRepo: githubRepo || null,
      ownerId: session.userId,
      category,
      useGithubReadme: useGithubReadme ?? false,
      webhookSecret,
    })
    .returning({ id: mods.id, slug: mods.slug });

  return NextResponse.json({
    mod: result[0],
    webhook: {
      url: `${new URL(request.url).origin}/api/webhooks/github/${slug}`,
      secret: webhookSecret,
    },
  }, { status: 201 });
}
