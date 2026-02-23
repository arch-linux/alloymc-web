import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { packs, users } from "@/lib/db/schema";
import { eq, like, desc, asc, sql, and } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { validateSlug, validatePackName, validateDescription, validatePackCategory, validateGithubRepo, sanitizeMarkdown } from "@/lib/validation";
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
    conditions.push(like(packs.name, `%${q}%`));
  }
  if (category) {
    conditions.push(eq(packs.category, category));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderMap = {
    downloads: desc(packs.downloadCount),
    stars: desc(packs.starCount),
    newest: desc(packs.createdAt),
    updated: desc(packs.updatedAt),
  } as const;
  const orderBy = orderMap[sort as keyof typeof orderMap] ?? desc(packs.createdAt);

  const [results, countResult] = await Promise.all([
    db
      .select({
        id: packs.id,
        slug: packs.slug,
        name: packs.name,
        shortDescription: packs.shortDescription,
        iconUrl: packs.iconUrl,
        category: packs.category,
        downloadCount: packs.downloadCount,
        starCount: packs.starCount,
        createdAt: packs.createdAt,
        updatedAt: packs.updatedAt,
        ownerUsername: users.githubUsername,
        ownerAvatar: users.avatarUrl,
      })
      .from(packs)
      .innerJoin(users, eq(packs.ownerId, users.id))
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(packs)
      .where(whereClause),
  ]);

  const total = countResult[0]?.count ?? 0;

  return NextResponse.json({
    packs: results,
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
  const nameErr = validatePackName(name);
  if (nameErr) errors.name = nameErr;
  const descErr = validateDescription(shortDescription);
  if (descErr) errors.shortDescription = descErr;
  const catErr = validatePackCategory(category);
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
  const existing = await db.select({ id: packs.id }).from(packs).where(eq(packs.slug, slug)).get();
  if (existing) {
    return NextResponse.json({ errors: { slug: "This slug is already taken" } }, { status: 409 });
  }

  // Generate webhook secret
  const webhookSecret = crypto.randomUUID();

  const result = await db
    .insert(packs)
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
    .returning({ id: packs.id, slug: packs.slug });

  return NextResponse.json({
    pack: result[0],
    webhook: {
      url: `${new URL(request.url).origin}/api/webhooks/github-pack/${slug}`,
      secret: webhookSecret,
    },
  }, { status: 201 });
}
