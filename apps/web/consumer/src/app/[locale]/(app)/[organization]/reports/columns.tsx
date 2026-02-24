'use client';

import ColumnTranslation from '@/components/column-header';
import { formatDate } from '@/utils/format-date';
import { Badge, Button } from '@packages/ui-components';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import React from 'react';
import ReportActions from './ReportActions';

export const columns: ColumnDef<MedicalReport>[] = [
	{
		id: 'patient',
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				className="h-auto p-0 font-medium text-left justify-start"
			>
				<ColumnTranslation name="patient" />
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div className="pl-3 text-sm">{row.original.patient?.name}</div>
		),
	},
	{
		id: 'doctor',
		header: () => <ColumnTranslation name="doctor" />,
		cell: ({ row }) => <div className="text-sm">{row.original.doctor?.name}</div>,
	},
	{
		accessorKey: 'status',
		header: () => <ColumnTranslation name="status" />,
		cell: ({ row }) => {
			return (
				<Badge variant={'secondary'}>{row.original.status}</Badge>
			);
		},
	},
	{
		accessorKey: 'createdAt',
		header: () => <ColumnTranslation name="created_at" />,
		cell: ({ row }) => {
			return <div className="text-sm">{formatDate(row.original.createdAt)}</div>;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => (
			<ReportActions organizationId={row.original.organizationId} report={row.original} />
		),
	},
];