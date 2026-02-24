import type { BetterAuthClientPlugin } from 'better-auth/client';
import { BetterFetchOption } from '@better-fetch/fetch';
import { Session } from 'better-auth';
import { Organization } from 'better-auth/plugins/organization';
import { User } from '../auth';

export type UserWithDetails = User & {
	session: Session;
	members: {
		role: string;
		teamId: string;
		organization: Organization;
	}[];
};

export const getUserSessionDetailsClient = () =>
	({
		id: 'user-session-details-plugin',
		$InferServerPlugin: {} as any,
		getActions: ($fetch) => ({
			getUserSessionDetails: async (
				fetchOptions: BetterFetchOption,
			): Promise<{
				data: UserWithDetails | null;
				error: { status: number; statusText: string };
			}> => {
				return $fetch(`/session`, {
					method: 'GET',
					...fetchOptions,
				});
			},
		}),
	}) satisfies BetterAuthClientPlugin;
