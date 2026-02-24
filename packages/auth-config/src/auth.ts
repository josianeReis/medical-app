import { User as BetterAuthUser } from 'better-auth';
import { createAuthClient as createAuthServerClient } from 'better-auth/client';
import {
	emailOTPClient,
	inferAdditionalFields,
	organizationClient,
	usernameClient,
} from 'better-auth/client/plugins';
import { nextCookies } from 'better-auth/next-js';
import { createAccessControl } from 'better-auth/plugins/access';
import {
	adminAc,
	defaultStatements,
	memberAc,
	ownerAc,
} from 'better-auth/plugins/organization/access';
import { createAuthClient } from 'better-auth/react';
import { getUserSessionDetailsClient } from './plugins/user-session-details-client';

const statement = {
	...defaultStatements,
	patient: ['read', 'create', 'update', 'delete'],
	template: ['read', 'create', 'update', 'delete'],
	category: ['read', 'create', 'update', 'delete'],
	procedure: ['read', 'create', 'update', 'delete'],
	queue: ['read', 'create', 'update', 'delete'],
	appointment: ['read', 'create', 'update', 'delete'],
	printMask: ['read', 'create', 'update', 'delete'],
	notification: ['read', 'create', 'update', 'delete'],
	report: ['read', 'create', 'update', 'delete'],
} as const;

const ac = createAccessControl(statement);

const patient = ac.newRole({
	patient: ['read'],
	queue: ['read'],
	appointment: ['read'],
	printMask: ['read'],
	notification: ['read'],
	report: ['read'],
});

const secretary = ac.newRole({
	...memberAc.statements,
	patient: ['read', 'create', 'update', 'delete'],
	template: ['read'],
	procedure: ['read'],
	queue: ['read', 'create', 'update', 'delete'],
	appointment: ['read', 'create', 'update', 'delete'],
	printMask: ['read', 'create', 'update', 'delete'],
	notification: ['read', 'create', 'update', 'delete'],
	report: ['read'],
});

const doctor = ac.newRole({
	...adminAc.statements,
	patient: ['read', 'create', 'update', 'delete'],
	template: ['read', 'create', 'update', 'delete'],
	procedure: ['read', 'create', 'update', 'delete'],
	queue: ['read', 'create', 'update', 'delete'],
	appointment: ['read', 'create', 'update', 'delete'],
	printMask: ['read', 'create', 'update', 'delete'],
	notification: ['read', 'create', 'update', 'delete'],
	report: ['read', 'create', 'update', 'delete'],
});

const owner = ac.newRole({
	...ownerAc.statements,
	patient: ['read', 'create', 'update', 'delete'],
	template: ['read', 'create', 'update', 'delete'],
	procedure: ['read', 'create', 'update', 'delete'],
	queue: ['read', 'create', 'update', 'delete'],
	appointment: ['read', 'create', 'update', 'delete'],
	printMask: ['read', 'create', 'update', 'delete'],
	notification: ['read', 'create', 'update', 'delete'],
	report: ['read', 'create', 'update', 'delete'],
});

const options = {
	plugins: [
		inferAdditionalFields({
			user: {
				firstName: { type: 'string', required: true },
				lastName: { type: 'string', required: true },
				language: { type: 'string', required: false },
				terms: {
					type: 'boolean',
					required: true,
				},
			},
		}),
		emailOTPClient(),
		nextCookies(),
		organizationClient({
			ac,
			roles: {
				owner,
				doctor,
				secretary,
				patient,
			},
		}),
		usernameClient(),
		getUserSessionDetailsClient(),
	],
};

const getAuthClient = (baseURL: string) =>
	createAuthClient({ ...options, baseURL });
const getAuthServerClient = (baseURL: string) =>
	createAuthServerClient({ ...options, baseURL });

export {
	ac,
	statement as AuthPermissions,
	doctor,
	getAuthClient,
	getAuthServerClient,
	owner,
	patient,
	secretary,
};

export type User = BetterAuthUser & {
	firstName: string;
	lastName: string;
	language: 'pt' | 'en' | 'es';
	lastUsedOrganizationId: string;
	term: boolean;
	username: string;
};

export type MemberRole = 'owner' | 'doctor' | 'secretary' | 'patient';
