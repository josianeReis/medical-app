import React from 'react';
import { getFullOrganization } from '@/services/organization';
import { columns } from './columns';
import InviteMember from './InviteMember';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { OrganizationRole } from '@/utils/constants';
import { DataTable } from '@/components/data-table';

interface PageProps {
	params: Promise<{
		organization: string;
	}>;
}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('settings.members.metadata');
	return {
		title: t('title'),
		description: t('description'),
	};
}

const page = async ({ params }: PageProps) => {
	const t = await getTranslations('settings.members');
	const { organization: organizationSlug } = await params;
	const organizationData = await getFullOrganization(organizationSlug);

	const filterOptions = [
		{
			value: 'all',
			label: t('roles.all'),
		},
		{
			value: OrganizationRole.DOCTOR,
			label: t('roles.doctor'),
		},
		{
			value: OrganizationRole.SECRETARY,
			label: t('roles.secretary'),
		},
		{
			value: OrganizationRole.OWNER,
			label: t('roles.owner'),
		},
	];

	return (
		<div className="">
			<div className="flex w-full flex-col justify-between gap-4">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-medium text-black dark:text-white">
						Membros
					</h1>
					<div className="flex items-center gap-2">
						<InviteMember />
					</div>
				</div>

				<div className="container mx-auto py-10">
					<DataTable
						columns={columns}
						data={organizationData?.data?.members ?? []}
						filterOptions={filterOptions}
						filterColumName="role"
					/>
				</div>
			</div>
		</div>
	);
};

export default page;
