import { member, schema, user } from '@packages/data-access';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import {
	admin,
	emailOTP,
	openAPI,
	organization,
	username,
} from 'better-auth/plugins';
import { and, eq } from 'drizzle-orm';
import { dbClient } from './config/db';
import { env } from './config/env';
import { ac, doctor, owner, patient, secretary } from '@packages/auth-config';
import { sendEmailVerification } from './services/email/sendEmailVerification';
import { sendOrganizationInvitation } from './services/email/sendOrganizationInvitationEmail';
import { sendRecoveryPasswordEmail } from './services/email/sendRecoveryPasswordEmail';
import { sendSignInEmail } from './services/email/sendSignInEmail';
import { getUserSessionDetailsPlugin } from './plugins/user-session-details';

export const auth = betterAuth({
	trustedOrigins: [
		'http://localhost:3000',
		'http://localhost:3000/email-verification/success',
		...(env.TRUSTED_CALLBACK_URLS ? env.TRUSTED_CALLBACK_URLS.split(',') : []),
	],
	advanced: {
		useSecureCookies: false,
		// env.NODE_ENV === 'production' || env.NODE_ENV === 'staging',
		crossSubDomainCookies: {
			enabled: env.ENABLE_CROSS_SUB_DOMAIN_COOKIES,
			domain: (() => {
				try {
					const url = new URL(env.NEXT_PUBLIC_APP_URL);
					return url.hostname;
				} catch {
					return env.NEXT_PUBLIC_APP_URL.replace(/^[a-zA-Z]+:\/\//, '').replace(
						/:\d+$/,
						'',
					);
				}
			})(),
		},
	},
	user: {
		fields: { name: 'firstName' },
		additionalFields: {
			firstName: { type: 'string', required: true },
			lastName: { type: 'string', required: true },
			language: { type: 'string', required: false },
			terms: {
				type: 'boolean',
				required: true,
			},
			lastUsedOrganizationId: {
				type: 'string',
				required: false,
				defaultValue: null,
			},
		},
	},
	database: drizzleAdapter(dbClient, {
		provider: 'pg',
		schema,
	}),
	emailAndPassword: {
		enabled: true,
		// TODO: Re-enable in production after outbound email provider is configured.
		requireEmailVerification: false,
	},
	emailVerification: {
		// TODO: Re-enable in production after outbound email provider is configured.
		sendOnSignUp: false,
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		...(env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET
			? {
					apple: {
						clientId: env.APPLE_CLIENT_ID,
						clientSecret: env.APPLE_CLIENT_SECRET,
					},
				}
			: {}),
	},
	plugins: [
		openAPI({ disableDefaultReference: true }),
		organization({
			ac,
			roles: {
				owner,
				doctor,
				secretary,
				patient,
			},
			teams: {
				enabled: true,
			},
			allowUserToCreateOrganization: async (user) => {
				try {
					const memberRole = await dbClient
						.select()
						.from(member)
						.where(and(eq(member.userId, user.id), eq(member.role, 'owner')))
						.limit(1);

					if (memberRole.length === 0) return true;

					return false;
				} catch (error) {
					// eslint-disable-next-line no-console
					console.error('Erro ao verificar organizações do usuário:', error);
					return false;
				}
			},
			async sendInvitationEmail(data) {
				const userInformation = await dbClient
					.select()
					.from(user)
					.where(eq(user.email, data.email))
					.limit(1);

				let inviteLink = `${env.NEXT_PUBLIC_APP_URL}/accept-invitation/${data.id}`;

				if (userInformation.length === 0) {
					inviteLink += `?email=${encodeURIComponent(data.email)}&newUser=true`;
				}

				sendOrganizationInvitation({
					email: data.email,
					invitedByUsername: data.inviter.user.name,
					invitedByEmail: data.inviter.user.email,
					teamName: data.organization.name,
					inviteLink,
				});
			},
		}),
		username({
			usernameValidator: (username) => {
				if (username === 'admin') {
					return false;
				}
				return true;
			},
		}),
		emailOTP({
			expiresIn: 600,
			async sendVerificationOTP({ email, otp, type }) {
				if (type === 'sign-in') {
					await sendSignInEmail(email, otp);
				} else if (type === 'email-verification') {
					await sendEmailVerification(email, otp);
				} else if (type === 'forget-password') {
					await sendRecoveryPasswordEmail(email, otp);
				}
			},
		}),
		admin(),
		getUserSessionDetailsPlugin(),
	],
});
