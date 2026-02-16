import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/db/schema.ts",
  dialect: "sqlite",
  ...(process.env.CLOUDFLARE_DATABASE_ID
    ? {
        driver: "d1-http",
        dbCredentials: {
          databaseId: process.env.CLOUDFLARE_DATABASE_ID,
          accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
          token: process.env.CLOUDFLARE_API_TOKEN!,
        },
      }
    : {
        dbCredentials: {
          url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/db.sqlite",
        },
      }),
});
