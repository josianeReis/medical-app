import { generateEnv } from '@packages/utils';
import { z } from 'zod';

const booleanFromEnv = z.preprocess((value) => {
	if (typeof value !== 'string') return value;
	const normalized = value.trim().toLowerCase();
	if (normalized === 'true') return true;
	if (normalized === 'false') return false;
	return value;
}, z.boolean());

const nonEmptyStringOrDefault = z.preprocess(
	(value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
	z.string().min(1),
);

const envSchema = z.object({
	DB_URL: z.string().min(1),
	API_PORT: nonEmptyStringOrDefault.default('4010'),
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
	ENABLE_CROSS_SUB_DOMAIN_COOKIES: booleanFromEnv.optional().default(false),
	DISABLE_OUTBOUND_EMAIL: booleanFromEnv.optional().default(true),
});

export const env = generateEnv(envSchema);
