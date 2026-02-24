'use server';
import { env } from '@/utils/env';
import { getCookieHeader, getErrorMessage } from '../api-client/api-client';
import { getCurrentUser } from '../auth';

export type GetTemplatesResponse = APIReturn<PaginatedReturn<Template[]>>;

export async function getTemplates(slug: string): Promise<GetTemplatesResponse> {
	'use server';
	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);

	const response = await fetch(
		`  ${env.MANAGAMENT_API_URL}/api/organizations/${currentOrganization?.organization.id}/templates`,
		{
			method: 'GET',
			headers: {
				...(await getCookieHeader()),
			},
		},
	);

	const data = (await response.json()) as GetTemplatesResponse;

	if (data.error?.code || !data.data) {
		console.log('Failed to get templates');
		console.error('🚀 getTemplates ~ data:', data);
	}

	return data;
}

interface CreateTemplateData {
	content: string;
	procedureId: string;
	active: boolean;
	name: string;
}

export async function createTemplates(
	slug: string,
	templateData: CreateTemplateData,
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
		` ${env.MANAGAMENT_API_URL}/api/organizations/${currentOrganization?.organization.id}/templates`,
		{
			method: 'POST',
			body: JSON.stringify({
				...templateData,
			}),
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

export async function deleteTemplate(
	organizationId: string,
	id: string,
): Promise<{
	error?: string;
	success: boolean;
	message?: string;
}> {
	'use server';

	const response = await fetch(
		`  ${env.MANAGAMENT_API_URL}/api/organizations/${organizationId}/templates/${id}`,
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

export async function updateTemplate(
	slug: string,
	id: string,
	templateData: Partial<CreateTemplateData>,
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
		`  ${env.MANAGAMENT_API_URL}/api/organizations/${currentOrganization?.organization.id}/templates/${id}`,
		{
			method: 'PATCH',
			body: JSON.stringify({
				...templateData,
			}),
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

export async function getTemplate(slug: string, id: string) {
	'use server';
	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);

	const response = await fetch(
		`  ${env.MANAGAMENT_API_URL}/api/organizations/${currentOrganization?.organization.id}/templates/${id}`,
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
