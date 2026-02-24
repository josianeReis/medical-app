import { generateEnv } from '@packages/utils';
import { z } from 'zod';

const envSchema = z.object({
	DB_URL: z.string().min(1),
	API_PORT: z.string().min(1).default('4010'),
	BETTER_AUTH_SECRET: z
		.string()
		.min(1)
		.default('mrnPLFHsbyvPXeifQJTYBaQf7ZtzTkfQ'),
	BETTER_AUTH_URL: z.string().optional().default('http://localhost:3000'),
	DEFAULT_EMAIL_FROM: z
		.string()
		.optional()
		.default('no-reply@updates.nexdoc.clinic'),
	RESEND_API_KEY: z.string().min(1),
	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_CLIENT_SECRET: z.string().min(1),
	APPLE_CLIENT_ID: z.string().optional(),
	APPLE_CLIENT_SECRET: z.string().optional(),
	TRUSTED_CALLBACK_URLS: z.string().optional(),
	NODE_ENV: z.string().optional(),
	NEXT_PUBLIC_APP_URL: z.string().optional().default('http://localhost:3000'),
	ENABLE_CROSS_SUB_DOMAIN_COOKIES: z.boolean().optional().default(false),
});

export const env = generateEnv(envSchema);
