'use client';

import ColumnTranslation from '@/components/column-header';
import { formatDate } from '@/utils/format-date';
import { Badge, Button } from '@packages/ui-components';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import React from 'react';
import TemplateActions from './TemplateActions';

export const columns: ColumnDef<Template>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="h-auto p-0 font-medium text-left justify-start"
				>
					<ColumnTranslation name="name" />
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return <div className="pl-3 text-sm">{row.original.name}</div>;
		},
	},
	{
		accessorKey: 'active',
		header: () => {
			return <ColumnTranslation name="active" />;
		},
		cell: ({ row }) => {
			return (
				<Badge variant={row.original.active === true ? 'default' : 'secondary'}>
					{row.original.active === true ? (
						<ColumnTranslation name="active" />
					) : (
						<ColumnTranslation name="disabled" />
					)}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'createdAt',
		header: () => {
			return <ColumnTranslation name="created_at" />;
		},
		cell: ({ row }) => {
			const createdAt = row.original.createdAt;
			return <div className="text-sm">{formatDate(createdAt)}</div>;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return (
				<TemplateActions
					organizationId={row.original.organizationId}
					id={row.original.id}
				/>
			);
		},
	},
];
