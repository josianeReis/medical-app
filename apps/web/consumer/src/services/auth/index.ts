'use server';

import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
	getCookieHeader,
	getErrorMessage,
	handleSetCookies,
} from '../api-client/api-client';
import { authClient } from './auth-client';
import { acceptInvitation } from '../organization';
import { env } from '@/utils/env';

interface SigninData {
	email: string;
	password: string;
	code?: string; // Optional for accepting invitations
}

export async function login(signinData: SigninData): Promise<{
	error?: string;
	success: boolean;
}> {
	'use server';

	const { email, password } = signinData;

	if (!email || !password) {
		return { error: 'Email and password are required', success: false };
	}

	const { error, data } = await authClient.signIn.email(
		{
			email,
			password,
			callbackURL: `${env.NEXT_PUBLIC_APP_URL}/organizations`,
		},
		{
			onSuccess: async (data) => {
				const setCookie = data.response.headers.getSetCookie();
				await handleSetCookies(setCookie);
			},
			fetchOptions: {
				headers: {
					...(await getCookieHeader()),
				},
			},
		},
	);

	if (signinData?.code) {
		await acceptInvitation(signinData?.code);
	}

	revalidatePath('/', 'layout');

	if (error?.code || !data) {
		if (error?.code === 'EMAIL_NOT_VERIFIED') {
			await sendVerificationOtp(email, 'email-verification');
			redirect(`/email-verification?email=${email}`);
		}
		return { error: await getErrorMessage(error), success: false };
	}

	return { success: true };
}

export async function loginUsername(signinData: {
	username: string;
	password: string;
}): Promise<{
	error?: string;
	success: boolean;
}> {
	'use server';

	const { username, password } = signinData;

	if (!username || !password) {
		return { error: 'Email and password are required', success: false };
	}

	const { error, data } = await authClient.signIn.username(
		{
			username,
			password,
			callbackURL: `${env.NEXT_PUBLIC_APP_URL}/organizations`,
		},
		{
			onSuccess: async (data) => {
				const setCookie = data.response.headers.getSetCookie();
				await handleSetCookies(setCookie);
			},
			fetchOptions: {
				headers: {
					...(await getCookieHeader()),
				},
			},
		},
	);

	if (error?.code || !data) {
		return { error: await getErrorMessage(error), success: false };
	}

	return { success: true };
}

interface SignupByEmailData {
	email: string;
	code: string;
}

export async function signupCode(signupData: SignupByEmailData): Promise<{
	error?: string;
	success: boolean;
	isEmailVerified: boolean;
}> {
	'use server';
	const t = await getTranslations('api');

	const { data, error } = await authClient.signIn.emailOtp(
		{
			email: signupData.email,
			otp: signupData.code,
		},
		{
			onSuccess: async (data) => {
				const setCookie = data.response.headers.getSetCookie();
				await handleSetCookies(setCookie);
			},
			fetchOptions: {
				headers: {
					...(await getCookieHeader()),
				},
			},
		},
	);

	revalidatePath('/', 'layout');

	if (error?.code || !data) {
		return {
			error: await getErrorMessage(error),
			success: false,
			isEmailVerified: false,
		};
	}

	if (!data.user.emailVerified) {
		return {
			error: t('EMAIL_NOT_VERIFIED'),
			success: false,
			isEmailVerified: false,
		};
	} else {
		return { success: true, isEmailVerified: true };
	}
}
interface SignupData {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	terms: boolean;
}

export async function signup(signupData: SignupData): Promise<{
	error?: string;
	success: boolean;
}> {
	'use server';

	const { firstName, lastName, password, terms } = signupData;

	const { error, data } = await authClient.signUp.email(
		{
			email,
			firstName,
			lastName,
			password,
			name: `${firstName} ${lastName}`,
			terms,
		},
		{
			onSuccess: async (data) => {
				const setCookie = data.response.headers.getSetCookie();
				await handleSetCookies(setCookie);
			},
			fetchOptions: {
				headers: {
					...(await getCookieHeader()),
				},
			},
		},
	);

	revalidatePath('/', 'layout');

	if (error?.code || !data) {
		return {
			error: await getErrorMessage(error),
			success: false,
		};
	}

	return { success: true };
}

export async function logout() {
	'use server';
	const cookieStore = await cookies();
	const { error } = await authClient.signOut({
		fetchOptions: {
			headers: {
				...(await getCookieHeader()),
			},
			onResponse: async (data) => {
				const setCookie = data.response.headers.getSetCookie();
				await handleSetCookies(setCookie);
			},
		},
	});

	if (error) {
		console.error('Error signing out from server');
		console.error('Logout error:', error);

		cookieStore
			.getAll()
			.map((cookie) =>
				cookieStore.set({ name: cookie.name, value: '', maxAge: 0 }),
			);
	}
}

export async function sendVerificationOtp(
	email: string,
	type: 'sign-in' | 'forget-password' | 'email-verification',
): Promise<{
	error?: string;
	success: boolean;
}> {
	'use server';

	const { error } = await authClient.emailOtp.sendVerificationOtp({
		email,
		type,
	});
	if (error) {
		return { error: await getErrorMessage(error), success: false };
	}
	return { success: true };
}

export async function verifyEmail(data: {
	email: string;
	code: string;
}): Promise<{
	error?: string;
	success: boolean;
}> {
	'use server';

	const { error } = await authClient.emailOtp.verifyEmail({
		email: data.email,
		otp: data.code,
	});
	if (error) {
		return { error: await getErrorMessage(error), success: false };
	}
	return { success: true };
}

export async function resetPassword(data: {
	email: string;
	code: string;
	password: string;
}): Promise<{
	error?: string;
	success: boolean;
}> {
	'use server';
	const { error } = await authClient.emailOtp.resetPassword({
		email: data.email,
		otp: data.code,
		password: data.password,
	});
	if (error) {
		return { error: await getErrorMessage(error), success: false };
	}
	return { success: true };
}

export async function getActiveMember() {
	'use server';
	const { data, error } = await authClient.organization.getActiveMember({
		fetchOptions: {
			headers: {
				...(await getCookieHeader()),
			},
		},
	});

	if (error?.code || !data?.user.email) {
		console.log('Failed to get user data');
		return;
	}
	return data as ActiveMember;
}

export async function getCurrentUser() {
	'use server';

	const { data, error } = await authClient.getUserSessionDetails({
		headers: {
			...(await getCookieHeader()),
		},
	});

	if (error || !data?.email) {
		console.log('Failed get user data');
		return null;
	}

	return data;
}

export async function isAuthenticated() {
	const data = await getCurrentUser();
	return !!data?.email;
}
