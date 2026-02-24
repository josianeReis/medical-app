import { HttpError } from './http-error';

export class UnauthorizedError extends HttpError {
	constructor(message: string = 'errors.unauthorized') {
		super(401, message, 'UNAUTHORIZED');
	}
}
