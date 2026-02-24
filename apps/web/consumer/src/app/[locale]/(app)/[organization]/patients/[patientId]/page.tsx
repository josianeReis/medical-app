import { getPatientById, updatePatient } from '@/services/patients';
import { getTranslations } from 'next-intl/server';
import { PatientFormData, PatientForm } from '../components/PatientForm';

type EditPatientProps = {
	params: Promise<{ patientId: string; organization: string }>;
};

export default async function EditPatient({ params }: EditPatientProps) {
	const { patientId, organization } = await params;
	const t = await getTranslations('common.patient');

	const getPatientData = async () => {
		const existingPatient = await getPatientById(patientId, organization);
		const { documents, ...existingPatientData } = existingPatient.data;

		const patientDocument = documents?.at(0);

		const data: PatientFormData = {
			...existingPatientData,
			document: patientDocument?.number ?? '',
			document_type: patientDocument?.type ?? '',
			gender: existingPatientData.gender ?? '',
		};

		return data;
	};

	const patientData = await getPatientData();
	console.log('🚀 ~ EditPatient ~ patientData:', patientData);

	const onSubmit = async (data: PatientFormData) => {
		'use server';
		const { document, document_type, ...patientFormData } = data;

		updatePatient(patientId, {
			documents: [{ number: document, type: document_type }],
			...patientFormData,
		});
	};

	return (
		<div className="py-2 sm:px-24 md:px-36  lg:px-44  xl:px-72">
			<div className="flex w-full flex-col justify-between gap-4">
				<h1 className="text-3xl text-medium text-black dark:text-white">
					{t('title-edit-patient')}
				</h1>

				<PatientForm data={patientData} onSubmit={onSubmit} />
			</div>
		</div>
	);
}
