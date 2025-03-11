import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';
import { env } from './src/env';

export default defineConfig({
    dbCredentials: {
        url: env.DB_URL,
    },
    dialect: 'postgresql',
    out: `./src/migrations`,
    schema: `./src/schema/index.ts`,
    strict: true,
    verbose: true,
});
