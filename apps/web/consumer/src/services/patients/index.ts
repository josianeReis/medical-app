'use server';
import { env } from '@/utils/env';
import { getCookieHeader } from '../api-client/api-client';
import { getCurrentUser } from '../auth';

type CreatePatientBody = {
	name: string;
	birthdate: string;
	phoneNumber: string;
	documents: { number: string; type: string }[];
	gender?: string;
	email?: string;
	secondPhoneNumber?: string;
};

const PATIENT_ENDPOINT = `${env.MANAGAMENT_API_URL}/api/organizations`;

export type GetPatientsResponse = APIReturn<PaginatedReturn<Patient[]>>;

export async function getPatients(
	slug: string,
): Promise<GetPatientsResponse | undefined> {
	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);
	try {
		const response = await fetch(
			`${PATIENT_ENDPOINT}/${currentOrganization?.organization.id}/patients`,
			{
				method: 'GET',
				verbose: true,
				headers: {
					...(await getCookieHeader()),
				},
			},
		);

		const patientsResponse: GetPatientsResponse = await response.json();
		console.log('🚀 ~ getPatients ~ patientsResponse:', patientsResponse);

		return patientsResponse;
	} catch (error) {
		console.error('🚀 ~ getPatients ~ error:', error);
		return undefined;
	}
}

export async function createPatient(slug: string, data: CreatePatientBody) {
	console.log('🚀 ~ createPatient ~ slug:', slug);
	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);
	console.log('🚀 ~ createPatient ~ currentOrganization:', currentOrganization);
	const response = await fetch(
		`${PATIENT_ENDPOINT}/${currentOrganization?.organization.id}/patients`,
		{
			method: 'POST',
			body: JSON.stringify(data),

			headers: {
				'Content-Type': 'application/json',
				...(await getCookieHeader()),
			},
		},
	);
	console.log('🚀 ~ createPatient ~ response:', response);
	console.log(data);
	const responseData = await response.json();

	console.log('🚀 ~ createPatient ~ response:', responseData.error);
	console.log('🚀 ~ createPatient ~ response:', responseData.error?.fields);
}

export async function updatePatient(slug: string, data: CreatePatientBody) {
	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);
	console.log('🚀 ~ createPatient ~ currentOrganization:', currentOrganization);
	const response = await fetch(
		`${PATIENT_ENDPOINT}/${currentOrganization?.organization.id}/patients`,
		{
			method: 'PATCH',
			body: JSON.stringify(data),

			headers: {
				'Content-Type': 'application/json',
				...(await getCookieHeader()),
			},
		},
	);
	console.log('🚀 ~ updatePatient ~ response:', await response.json());
}

type GetPatientByIdResponse = APIReturn<Patient>;

export async function getPatientById(
	patientId: string,
	slug: string,
): Promise<GetPatientByIdResponse> {
	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);
	const response = await fetch(
		`${PATIENT_ENDPOINT}/${currentOrganization?.organization.id}/patients/${patientId}`,
		{
			method: 'GET',
			headers: {
				...(await getCookieHeader()),
			},
		},
	);
	const data: GetPatientByIdResponse = await response.json();

	return data;
}

/*{export async function updatePatient(slug: string, data: CreatePatientBody) {
	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);
	const response = await fetch(
		`${PATIENT_ENDPOINT}/${currentOrganization?.organization.id}/patients`,
		{
			method: 'PATCH',
			body: JSON.stringify(data),

			headers: {
				...(await getCookieHeader()),
			},
		},
	);
	console.log('🚀 ~ updatePatient ~ response:', await response.json());
}

export async function getPatientById(patientId: string, slug: string) {
	const user = await getCurrentUser();
	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === slug,
	);
	const response = await fetch(
		`${PATIENT_ENDPOINT}/${currentOrganization?.organization.id}/patientId`,
		{
			method: 'GET',

			headers: {
				...(await getCookieHeader()),
			},
		},
	);
	const data = response.json();
	console.log(response);
	return data;
}*/
