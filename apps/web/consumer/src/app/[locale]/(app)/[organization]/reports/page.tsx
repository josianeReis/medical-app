import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Button } from '@packages/ui-components';
import Link from 'next/link';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { getReports } from '@/services/reports';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('common.reports.metadata');
	return {
		title: t('title'),
		description: t('description'),
	};
}

const Page = async ({
	params,
	searchParams,
}: {
	params: Promise<{ organization: string }>;
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	const t = await getTranslations('common.reports');
	const { organization: organizationSlug } = await params;
	const searchParamsObject = await searchParams;



	const queryString = typeof searchParamsObject === 'object' ? new URLSearchParams(searchParamsObject as any ?? {}).toString() : '';

	const reports = await getReports(organizationSlug, queryString);

	return (
		<div className="">
			<div className="flex w-full flex-col justify-between gap-4">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-medium text-black dark:text-white">
						{t('metadata.title')}
					</h1>
					<div className="flex items-center gap-2">
						<Link href={`/${organizationSlug}/reports/new`}>
							<Button>{t('create_template')}</Button>
						</Link>
					</div>
				</div>

				<div className="container mx-auto">
					<DataTable columns={columns} data={reports.data.items} filterColumName="patient" />
				</div>
			</div>
		</div>
	);
};

export default Page;