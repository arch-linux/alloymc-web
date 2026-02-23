import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { mods } from "@/lib/db/schema";
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
  const mod = await db
    .select({ id: mods.id, ownerId: mods.ownerId })
    .from(mods)
    .where(eq(mods.slug, slug))
    .get();

  if (!mod) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (mod.ownerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const newSecret = crypto.randomUUID();
  await db
    .update(mods)
    .set({ webhookSecret: newSecret, updatedAt: new Date() })
    .where(eq(mods.id, mod.id));

  return NextResponse.json({
    secret: newSecret,
    webhookUrl: `${new URL(request.url).origin}/api/webhooks/github/${slug}`,
  });
}
