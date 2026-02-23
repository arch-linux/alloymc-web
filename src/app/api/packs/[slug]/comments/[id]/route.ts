import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { packs, packComments } from "@/lib/db/schema";
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

  // Get pack to check ownership
  const pack = await db.select({ id: packs.id, ownerId: packs.ownerId }).from(packs).where(eq(packs.slug, slug)).get();
  if (!pack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const commentId = parseInt(id);
  const comment = await db.select().from(packComments).where(eq(packComments.id, commentId)).get();
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // Only comment author or pack owner can delete
  if (comment.userId !== session.userId && pack.ownerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Soft delete
  await db
    .update(packComments)
    .set({ deletedAt: new Date() })
    .where(eq(packComments.id, commentId));

  return NextResponse.json({ ok: true });
}
