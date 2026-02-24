import { getPatients } from '@/services/patients';
import { getPrintMasks } from '@/services/print-masks';
import { getProcedures } from '@/services/procedure';
import { getReport } from '@/services/reports';
import { getTemplates } from '@/services/templates';
import EditReportForm from './EditReportForm';

const Page = async ({
    params,
}: {
    params: Promise<{ organization: string; id: string }>;
}) => {
    const { organization: organizationSlug, id } = await params;

    const [report, patientsRes, proceduresRes, templatesRes, masksRes] = await Promise.all([
        getReport(organizationSlug, id),
        getPatients(organizationSlug),
        getProcedures(organizationSlug),
        getTemplates(organizationSlug),
        getPrintMasks(organizationSlug),
    ]);

    if ('error' in report) {
        return <div>{report.error}</div>;
    }

    return (
        <EditReportForm
            report={report}
            patients={patientsRes?.data.items ?? []}
            procedures={proceduresRes.data.items ?? []}
            templates={templatesRes.data.items ?? []}
            printMasks={masksRes.data.items ?? []}
            slug={organizationSlug}
        />
    );
};

export default Page;