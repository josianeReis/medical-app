export class HttpError extends Error {
	constructor(
		public status: number,
		public override message: string,
		public code?: string,
	) {
		super(message);
	}
}
