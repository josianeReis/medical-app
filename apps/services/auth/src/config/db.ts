import { env } from './env';
import { getDbClient } from '@packages/data-access';

export const dbClient = getDbClient(env.DB_URL);
