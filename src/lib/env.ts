import { z } from "zod/v4";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.url(),

  // Redis
  REDIS_URL: z.url(),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // AI
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),

  // Research
  EXA_API_KEY: z.string().optional(),

  // Publishing
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
  TWITTER_API_KEY: z.string().optional(),
  TWITTER_API_SECRET: z.string().optional(),

  // Payments
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),

  // Node
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

function parseEnv() {
  // Skip validation during build time when env vars are not available
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return envSchema.parse({
      DATABASE_URL: "https://placeholder.db",
      REDIS_URL: "https://placeholder.redis",
      NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder-anon-key",
      ...process.env,
    });
  }
  return envSchema.parse(process.env);
}

export const env = parseEnv();
