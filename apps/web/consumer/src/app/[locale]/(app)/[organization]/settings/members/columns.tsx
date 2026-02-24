'use client';

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	Button,
} from '@packages/ui-components';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { OrganizationRole } from '@/utils/constants';
import MemberActions from './MemberActions';
import ColumnTranslation from '@/components/column-header';

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	});
};

export const columns: ColumnDef<Member>[] = [
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
			const member = row.original;
			const userName = member.user.name;

			const userEmail = member.user.email;

			return (
				<div className="flex items-center gap-3 pl-2">
					<Avatar className="size-7">
						<AvatarImage src={member.user.image || undefined} alt={userName} />
						<AvatarFallback>
							{userName
								.split(' ')
								.map((n) => n[0])
								.join('')
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className="font-medium text-sm">{userName}</div>
						<div className="text-xs text-muted-foreground">
							{userEmail.split('@')[0]}
						</div>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: 'email',
		header: () => <ColumnTranslation name="email" />,
		cell: ({ row }) => {
			return <div className="text-sm">{row.original.user.email}</div>;
		},
	},
	{
		accessorKey: 'role',
		header: () => <ColumnTranslation name="role" />,
		cell: ({ row }) => {
			const role = row.original.role;

			return (
				<Badge
					variant={
						role === OrganizationRole.OWNER
							? 'default'
							: role === OrganizationRole.SECRETARY
								? 'secondary'
								: 'outline'
					}
				>
					<ColumnTranslation name={role} />
				</Badge>
			);
		},
	},
	{
		accessorKey: 'createdAt',
		header: () => <ColumnTranslation name="joined" />,
		cell: ({ row }) => {
			const createdAt = row.original.createdAt;
			return <div className="text-sm">{formatDate(createdAt)}</div>;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const member = row.original;

			return <MemberActions member={member} />;
		},
	},
];
