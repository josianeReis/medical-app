import { schema } from '@packages/data-access';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
import { dbClient } from './config/db';
import { env } from './config/env';
import { sendEmailVerification } from './services/email/sendEmailVerification';
import { sendRecoveryPasswordEmail } from './services/email/sendRecoveryPasswordEmail';

export const auth = betterAuth({
  trustedOrigins: ['http://localhost:3000', 'http://localhost:3000/email-verification/success', ...(env.TRUSTED_CALLBACK_URLS ? env.TRUSTED_CALLBACK_URLS.split(',') : [])],

  user: {
    fields: { name: 'firstName' },
    additionalFields: {
      firstName: { type: 'string', required: true },
      lastName: { type: 'string', required: true },
    },
  },
  database: drizzleAdapter(dbClient, { provider: 'pg', schema }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url, token }) => {
      sendRecoveryPasswordEmail(user.email, token, url, (user as Session['user']).firstName);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      sendEmailVerification(user.email, token, url, (user as Session['user']).firstName);
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    ...(env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET
      ? {
          apple: {
            clientId: env.APPLE_CLIENT_ID,
            clientSecret: env.APPLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  plugins: [openAPI({ disableDefaultReference: true })],
});

type Session = typeof auth.$Infer.Session;
