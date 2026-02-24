import { Context, Elysia } from 'elysia';

import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import openApi from '../openapi.json';
import { auth } from './auth';
import { env } from './config/env';
import { UnauthorizedError } from './utils/errors/unauthorized-error';

const corsOrigins = Array.from(
	new Set(
		[
			'http://localhost:3000',
			env.NEXT_PUBLIC_APP_URL,
			...(env.TRUSTED_CALLBACK_URLS
				? env.TRUSTED_CALLBACK_URLS.split(',').map((origin) => origin.trim())
				: []),
		].filter(Boolean),
	),
);

const betterAuthView = (context: Context) => {
	const BETTER_AUTH_ACCEPT_METHODS = ['POST', 'GET'];

	if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
		return auth.handler(context.request);
	} else {
		context.status(405);
	}
};

const app = new Elysia()
	.use(
		cors({
			origin: corsOrigins,
			credentials: true,
		}),
	)
	.get('/health', ({ status }) => status(200))
	.use(
		swagger({
			documentation: JSON.parse(JSON.stringify(openApi)),
			path: '/api/auth/reference',
		}),
	)
	.all('/api/auth/*', betterAuthView)
	.macro({
		auth: {
			async resolve({ request: { headers } }) {
				const response = await auth.api.getSession({
					headers,
				});
				// eslint-disable-next-line no-console
				console.log('🚀 ~ resolve ~ response:', response);
				if (!response?.user || !response?.session)
					throw new UnauthorizedError();

				return {
					user: response.user,
					session: response.session,
				};
			},
		},
	})
	.onError(({ error }) => {
		// eslint-disable-next-line no-console
		console.error(error);
	})
	.listen(env.API_PORT);

// eslint-disable-next-line no-console
console.log(
	`🦊 Auth service is running at ${app.server?.hostname}:${app.server?.port}`,
);
