import { getAuthClient, User as UserAuthClient } from '@packages/auth-config';
import { env } from '../../utils/env';

export const authClient = getAuthClient(env.AUTH_SERVICE_URL);

export type User = UserAuthClient;
