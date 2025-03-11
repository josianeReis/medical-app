import { generateEnv } from '@packages/utils';
import { z } from 'zod';

const envSchema = z.object({
	DB_URL: z.string().min(1),
	API_PORT: z.number().min(1).default(4010),
	BETTER_AUTH_SECRET: z.string().min(1).default("mrnPLFHsbyvPXeifQJTYBaQf7ZtzTkfQ"),
	BETTER_AUTH_URL: z.string().optional().default("http://localhost:3000"),
});

export const env = generateEnv(envSchema);
