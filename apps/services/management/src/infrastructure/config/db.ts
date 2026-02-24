import { getDbClient } from '@packages/data-access';
import { env } from './env';

export const db = getDbClient(env.DB_URL);
