import { cookies } from "next/headers";

const SESSION_COOKIE = "alloy_session";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

interface SessionData {
  userId: number;
  githubUsername: string;
  avatarUrl: string;
  displayName: string;
}

async function hmacSign(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function hmacVerify(value: string, signature: string, secret: string): Promise<boolean> {
  const expected = await hmacSign(value, secret);
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createSession(
  kv: KVNamespace,
  secret: string,
  data: SessionData
): Promise<string> {
  const sessionId = crypto.randomUUID();
  await kv.put(`session:${sessionId}`, JSON.stringify(data), { expirationTtl: SESSION_TTL });

  const signature = await hmacSign(sessionId, secret);
  const cookieValue = `${sessionId}.${signature}`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, cookieValue, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });

  return sessionId;
}

export async function getSession(
  kv: KVNamespace,
  secret: string
): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie?.value) return null;

  const dotIndex = cookie.value.indexOf(".");
  if (dotIndex === -1) return null;

  const sessionId = cookie.value.slice(0, dotIndex);
  const signature = cookie.value.slice(dotIndex + 1);

  const valid = await hmacVerify(sessionId, signature, secret);
  if (!valid) return null;

  const raw = await kv.get(`session:${sessionId}`);
  if (!raw) return null;

  return JSON.parse(raw) as SessionData;
}

export async function destroySession(
  kv: KVNamespace,
  secret: string
): Promise<void> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (cookie?.value) {
    const dotIndex = cookie.value.indexOf(".");
    if (dotIndex !== -1) {
      const sessionId = cookie.value.slice(0, dotIndex);
      const signature = cookie.value.slice(dotIndex + 1);
      const valid = await hmacVerify(sessionId, signature, secret);
      if (valid) {
        await kv.delete(`session:${sessionId}`);
      }
    }
  }

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function requireAuth(
  kv: KVNamespace,
  secret: string
): Promise<SessionData> {
  const session = await getSession(kv, secret);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
