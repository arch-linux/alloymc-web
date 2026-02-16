import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getEnv } from "@/lib/cloudflare";

export async function GET() {
  const env = await getEnv();
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);

  if (!session) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: session });
}
