import { Context, Elysia } from 'elysia';

import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import openApi from '../openapi.json';
import { auth } from './auth';
import { env } from './config/env';

const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ['POST', 'GET'];

  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    context.status(405);
  }
};

const app = new Elysia()
  .use(cors())
  .get('/health', ({ status }) => status(200))
  .use(
    swagger({
      documentation: JSON.parse(JSON.stringify(openApi)),
      path: '/api/auth/reference',
    })
  )
  .all('/api/auth/*', betterAuthView)
  .onError(({ error }) => {
    // eslint-disable-next-line no-console
    console.error(error);
  })
  .listen(env.API_PORT);

// eslint-disable-next-line no-console
console.log(`🦊 Auth service is running at ${app.server?.hostname}:${app.server?.port}`);
