import { getAuthServerClient } from '@packages/auth-config';
import { env } from './env';

export const authClient = getAuthServerClient(env.AUTH_SERVICE_URL);
