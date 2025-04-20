import { generateEnv } from "@packages/utils";
import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().default("http://localhost:4010/api"),
  AUTH_SERVICE_URL: z.string().default("http://localhost:4010/api/auth"),
  AUTH_SESSION_COOKIE_NAME: z.string().default("laudos-auth.session"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
});

export const env = generateEnv(envSchema);
