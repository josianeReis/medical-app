import { HttpError } from './http-error';

export class MalformedRequestError extends HttpError {
	constructor(
		message: string,
		public field?: string,
	) {
		super(400, message, 'MALFORMED_REQUEST');
	}
}
