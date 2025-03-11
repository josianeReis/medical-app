import { getDbClient, schema } from "@packages/data-access";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "./env";
import { openAPI } from "better-auth/plugins";

const db = getDbClient(env.DB_URL);

export const auth = betterAuth({

    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins: [openAPI(),]
});