import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { packs, packReports } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { getEnv } from "@/lib/cloudflare";

type RouteParams = { params: Promise<{ slug: string }> };

const VALID_REASONS = ["malware", "spam", "copyright", "other"] as const;

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const env = await getEnv();
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { reason: string; description?: string };
  const { reason, description } = body;

  if (!VALID_REASONS.includes(reason as typeof VALID_REASONS[number])) {
    return NextResponse.json({ error: "Invalid reason" }, { status: 400 });
  }

  const db = getDb(env.DB);
  const pack = await db.select({ id: packs.id }).from(packs).where(eq(packs.slug, slug)).get();
  if (!pack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Prevent duplicate reports from same user
  const existing = await db
    .select({ id: packReports.id })
    .from(packReports)
    .where(
      and(
        eq(packReports.reporterId, session.userId),
        eq(packReports.packId, pack.id),
        eq(packReports.status, "open")
      )
    )
    .get();

  if (existing) {
    return NextResponse.json({ error: "You have already reported this pack" }, { status: 409 });
  }

  await db.insert(packReports).values({
    reporterId: session.userId,
    packId: pack.id,
    reason: reason as "malware" | "spam" | "copyright" | "other",
    description: description || null,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
