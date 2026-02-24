import { env } from '@/utils/env';
import { getCookieHeader } from '../api-client/api-client';
import { getCurrentUser } from '../auth';

const APPOINTMENT_ENDPOINT = `${env.MANAGAMENT_API_URL}/api/organizations`;

type ListAppointmentsParams = {
	slug: string;
	from: string; // ISO
	to: string; // ISO
	roomId?: string;
	doctorId?: string;
};

export async function listAppointments(params: ListAppointmentsParams) {
	const user = await getCurrentUser();
	const org = user?.members?.find(
		(m: any) => m.organization?.slug === params.slug,
	);
	if (!org) throw new Error('Organization not found');

	const url = new URL(
		`${APPOINTMENT_ENDPOINT}/${org.organization.id}/appointments`,
		env.MANAGAMENT_API_URL,
	);
	url.searchParams.set('from', params.from);
	url.searchParams.set('to', params.to);
	if (params.roomId) url.searchParams.set('roomId', params.roomId);
	if (params.doctorId) url.searchParams.set('doctorId', params.doctorId);
	url.searchParams.set('limit', '200');

	const res = await fetch(url.toString(), {
		headers: {
			...(await getCookieHeader()),
		},
		cache: 'no-cache',
	});
	console.log('🚀 ~ res ~ res:', res);
	return (await res.json()).data?.items ?? [];
}
