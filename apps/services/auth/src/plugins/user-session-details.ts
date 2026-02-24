import type { BetterAuthPlugin } from 'better-auth';
import { createAuthEndpoint } from 'better-auth/api';
import { auth } from '../auth';
import { dbClient } from '../config/db';
import { eq } from 'drizzle-orm';
import { user } from '@packages/data-access';

export const getUserSessionDetailsPlugin = (): BetterAuthPlugin => {
	return {
		id: 'user-session-details-plugin',
		endpoints: {
			getUserSessionDetails: createAuthEndpoint(
				'/session',
				{ method: 'GET' },
				async (ctx) => {
					const data = await auth.api.getSession({
						headers: ctx.headers ?? new Headers(),
					});

					if (!data)
						return ctx.json({
							error: {
								code: 'FAILED_USER_DATA',
								message: 'Failed to get user data',
							},
						});

					const result = await dbClient.query.user.findFirst({
						where: eq(user.id, data?.session.userId),
						columns: {
							id: true,
							email: true,
							firstName: true,
							lastName: true,
							language: true,
							name: true,
							lastUsedOrganizationId: true,
						},
						with: {
							members: {
								columns: {
									id: true,
									role: true,
									teamId: true,
								},
								with: {
									organization: {
										columns: {
											id: true,
											name: true,
											slug: true,
											logo: true,
										},
									},
								},
							},
						},
					});

					if (!result) return null;

					return ctx.json({
						id: result.id,
						email: result.email,
						firstName: result.firstName,
						name: result.name,
						lastName: result.lastName,
						language: result.language,
						lastUsedOrganizationId: result.lastUsedOrganizationId,
						session: data.session,
						members: result.members.map((member) => ({
							id: member.id,
							role: member.role,
							teamId: member.teamId,
							organization: {
								id: member.organization.id,
								name: member.organization.name,
								slug: member.organization.slug,
								logo: member.organization.logo,
							},
						})),
					});
				},
			),
		},
	} satisfies BetterAuthPlugin;
};
