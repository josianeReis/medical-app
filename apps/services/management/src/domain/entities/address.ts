import { address } from '@packages/data-access';
import { InferSelectModel } from 'drizzle-orm';

export type Address = InferSelectModel<typeof address>;
export type CreateAddressData = Omit<
	Address,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'isDeleted'
	| 'deletedAt'
	| 'deletedById'
	| 'updatedById'
>;
