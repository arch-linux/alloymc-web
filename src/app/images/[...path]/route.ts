import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/cloudflare";

type RouteParams = { params: Promise<{ path: string[] }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { path } = await params;
  const key = path.join("/");
  const env = await getEnv();

  const object = await env.IMAGES_BUCKET.get(key);
  if (!object) {
    return new NextResponse("Not found", { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", object.httpMetadata?.contentType || "image/png");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new NextResponse(object.body as ReadableStream, { headers });
}
