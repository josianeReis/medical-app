import { getPrintMask } from '@/services/print-masks';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import UpdatePrintMaskForm from './UpdatePrintMaskForm';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('common.print_masks.metadata');
	return {
		title: t('edit_title') || 'Edit Print Mask',
		description: t('description'),
	};
}

const Page = async ({
	params,
}: {
	params: Promise<{
		organization: string;
		id: string;
	}>;
}) => {
	const { organization: organizationSlug, id } = await params;

	const mask = await getPrintMask(organizationSlug, id);

	return (
		<UpdatePrintMaskForm mask={mask} slug={organizationSlug} />
	);
};

export default Page;