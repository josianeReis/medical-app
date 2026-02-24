import { MemberRepository } from '@/application/ports/out/patient/member-repository';
import { MemberWithDetails } from '@/domain/entities/member';
import { User } from '@/domain/entities/user';
import { ForbiddenError } from '@/domain/errors/forbbiden-error';
import { UnauthorizedError } from '@/domain/errors/unauthorized-error';
import { authClient } from '@/infrastructure/config/auth';
import { DrizzleMemberRepository } from '@/infrastructure/database/drizzle-member-repository';
import { AuthPermissions, MemberRole } from '@packages/auth-config';
import { Session } from 'better-auth';
import { Elysia } from 'elysia';

export type AuthData = {
	user: User;
	session: Session;
	member: MemberWithDetails;
};

export function createAuthMacroPlugin(
	memberRepository: MemberRepository = new DrizzleMemberRepository(),
) {
	type AuthPermissionsType = typeof AuthPermissions;
	type PermissionsMap = Record<keyof AuthPermissionsType, string[]>;

	return new Elysia({ name: 'auth-macro' }).macro({
		auth(permissions: string | boolean) {
			return {
				async resolve({ headers, params }) {
					const sessionRes = await authClient.getSession({
						fetchOptions: {
							headers: Object.fromEntries(
								Object.entries(headers).filter(([k]) =>
									['cookie'].includes(k.toLowerCase()),
								),
							),
						},
					});
					const user = sessionRes.data?.user;

					if (!user?.id || !params.organizationId)
						throw new UnauthorizedError();

					const member = await memberRepository.findByUserAndOrganization(
						user.id,
						params.organizationId,
					);
					if (!member) throw new ForbiddenError();

					// For string permissions, check role permissions
					if (typeof permissions === 'string') {
						const parsed = permissions
							.split(',')
							.reduce<PermissionsMap>((acc, entry) => {
								const [k, v] = entry.split(':');
								if (!k || !v) return acc;
								const key = k.trim() as keyof AuthPermissionsType;
								const val = v.trim();
								if (acc[key as keyof AuthPermissionsType]) {
									(acc[key as keyof AuthPermissionsType] as string[]).push(val);
								} else {
									acc[key as keyof AuthPermissionsType] = [val];
								}
								return acc;
							}, {} as PermissionsMap);

						const ok = await authClient.organization.checkRolePermission({
							permissions: parsed as unknown as Record<
								string,
								readonly string[]
							>,
							role: member.role as MemberRole,
						});
						if (!ok) throw new ForbiddenError();
					}

					const session = sessionRes.data?.session;
					if (!session) throw new UnauthorizedError();

					const authData: AuthData = {
						user: user as User,
						session,
						member,
					};

					return {
						authData,
					};
				},
			};
		},
	});
}
