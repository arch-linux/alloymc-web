import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getEnv(): Promise<CloudflareEnv> {
  const { env } = await getCloudflareContext();
  return env as CloudflareEnv;
}
