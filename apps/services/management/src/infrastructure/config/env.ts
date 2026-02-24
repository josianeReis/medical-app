import { z } from 'zod';

const envSchema = z.object({
	API_PORT: z.string().min(1).default('4011'),
	DB_URL: z.string().url(),
	AUTH_SERVICE_URL: z.string().url().default('http://localhost:4010'),
	NODE_ENV: z.string().optional(),
	OPENAI_API_KEY: z.string().default('sk-proj-1234567890'),
});

export const env = envSchema.parse(process.env);
