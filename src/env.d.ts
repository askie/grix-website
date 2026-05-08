/// <reference types="astro/client" />

interface CloudflareEnv {
  DB: D1Database;
  [key: string]: unknown;
}

declare module "cloudflare:workers" {
  export const env: CloudflareEnv;
}
