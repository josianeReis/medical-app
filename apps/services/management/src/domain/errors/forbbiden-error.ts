import { HttpError } from './http-error';

export class ForbiddenError extends HttpError {
	constructor(message: string = 'errors.forbidden') {
		super(403, message, 'FORBIDDEN');
	}
}
