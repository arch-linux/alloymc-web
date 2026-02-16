import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { mods, comments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { getEnv } from "@/lib/cloudflare";

type RouteParams = { params: Promise<{ slug: string; id: string }> };

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { slug, id } = await params;
  const env = await getEnv();
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb(env.DB);

  // Get mod to check ownership
  const mod = await db.select({ id: mods.id, ownerId: mods.ownerId }).from(mods).where(eq(mods.slug, slug)).get();
  if (!mod) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const commentId = parseInt(id);
  const comment = await db.select().from(comments).where(eq(comments.id, commentId)).get();
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // Only comment author or mod owner can delete
  if (comment.userId !== session.userId && mod.ownerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Soft delete
  await db
    .update(comments)
    .set({ deletedAt: new Date() })
    .where(eq(comments.id, commentId));

  return NextResponse.json({ ok: true });
}
