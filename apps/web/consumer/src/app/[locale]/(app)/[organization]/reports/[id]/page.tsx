import React from 'react';
import { getReport } from '@/services/reports';
import ReportDetail from './ReportDetail';
import { getCurrentUser } from '@/services/auth';

const Page = async ({
	params,
}: {
	params: Promise<{ organization: string; id: string }>;
}) => {
	const { organization: organizationSlug, id } = await params;

	const [report, user] = await Promise.all([
		getReport(organizationSlug, id),
		getCurrentUser(),
	]);

	return <ReportDetail report={report} slug={organizationSlug} currentUserId={user?.id ?? ''} />;
};

export default Page;