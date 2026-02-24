import { getTemplate } from '@/services/templates';
import UpdateTemplateForm from './UpdateTemplateForm';
import { redirect } from 'next/navigation';

const Page = async ({
	params,
}: {
	params: Promise<{
		organization: string;
		id: string;
	}>;
}) => {
	const { organization, id } = await params;

	const template = await getTemplate(organization, id);

	if (!template) {
		return redirect(`/${organization}/templates`);
	}
	return <UpdateTemplateForm template={template} slug={organization}  />;
};

export default Page;
