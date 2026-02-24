'use client';

import ColumnTranslation from '@/components/column-header';
import { formatDate } from '@/utils/format-date';
import { Badge, Button } from '@packages/ui-components';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import React from 'react';
import PatientActions from './PatientActions';
import { differenceInYears, parse } from 'date-fns';


export const columns: ColumnDef<Patient>[] = [
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
		accessorKey: 'birthday',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="h-auto p-0 font-medium text-left justify-start"
				>
					<ColumnTranslation name="birthday" />
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return <div className="pl-3 text-sm">{row.original.birthdate}</div>;
		},
	},
	{
		accessorKey: 'age',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="h-auto p-0 font-medium text-left justify-start"
				>
					<ColumnTranslation name="age" />
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},

		cell: ({ row }) => {
			const birthDate = parse(row.original.birthdate, 'dd/MM/yyyy', new Date());
			const age = differenceInYears(new Date(), birthDate);

			return <div className="pl-3 text-sm">{age}</div>;
		},
	},
	{
		accessorKey: 'gender',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="h-auto p-0 font-medium text-left justify-start"
				>
					<ColumnTranslation name="gender" />
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return <div className="pl-3 text-sm">{row.original.gender}</div>;
		},
	},
	{
		accessorKey: 'document-type',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="h-auto p-0 font-medium text-left justify-start"
				>
					<ColumnTranslation name="document-type" />
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="pl-3 text-sm">{row.original.documents[0]?.type}</div>
			);
		},
	},
	{
		accessorKey: 'document-number',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="h-auto p-0 font-medium text-left justify-start"
				>
					<ColumnTranslation name="document-number" />
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="pl-3 text-sm">{row.original.documents[0]?.number}</div>
			);
		},
	},
	{
		accessorKey: 'phoneNumber',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="h-auto p-0 font-medium text-left justify-start"
				>
					<ColumnTranslation name="phoneNumber" />
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return <div className="pl-3 text-sm">{row.original.phoneNumber}</div>;
		},
	},
	{
		accessorKey: 'email',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="h-auto p-0 font-medium text-left justify-start"
				>
					<ColumnTranslation name="email" />
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return <div className="pl-3 text-sm">{row.original.email}</div>;
		},
	},
	{
		accessorKey: 'active',
		header: () => {
			return <ColumnTranslation name="active" />;
		},
		cell: ({ row }) => {
			return (
				<Badge variant={!!row.original.deletedAt ? 'secondary' : 'default'}>
					{!!row.original.deletedAt ? (
						<ColumnTranslation name="active" />
					) : (
						<ColumnTranslation name="active" />
					)}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'created-at',
		header: () => {
			return <ColumnTranslation name="created-at" />;
		},
		cell: ({ row }) => {
			const createdAt = row.original.createdAt;
			return <div className="text-sm">{formatDate(createdAt)}</div>;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return <PatientActions id={row.original.id} />;
		},
	},
];
