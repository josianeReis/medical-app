import { UnitOfWork } from '@/application/ports/out/unit-of-work';
import { db } from '../config/db';
import { DrizzleUnitOfWork } from './drizzle-unit-of-work';

export async function withUnitOfWork<T>(
	work: (uow: UnitOfWork) => Promise<T>,
): Promise<T> {
	return db.transaction(async (tx) => {
		const uow = new DrizzleUnitOfWork(tx);
		return work(uow);
	});
}
