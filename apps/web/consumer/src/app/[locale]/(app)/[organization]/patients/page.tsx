import PatientsList from './patient-list';
import { getPatients } from '@/services/patients';

export default async function Patients({
	params,
}: {
	params: Promise<{ organization: string }>;
}) {
	const { organization } = await params;
	const patients = await getPatients(organization);
	return <PatientsList patients={patients} organization={organization} />;
}
