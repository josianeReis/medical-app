'use server';

import { env } from '@/utils/env';
import { getCookieHeader } from '../api-client/api-client';
import { getCurrentUser } from '../auth';

export type GetProceduresResponse = APIReturn<PaginatedReturn<Procedure[]>>;

export async function getProcedures(
	slug: string,
): Promise<GetProceduresResponse> {
	const user = await getCurrentUser();

	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);

	const response = await fetch(
		`${env.MANAGAMENT_API_URL}/api/organizations/${currentOrganization?.organization.id}/procedures`,
		{
			method: 'GET',
			headers: {
				...(await getCookieHeader()),
			},
		},
	);

	const data = (await response.json()) as GetProceduresResponse;

	if (data.error?.code || !data.data) {
		console.log('Failed to get procedures');
		console.error('🚀 getProcedures ~ data:', data);
	}

	return data;
}
