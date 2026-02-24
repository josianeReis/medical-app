/* eslint-disable */
import { Elysia } from 'elysia';

/**
 * Some clients accidentally send a `Cookie:` header with no value. A few
 * reverse-proxies and some parts of the Node/Bun HTTP stacks treat that as a
 * malformed header and close the connection, which surfaces as
 * UND_ERR_SOCKET / ECONNRESET on the caller side.
 *
 * This plugin removes the header completely when it contains only
 * whitespace so downstream plugins and route handlers will see the request
 * exactly as if no Cookie header had been sent at all.
 */
export const stripEmptyCookiePlugin = (app: Elysia) =>
	app.onBeforeHandle(({ request }) => {
		const cookie = request.headers.get('cookie');
		console.log("🚀 ~ app.onBeforeHandle ~ cookie:", cookie)

		if (cookie !== null && cookie.trim() === '') {
			const newHeaders = new globalThis.Headers(request.headers);
			newHeaders.delete('cookie');

			// Return a new Request so Elysia will use it for the rest of the
			// pipeline. This keeps the context type-safe and avoids mutating
			// internal state directly.
			return {
				request: new globalThis.Request(request.url, {
					method: request.method,
					headers: newHeaders,
					body: request.body,
				}),
			} as const;
		}
		// Explicitly return undefined so all code paths return a value and satisfy
		// TypeScript's strict checking.
		return undefined;
	});
