'use server';

import { env } from '@/utils/env';
import { getCookieHeader, getErrorMessage } from '../api-client/api-client';
import { getCurrentUser } from '../auth';

export type GetReportsResponse = APIReturn<PaginatedReturn<MedicalReport[]>>;

export async function getReports(
	slug: string,
	query?: string,
): Promise<GetReportsResponse> {
	'use server';

	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);

	const url = new URL(
		`${env.MANAGAMENT_API_URL}/api/organizations/${currentOrganization?.organization.id}/reports`,
	);
	if (query) {
		url.search = query;
	}

	const response = await fetch(url.toString(), {
		method: 'GET',
		headers: {
			...(await getCookieHeader()),
		},
	});

	const data = (await response.json()) as GetReportsResponse;

	if (data.error?.code || !data.data) {
		console.error('Failed to get reports', data);
	}

	return data;
}

interface CreateReportData {
	patientId: string;
	doctorId: string;
	reviewedById?: string | null;
	procedureId: string;
	templateId: string;
	printMaskId: string;
	htmlContent: string;
	status?: 'draft' | 'review' | 'published';
}

export async function createReport(
	slug: string,
	reportData: CreateReportData,
): Promise<{
	error?: string;
	success: boolean;
	message?: string;
	id?: string;
}> {
	'use server';

	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);

	const response = await fetch(
		`${env.MANAGAMENT_API_URL}/api/organizations/${currentOrganization?.organization.id}/reports`,
		{
			method: 'POST',
			body: JSON.stringify(reportData),
			headers: {
				...(await getCookieHeader()),
				'Content-Type': 'application/json',
			},
		},
	);

	const { error, message, data } = await response.json();

	if (error) {
		return { error: await getErrorMessage(error), success: false };
	}

	return { success: true, message, id: data?.id };
}

export async function updateReport(
	slug: string,
	id: string,
	reportData: Partial<CreateReportData>,
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
		`${env.MANAGAMENT_API_URL}/api/organizations/${currentOrganization?.organization.id}/reports/${id}`,
		{
			method: 'PATCH',
			body: JSON.stringify(reportData),
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

export async function publishReport(
	slug: string,
	id: string,
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
		`${env.MANAGAMENT_API_URL}/api/organizations/${currentOrganization?.organization.id}/reports/${id}/publish`,
		{
			method: 'PATCH',
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

export async function deleteReport(
	organizationId: string,
	id: string,
): Promise<{
	error?: string;
	success: boolean;
	message?: string;
}> {
	'use server';

	const response = await fetch(
		`${env.MANAGAMENT_API_URL}/api/organizations/${organizationId}/reports/${id}`,
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

export async function getReport(slug: string, id: string) {
	'use server';

	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);

	const response = await fetch(
		`${env.MANAGAMENT_API_URL}/api/organizations/${currentOrganization?.organization.id}/reports/${id}`,
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
	return data as MedicalReport;
}