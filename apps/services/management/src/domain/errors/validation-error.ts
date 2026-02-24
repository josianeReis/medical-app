import { HttpError } from './http-error';

export class ValidationError extends HttpError {
	constructor(public fieldErrors: Record<string, string[]>) {
		super(400, 'errors.validation_failed', 'VALIDATION_ERROR');
	}
}
