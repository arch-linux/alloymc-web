interface CloudflareEnv {
  DB: D1Database;
  IMAGES_BUCKET: R2Bucket;
  SESSIONS: KVNamespace;
  ASSETS: Fetcher;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  SESSION_SECRET: string;
}
