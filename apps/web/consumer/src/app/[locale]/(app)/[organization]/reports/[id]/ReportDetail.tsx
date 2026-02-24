'use client';

import {
	Button,
	Card,
	CardContent,
	CardFooter,
	Badge,
} from '@packages/ui-components';
import { publishReport } from '@/services/reports';
import { redirect, RedirectType } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';
import { toast } from 'sonner';

interface Props {
	report: MedicalReport;
	slug: string;
	currentUserId: string;
}

export default function ReportDetail({ report, slug, currentUserId }: Props) {
	const t = useTranslations('common.reports');

	async function handlePublish() {
		const { error, message } = await publishReport(slug, report.id);
		if (error) {
			toast.error(error);
		} else {
			toast.success(message);
			redirect(`/${slug}/reports/${report.id}`, RedirectType.replace);
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardContent className="p-4 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-medium">{report?.template?.name ?? 'Report'}</h2>
						<Badge>{report.status}</Badge>
					</div>
					<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: report.htmlContent ?? '' }} />
				</CardContent>
				<CardFooter className="justify-between">
					{report.pdfUrl && (
						<a href={report.pdfUrl} target="_blank" rel="noopener noreferrer">
							<Button variant="outline">PDF</Button>
						</a>
					)}
					<div className="flex gap-2">
						{report.status === 'draft' && report.doctorId === currentUserId && (
							<Button onClick={() => redirect(`/${slug}/reports/${report.id}/edit`, RedirectType.push)}>
								{t('edit_template') || 'Edit'}
							</Button>
						)}
						{report.status === 'draft' && report.doctorId === currentUserId && (
							<Button variant="default" onClick={handlePublish}>
								{t('publish') || 'Publish'}
							</Button>
						)}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}