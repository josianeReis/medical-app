'use client';

import { deleteReport, publishReport } from '@/services/reports';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@packages/ui-components';
import { MoreHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { redirect, RedirectType } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

const ReportActions = ({
	organizationId,
	report,
}: {
	organizationId: string;
	report: MedicalReport;
}) => {
	const t = useTranslations('common.reports');
	const [open, setOpen] = React.useState(false);

	async function handleDelete() {
		const { error, message } = await deleteReport(organizationId, report.id);

		if (error) {
			toast.error(error);
		}
		setOpen(false);
		toast.success(message);
		redirect(`reports`, RedirectType.push);
	}

	async function handlePublish() {
		const { error, message } = await publishReport(organizationId, report.id);
		if (error) {
			toast.error(error);
		} else {
			toast.success(message);
		}
	}

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => redirect(`reports/${report.id}`, RedirectType.push)}
				>
					{t('view') || 'View'}
				</DropdownMenuItem>
				{report.status === 'draft' && (
					<DropdownMenuItem onClick={handlePublish}>
						{t('publish') || 'Publish'}
					</DropdownMenuItem>
				)}
				<DropdownMenuItem asChild variant="destructive">
					<AlertDialog>
						<AlertDialogTrigger className="hover:bg-gray-50 focus:bg-accent focus:text-accent-foreground   data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 text-red-600">
							{t('delete_template')}
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>{t('confirm_delete_title')}</AlertDialogTitle>
								<AlertDialogDescription>
									{t('confirm_delete_description')}
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogAction onClick={handleDelete}>
									{t('delete_template')}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ReportActions;