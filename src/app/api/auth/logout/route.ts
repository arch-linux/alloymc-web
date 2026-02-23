import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";
import { getEnv } from "@/lib/cloudflare";

export async function POST() {
  const env = await getEnv();
  const response = NextResponse.json({ ok: true });
  await destroySession(env.SESSIONS, env.SESSION_SECRET, response);
  return response;
}
