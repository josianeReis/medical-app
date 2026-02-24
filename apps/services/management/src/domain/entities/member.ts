import { member, organization } from '@packages/data-access';
import { InferSelectModel } from 'drizzle-orm';

export type Organization = InferSelectModel<typeof organization>;

export type Member = InferSelectModel<typeof member>;
export type MemberWithDetails = Member & {
	organization: Organization;
};

export type CreateMemberData = Omit<
	Member,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'isDeleted'
	| 'deletedAt'
	| 'deletedById'
	| 'updatedById'
>;
