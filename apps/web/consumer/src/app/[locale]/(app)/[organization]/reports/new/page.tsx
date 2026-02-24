import React from 'react';
import { getPatients } from '@/services/patients';
import { getProcedures } from '@/services/procedure';
import { getTemplates } from '@/services/templates';
import { getPrintMasks } from '@/services/print-masks';
import ReportComposerForm from './ReportComposerForm';
import { getCurrentUser } from '@/services/auth';

const Page = async ({
	params,
}: {
	params: Promise<{ organization: string }>;
}) => {
	const { organization: organizationSlug } = await params;

	// Parallel fetches
	const [patientsRes, proceduresRes, templatesRes, masksRes, user] = await Promise.all([
		getPatients(organizationSlug),
		getProcedures(organizationSlug),
		getTemplates(organizationSlug),
		getPrintMasks(organizationSlug),
		getCurrentUser(),
	]);

	const patients = patientsRes?.data.items ?? [];
	const procedures = proceduresRes.data.items ?? [];
	const templates = templatesRes.data.items ?? [];
	const masks = masksRes.data.items ?? [];
	const currentUserId = user?.id ?? '';

	return (
		<ReportComposerForm
			patients={patients}
			procedures={procedures}
			templates={templates}
			printMasks={masks}
			currentUserId={currentUserId}
		/>
	);
};

export default Page;