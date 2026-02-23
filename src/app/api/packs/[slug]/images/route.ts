import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { packs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { getEnv } from "@/lib/cloudflare";

type RouteParams = { params: Promise<{ slug: string }> };

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_ICON_SIZE = 512 * 1024; // 512KB
const MAX_BANNER_SIZE = 2 * 1024 * 1024; // 2MB

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

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string; // "icon" or "banner"

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type. Allowed: PNG, JPEG, WebP, GIF" }, { status: 400 });
  }

  const maxSize = type === "banner" ? MAX_BANNER_SIZE : MAX_ICON_SIZE;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `File too large. Max ${type === "banner" ? "2MB" : "512KB"}` },
      { status: 400 }
    );
  }

  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const key = `packs/${slug}/${type}.${ext}`;

  await env.IMAGES_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  const imageUrl = `/images/${key}`;
  const updateField = type === "banner" ? { bannerUrl: imageUrl } : { iconUrl: imageUrl };
  await db.update(packs).set({ ...updateField, updatedAt: new Date() }).where(eq(packs.id, pack.id));

  return NextResponse.json({ url: imageUrl });
}
