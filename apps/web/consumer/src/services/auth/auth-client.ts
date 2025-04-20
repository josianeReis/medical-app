import { User as BetterAuthUser } from "better-auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { env } from "../../utils/env";

export const authClient = createAuthClient({
  baseURL: env.AUTH_SERVICE_URL,
  
  plugins: [
    inferAdditionalFields({
      user: {
        firstName: { type: "string", required: true },
        lastName: { type: "string", required: true },
      },
    }),

    nextCookies(),
  ],
});

export type User = BetterAuthUser & { firstName: string; lastName: string };
