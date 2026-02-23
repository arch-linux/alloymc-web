import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getGitHubUser } from "@/lib/auth/github";
import { createSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getEnv } from "@/lib/cloudflare";

export async function GET(request: NextRequest) {
  const env = await getEnv();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // Validate state for CSRF protection
  if (!state || !code) {
    return NextResponse.redirect(new URL("/mods?error=invalid_request", request.url));
  }

  const storedState = await env.SESSIONS.get(`oauth_state:${state}`);
  if (!storedState) {
    return NextResponse.redirect(new URL("/mods?error=invalid_state", request.url));
  }

  // Clean up used state
  await env.SESSIONS.delete(`oauth_state:${state}`);

  try {
    // Exchange code for token
    const accessToken = await exchangeCodeForToken(
      code,
      env.GITHUB_CLIENT_ID,
      env.GITHUB_CLIENT_SECRET
    );

    // Get GitHub user profile
    const ghUser = await getGitHubUser(accessToken);

    // Upsert user in D1
    const db = getDb(env.DB);
    const existing = await db.select().from(users).where(eq(users.githubId, ghUser.id)).get();

    let userId: number;
    if (existing) {
      await db
        .update(users)
        .set({
          githubUsername: ghUser.login,
          avatarUrl: ghUser.avatar_url,
          displayName: ghUser.name || ghUser.login,
          bio: ghUser.bio,
        })
        .where(eq(users.id, existing.id));
      userId = existing.id;
    } else {
      const result = await db
        .insert(users)
        .values({
          githubId: ghUser.id,
          githubUsername: ghUser.login,
          avatarUrl: ghUser.avatar_url,
          displayName: ghUser.name || ghUser.login,
          bio: ghUser.bio,
        })
        .returning({ id: users.id });
      userId = result[0].id;
    }

    // Create redirect response first, then attach session cookie to it
    const response = NextResponse.redirect(new URL("/mods", request.url));

    await createSession(env.SESSIONS, env.SESSION_SECRET, {
      userId,
      githubUsername: ghUser.login,
      avatarUrl: ghUser.avatar_url,
      displayName: ghUser.name || ghUser.login,
    }, response);

    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.redirect(
      new URL(`/mods?error=auth_failed&detail=${encodeURIComponent(message)}`, request.url)
    );
  }
}
