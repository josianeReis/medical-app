import { generateEnv } from "@packages/utils";
import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().default("http://localhost:4010/api"),
  AUTH_SERVICE_URL: z.string().default("http://localhost:4010"),
  AUTH_SESSION_COOKIE_NAME: z.string().default("laudos-auth.session"),
  AUTH_APP_ID: z.string().default(""),
  AUTH_APP_SECRET: z.string().default(""),
  AUTH_COOKIE_SECRET: z.string().default("yPEqRmJefpE7VDKyDWbBTxCs4mmHHWpA"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  NODE_ENV: z.string().default("development"),
  DEPLOY_ENVIRONMENT: z.string().default("development"),
  MANAGAMENT_API_URL: z.string().default("http://localhost:4011"),
});

export const env = generateEnv(envSchema);
