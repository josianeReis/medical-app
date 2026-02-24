'use server';

import { env } from '@/utils/env';
import { getCookieHeader, getErrorMessage } from '../api-client/api-client';
import { getCurrentUser } from '../auth';

export type GetPrintMasksResponse = APIReturn<PaginatedReturn<PrintMask[]>>;

export async function getPrintMasks(
	slug: string,
): Promise<GetPrintMasksResponse> {
	'use server';

	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);

	const response = await fetch(
		`${env.MANAGAMENT_API_URL}/api/organizations/${currentOrganization?.organization.id}/print-masks`,
		{
			method: 'GET',
			headers: {
				...(await getCookieHeader()),
			},
		},
	);

	const data = (await response.json()) as GetPrintMasksResponse;

	if (data.error?.code || !data.data) {
		console.log('Failed to get print masks');
		console.error('🚀 getPrintMasks ~ data:', data);
	}

	return data;
}

interface CreatePrintMaskData {
	name: string;
	headerHtml?: string;
	footerHtml?: string;
	active: boolean;
}

export async function createPrintMask(
	slug: string,
	maskData: CreatePrintMaskData,
): Promise<{
	error?: string;
	success: boolean;
	message?: string;
}> {
	'use server';

	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);

	const response = await fetch(
		`${env.MANAGAMENT_API_URL}/api/organizations/${currentOrganization?.organization.id}/print-masks`,
		{
			method: 'POST',
			body: JSON.stringify({ ...maskData }),
			headers: {
				...(await getCookieHeader()),
				'Content-Type': 'application/json',
			},
		},
	);

	const { error, message } = await response.json();

	if (error) {
		return { error: await getErrorMessage(error), success: false };
	}

	return { success: true, message };
}

export async function deletePrintMask(
	organizationId: string,
	id: string,
): Promise<{
	error?: string;
	success: boolean;
	message?: string;
}> {
	'use server';

	const response = await fetch(
		`${env.MANAGAMENT_API_URL}/api/organizations/${organizationId}/print-masks/${id}`,
		{
			method: 'DELETE',
			headers: {
				...(await getCookieHeader()),
			},
		},
	);

	const { error, message } = await response.json();

	if (error) {
		return { error: await getErrorMessage(error), success: false };
	}

	return { success: true, message };
}

export async function updatePrintMask(
	slug: string,
	id: string,
	maskData: Partial<CreatePrintMaskData>,
): Promise<{
	error?: string;
	success: boolean;
	message?: string;
}> {
	'use server';

	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);

	const response = await fetch(
		`${env.MANAGAMENT_API_URL}/api/organizations/${currentOrganization?.organization.id}/print-masks/${id}`,
		{
			method: 'PATCH',
			body: JSON.stringify({ ...maskData }),
			headers: {
				...(await getCookieHeader()),
				'Content-Type': 'application/json',
			},
		},
	);

	const { error, message } = await response.json();

	if (error) {
		return { error: await getErrorMessage(error), success: false };
	}

	return { success: true, message };
}

export async function getPrintMask(slug: string, id: string) {
	'use server';

	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);

	const response = await fetch(
		`${env.MANAGAMENT_API_URL}/api/organizations/${currentOrganization?.organization.id}/print-masks/${id}`,
		{
			method: 'GET',
			headers: {
				...(await getCookieHeader()),
			},
		},
	);

	const { data, error } = await response.json();

	if (error) {
		return { error: getErrorMessage(error), success: false };
	}
	return data;
}