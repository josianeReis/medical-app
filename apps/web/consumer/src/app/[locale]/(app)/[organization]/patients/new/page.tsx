import { createPatient } from '@/services/patients';
import { getTranslations } from 'next-intl/server';
import { PatientFormData, PatientForm } from '../components/PatientForm';

interface NewPatientProps {
	params: Promise<{ organization: string }>;
}

export default async function NewPatient({ params }: NewPatientProps, data:PatientFormData) {
	
	const { organization } = await params;
	const t = await getTranslations('common.patient');

	const onSubmit = async (data: PatientFormData) => {
		'use server';
		const { document, document_type, ...patientFormData } = data;

		await createPatient(organization, {
			documents: [{ number: document, type: document_type }],
			...patientFormData,
		});
		// redirect(`/${organization}/patients`);
	};

	return (
		<div className="py-2 sm:px-24 md:px-36  lg:px-44  xl:px-72">
			<div className="flex w-full flex-col justify-between gap-4">
				<h1 className="text-3xl text-medium text-black dark:text-white">
					{t('register-patient')}
				</h1>

				<PatientForm data={data} onSubmit={onSubmit} />
			</div>
		</div>
	);
}
