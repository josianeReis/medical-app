import { user } from '@packages/data-access';
import { InferSelectModel } from 'drizzle-orm';
import { MemberWithDetails } from './member';

export type User = InferSelectModel<typeof user>;
export type UserWithDetails = User & {
	members?: MemberWithDetails[];
};
