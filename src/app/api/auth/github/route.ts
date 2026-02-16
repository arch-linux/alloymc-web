import { NextResponse } from "next/server";
import { getGitHubAuthUrl } from "@/lib/auth/github";
import { getEnv } from "@/lib/cloudflare";

export async function GET() {
  const env = await getEnv();
  const state = crypto.randomUUID();

  // Store state in KV with 10-minute TTL for CSRF protection
  await env.SESSIONS.put(`oauth_state:${state}`, "1", { expirationTtl: 600 });

  const url = getGitHubAuthUrl(env.GITHUB_CLIENT_ID, state);
  return NextResponse.redirect(url);
}
