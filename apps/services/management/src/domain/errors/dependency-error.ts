import { HttpError } from './http-error';

export type DependentEntity = {
	type: string;
	name: string;
	id: string;
};

export class DependencyError extends HttpError {
	public readonly dependents: DependentEntity[];

	constructor(message: string, dependents: DependentEntity[]) {
		super(400, message);
		this.dependents = dependents;
		this.name = 'DependencyError';
	}

	public getDependentsInfo(): string {
		return this.dependents
			.map((dep) => `${dep.type}: ${dep.name} (${dep.id})`)
			.join(', ');
	}
}
