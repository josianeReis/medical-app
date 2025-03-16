import { betterAuth } from "better-auth";
import { dbClient } from "./config/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { schema } from "@packages/data-access";
import { sendEmailVerification } from './services/email/sendEmailVerification';
import { sendRecoveryPasswordEmail } from './services/email/sendRecoveryPasswordEmail';

export const auth = betterAuth({
  user: {
    fields: {
      name: "firstName"
    },
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
    },
  },
  database: drizzleAdapter(dbClient, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url, token }, request) => {
      sendRecoveryPasswordEmail(user.email, token, url, (user as Session["user"]).firstName)
    },
  },
  emailVerification: {
    sendOnSignUp: true,

    sendVerificationEmail: async ({ user, url, token }, request) => {
      sendEmailVerification(user.email, token, url, (user as Session["user"]).firstName)
    }
  },
  plugins: [openAPI({
    // disableDefaultReference: true
  })],
});

type Session = typeof auth.$Infer.Session;

