import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { mods, modVersions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getEnv } from "@/lib/cloudflare";

type RouteParams = { params: Promise<{ slug: string }> };

async function verifySignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const computed = "sha256=" + Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Timing-safe comparison
  if (computed.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < computed.length; i++) {
    mismatch |= computed.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const env = await getEnv();
  const db = getDb(env.DB);

  // Look up mod by slug
  const mod = await db
    .select({ id: mods.id, webhookSecret: mods.webhookSecret })
    .from(mods)
    .where(eq(mods.slug, slug))
    .get();

  if (!mod || !mod.webhookSecret) {
    // Return 401 with no info leakage
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Read raw body for signature verification
  const body = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!signature) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const valid = await verifySignature(body, signature, mod.webhookSecret);
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse event
  const event = request.headers.get("x-github-event");
  if (event !== "release") {
    return NextResponse.json({ ok: true, message: "Event ignored" });
  }

  const payload = JSON.parse(body);
  if (payload.action !== "published") {
    return NextResponse.json({ ok: true, message: "Action ignored" });
  }

  const release = payload.release;
  const tag = release.tag_name?.replace(/^v/, "") || release.tag_name;
  const changelog = release.body || null;

  // Find .jar asset
  const jarAsset = release.assets?.find(
    (a: { name: string }) => a.name.endsWith(".jar") && !a.name.endsWith("-sources.jar") && !a.name.endsWith("-dev.jar")
  );

  const downloadUrl = jarAsset?.browser_download_url || release.html_url;
  const fileSize = jarAsset?.size || null;

  // Extract Minecraft version from tag or asset name if possible
  const mcVersionMatch = (jarAsset?.name || tag || "").match(/mc[_-]?(\d+\.\d+(?:\.\d+)?)/i);
  const minecraftVersion = mcVersionMatch ? mcVersionMatch[1] : null;

  await db.insert(modVersions).values({
    modId: mod.id,
    version: tag,
    changelog,
    downloadUrl,
    minecraftVersion,
    fileSize,
  });

  // Update mod's updatedAt
  await db.update(mods).set({ updatedAt: new Date() }).where(eq(mods.id, mod.id));

  return NextResponse.json({ ok: true, version: tag });
}
