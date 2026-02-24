import { Elysia } from 'elysia';

// Helper function to wrap successful responses
// Automatically detects if response is already in correct format
export const wrapResponse = <T>(data: T, error: unknown = null) => {
	// Check if data is already in the expected response format
	if (data && typeof data === 'object' && 'data' in data && 'error' in data) {
		return data;
	}

	// Otherwise, wrap in the standard format
	return {
		data,
		error,
	};
};

// Helper function to wrap error responses
export const wrapError = (error: string | Error, data: unknown = null) => ({
	data,
	error: typeof error === 'string' ? error : error.message,
});

// Simplified plugin that only sets JSON content type
// Routes should manually use wrapResponse() to avoid Bun socket issues
export const responseEnvelopePlugin = (app: Elysia) =>
	app.onAfterHandle(({ set }) => {
		// Ensure JSON content type for all responses
		if (!set.headers['Content-Type']) {
			set.headers['Content-Type'] = 'application/json; charset=utf-8';
		}
	});
