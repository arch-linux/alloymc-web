import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { packs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { getEnv } from "@/lib/cloudflare";

type RouteParams = { params: Promise<{ slug: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const env = await getEnv();
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb(env.DB);
  const pack = await db
    .select({ id: packs.id, ownerId: packs.ownerId })
    .from(packs)
    .where(eq(packs.slug, slug))
    .get();

  if (!pack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (pack.ownerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const newSecret = crypto.randomUUID();
  await db
    .update(packs)
    .set({ webhookSecret: newSecret, updatedAt: new Date() })
    .where(eq(packs.id, pack.id));

  return NextResponse.json({
    secret: newSecret,
    webhookUrl: `${new URL(request.url).origin}/api/webhooks/github-pack/${slug}`,
  });
}
