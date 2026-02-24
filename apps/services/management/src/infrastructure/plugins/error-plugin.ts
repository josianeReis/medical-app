/* eslint-disable security/detect-object-injection */
import { type TSchema } from '@sinclair/typebox';
import { Value, type ValueError } from '@sinclair/typebox/value';
import { type Elysia, ValidationError as ElysiaValidationError } from 'elysia';
import i18next from 'i18next';

import { BadRequestError } from '@/domain/errors/bad-request-error';
import { DependencyError } from '@/domain/errors/dependency-error';
import { HttpError } from '@/domain/errors/http-error';
import { NotFoundError } from '@/domain/errors/not-found-error';
import { ValidationError } from '@/domain/errors/validation-error';

export const errorPlugin = (app: Elysia) =>
	app
		.error({
			NOT_FOUND: NotFoundError,
			BAD_REQUEST: BadRequestError,
			VALIDATION: ElysiaValidationError,
			VALIDATION_ERROR: ValidationError,
			DEPENDENCY: DependencyError,
		})
		.onError((ctx) => {
			const { code, set } = ctx;
			let err: unknown = ctx.error;
			const ctxWithMaybeT = ctx as unknown as Partial<{ t: typeof i18next.t }>;
			const translate: typeof i18next.t =
				typeof ctxWithMaybeT.t === 'function' ? ctxWithMaybeT.t : i18next.t;

			if (code === 'VALIDATION') {
				const { validator, value } = err as ElysiaValidationError;

				// Check if validator.schema exists (normal Elysia validation)
				const validatorWithSchema = validator as { schema?: TSchema };
				if (!validator || !validatorWithSchema.schema) {
					// This is likely our ValidationError wrapped by Elysia
					// Try to extract the original ValidationError from the error chain
					let originalValidationError = null;
					let typeBoxPath = '';

					// Check if the error itself is a ValidationError
					if (err instanceof ValidationError) {
						originalValidationError = err;
					}
					// Check if there's a ValidationError in the cause chain
					else {
						let currentError: unknown = err;
						while (currentError && !originalValidationError) {
							if (currentError instanceof ValidationError) {
								originalValidationError = currentError;
								break;
							}

							// Check if this is a TypeBox TransformDecodeError with path info
							if (
								currentError &&
								typeof currentError === 'object' &&
								'path' in currentError
							) {
								typeBoxPath = (currentError as { path: string }).path;
							}

							currentError =
								(currentError as { cause?: unknown; error?: unknown }).cause ||
								(currentError as { cause?: unknown; error?: unknown }).error;
						}
					}

					if (originalValidationError) {
						// Extract field errors and combine with TypeBox path
						const fieldErrors = originalValidationError.fieldErrors;
						const reconstructedErrors: Record<string, string[]> = {};

						if (fieldErrors && typeBoxPath) {
							// Clean up the path (remove leading slash)
							const cleanPath = typeBoxPath.startsWith('/')
								? typeBoxPath.slice(1)
								: typeBoxPath;

							// Combine TypeBox path with our field names
							Object.entries(fieldErrors).forEach(([field, errors]) => {
								const fullPath = cleanPath ? `${cleanPath}/${field}` : field;
								reconstructedErrors[fullPath] = errors;
							});
						} else if (fieldErrors) {
							// If no path info, use original field errors
							Object.assign(reconstructedErrors, fieldErrors);
						} else {
							// Fallback
							reconstructedErrors._ = ['Validation failed'];
						}

						err = new ValidationError(reconstructedErrors);
					} else {
						// If we can't find the ValidationError, create a generic one
						err = new ValidationError({ _: ['Validation failed'] });
					}
				} else {
					// Normal Elysia validation - process the schema
					const schema: TSchema = validatorWithSchema.schema;
					let validationErrors: Record<string, string[]> = {};

					if ('anyOf' in schema && Array.isArray(schema.anyOf)) {
						type SchemaErrors = { schema: TSchema; errors: ValueError[] };
						const errorsBySchema: SchemaErrors[] = schema.anyOf.map(
							(subSchema: TSchema) => ({
								schema: subSchema,
								errors: [...Value.Errors(subSchema, value)],
							}),
						);

						const bestMatch = errorsBySchema.reduce(
							(best: SchemaErrors, current: SchemaErrors) =>
								current.errors.length < best.errors.length ? current : best,
						);

						validationErrors = bestMatch.errors.reduce(
							(acc: Record<string, string[]>, validationError: ValueError) => {
								const path = validationError.path.substring(1) || '_';
								if (!acc[path]) {
									acc[path] = [];
								}
								const customError = (
									validationError.schema as TSchema & { error?: string }
								).error;
								acc[path].push(customError || validationError.message);
								return acc;
							},
							{},
						);

						if (
							Object.keys(validationErrors).length === 0 &&
							'error' in schema &&
							schema.error
						) {
							validationErrors = {
								_: [
									typeof schema.error === 'function'
										? // eslint-disable-next-line @typescript-eslint/no-explicit-any
											schema.error(value as any)
										: String(schema.error),
								],
							};
						}
					} else {
						const allErrors = Value.Errors(schema, value);
						validationErrors = [...allErrors].reduce(
							(acc: Record<string, string[]>, validationError: ValueError) => {
								const path = validationError.path.substring(1) || '_';
								if (!acc[path]) {
									acc[path] = [];
								}
								const customError = (
									validationError.schema as TSchema & { error?: string }
								).error;
								acc[path].push(customError || validationError.message);
								return acc;
							},
							{},
						);
					}

					err = new ValidationError(validationErrors);
				}
			}

			if (err instanceof HttpError) {
				set.status = err.status;
				const translatedMsg = (() => {
					const res = translate(err.message);
					return res === err.message
						? translate(err.message, {
								ns: 'translation',
								defaultValue: err.message,
							})
						: res;
				})();

				const body = {
					code: err.code,
					message: translatedMsg,
					...(err instanceof ValidationError
						? {
								fields: Object.entries(err.fieldErrors).reduce(
									(acc, [key, messages]) => {
										acc[key] = messages.map((msg) => translate(msg));
										return acc;
									},
									{} as Record<string, string[]>,
								),
							}
						: {}),
					...(err instanceof DependencyError
						? {
								dependents: err.dependents,
								dependentsInfo: err.getDependentsInfo(),
							}
						: {}),
				};

				return new Response(JSON.stringify({ data: null, error: body }), {
					status: set.status,
					headers: { 'Content-Type': 'application/json; charset=utf-8' },
				});
			}

			const maybeElysiaError = err as {
				status?: number;
				code?: string;
				message?: string;
			};

			if (
				maybeElysiaError.status &&
				maybeElysiaError.code &&
				maybeElysiaError.message
			) {
				set.status = maybeElysiaError.status;
				const body = {
					code: maybeElysiaError.code,
					message: translate(maybeElysiaError.message),
				};
				return new Response(JSON.stringify({ data: null, error: body }), {
					status: set.status,
					headers: { 'Content-Type': 'application/json; charset=utf-8' },
				});
			}

			// eslint-disable-next-line no-console
			console.error(err);
			set.status = 500;
			const body = {
				code: 'INTERNAL_SERVER_ERROR',
				message: translate('errors.internal_server_error'),
			};
			return new Response(JSON.stringify({ data: null, error: body }), {
				status: set.status,
				headers: { 'Content-Type': 'application/json; charset=utf-8' },
			});
		});
