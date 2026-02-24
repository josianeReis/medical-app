/**
 * Represents a standardized response structure that can either contain data or an error.
 * This type ensures that a response will have either data or an error, but not both.
 *
 * @template Data - The type of data that can be returned in a successful response
 * @template Error - The type of error that can be returned in an error response (defaults to unknown)
 */
export type DefaultResponse<Data, Error = unknown> =
	| { data: Data; error: null }
	| { data: null; error: Error };

/**
 * Creates a successful response with data and no error.
 *
 * @template Data - The type of data being returned
 * @param data - The data to include in the response
 * @returns A DefaultResponse with the provided data and null error
 */
export function defaultResponse<Data>(data: Data): DefaultResponse<Data, never>;

/**
 * Creates an error response with no data and an error.
 *
 * @template Data - The type of data that would be returned in a successful response
 * @template Err - The type of error being returned
 * @param data - Must be null for error responses
 * @param error - The error to include in the response
 * @returns A DefaultResponse with null data and the provided error
 */
export function defaultResponse<Data, Err>(
	data: null,
	error: Err,
): DefaultResponse<Data, Err>;

/**
 * Implementation of the defaultResponse function that handles both success and error cases.
 * The function overloads guarantee that at runtime either data or error is null.
 *
 * @template Data - The type of data that can be returned
 * @template Err - The type of error that can be returned (defaults to unknown)
 * @param data - The data to include in the response, or null for error responses
 * @param error - The error to include in the response, or null for successful responses (defaults to null)
 * @returns A DefaultResponse containing either data or error, but not both
 */
export function defaultResponse<Data, Err = unknown>(
	data: Data | null,
	error: Err | null = null,
): DefaultResponse<Data, Err> {
	// The overloads guarantee that at runtime either data or error is null.
	return { data, error } as DefaultResponse<Data, Err>;
}
