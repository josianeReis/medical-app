import { generateEnv } from '@packages/utils';
import { z } from 'zod';

const envSchema = z.object({
	DB_URL: z.string().min(1),
});

export const env = generateEnv(envSchema);
