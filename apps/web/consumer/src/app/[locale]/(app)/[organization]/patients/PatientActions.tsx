'use client';

import {
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

const PatientActions = ({ id }: { id: string }) => {
	const t = useTranslations('common.templates');
	const [open, setOpen] = React.useState(false);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => redirect(`patients/${id}`, RedirectType.push)}
				>
					{t('edit_template')}
				</DropdownMenuItem>
				<DropdownMenuItem asChild variant="destructive"></DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default PatientActions;
