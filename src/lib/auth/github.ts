const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
}

export function getGitHubAuthUrl(clientId: string, state: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL || "https://alloymc.net"}/api/auth/github/callback`,
    scope: "read:user",
    state,
  });
  return `${GITHUB_AUTH_URL}?${params}`;
}

export async function exchangeCodeForToken(
  code: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const res = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const data = await res.json() as { access_token?: string; error?: string };
  if (!data.access_token) {
    throw new Error(data.error || "Failed to exchange code for token");
  }
  return data.access_token;
}

export async function getGitHubUser(accessToken: string): Promise<GitHubUser> {
  const res = await fetch(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch GitHub user");
  }

  return res.json() as Promise<GitHubUser>;
}
