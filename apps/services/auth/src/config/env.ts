import { generateEnv } from '@packages/utils';
import { z } from 'zod';

const envSchema = z.object({
	DB_URL: z.string().min(1),
	API_PORT: z.string().min(1).default("4010"),
	BETTER_AUTH_SECRET: z.string().min(1).default("mrnPLFHsbyvPXeifQJTYBaQf7ZtzTkfQ"),
	BETTER_AUTH_URL: z.string().optional().default("http://localhost:3000"),
	DEFAULT_EMAIl_FROM: z.string().optional().default("laudos-no-reply@updates.ferreiralucas.dev"),
	RESEND_API_KEY: z.string().min(1),
});

export const env = generateEnv(envSchema);
