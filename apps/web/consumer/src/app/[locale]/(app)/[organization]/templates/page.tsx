import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Button } from '@packages/ui-components';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import Link from 'next/link';
import { getTemplates } from '@/services/templates';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('common.templates.metadata');
	return {
		title: t('title'),
		description: t('description'),
	};
}

const page = async ({
	params,
}: {
	params: Promise<{
		organization: string;
	}>;
}) => {
	const t = await getTranslations('common.templates');
	const { organization: organizationSlug } = await params;

	const templates = await getTemplates(organizationSlug);

	return (
		<div className="">
			<div className="flex w-full flex-col justify-between gap-4">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-medium text-black dark:text-white">
						{t('metadata.title')}
					</h1>
					<div className="flex items-center gap-2">
						<Link href={`/${organizationSlug}/templates/new`}>
							<Button>{t('create_template')}</Button>
						</Link>
					</div>
				</div>

				<div className="container mx-auto">
					<DataTable
						columns={columns}
						data={templates.data.items}
						filterColumName="name"
					/>
				</div>
			</div>
		</div>
	);
};

export default page;
