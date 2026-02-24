'use client';

import * as React from 'react';
import {
	Archive,
	ClipboardPlus,
	FileSliders,
	GalleryVerticalEnd,
	Users,
} from 'lucide-react';

import { NavigationMenu } from '../components/navigation-menu';
import { NavUser } from '../components/nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@packages/ui-components';
import { OrganizationRole } from '@/utils/constants';
import { UserWithDetails } from '@packages/auth-config/plugins/user-session-details-client';

const data = [
	{
		title: 'Geral',
		pages: [
			{
				title: 'Gerenciar pacientes',
				url: 'patients',
				icon: Users,
				permissions: [
					OrganizationRole.SECRETARY,
					OrganizationRole.DOCTOR,
					OrganizationRole.OWNER,
				],
			},
			{
				title: 'Laudos aprovados',
				url: '#',
				icon: ClipboardPlus,
				permissions: [
					OrganizationRole.SECRETARY,
					OrganizationRole.DOCTOR,
					OrganizationRole.OWNER,
				],
			},
		],
	},
	{
		title: 'Laudos',
		pages: [
			{
				title: 'Gerar novo laudo',
				url: 'reports/new',
				icon: ClipboardPlus,
				permissions: [OrganizationRole.DOCTOR, OrganizationRole.OWNER],
			},

			{
				title: 'Gerenciar laudos',
				url: 'reports',
				icon: Archive,
				permissions: [OrganizationRole.DOCTOR, OrganizationRole.OWNER],
			},
		],
	},
	{
		title: 'Templates',
		pages: [
			{
				title: 'Gerenciar templates',
				url: 'templates',
				icon: FileSliders,
				permissions: [OrganizationRole.OWNER],
			},
		],
	},
	{
		title: 'Máscaras de impressão',
		pages: [
			{
				title: 'Gerenciar máscaras',
				url: 'print-masks',
				icon: FileSliders,
				permissions: [OrganizationRole.OWNER],
			},
		],
	},
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user?: UserWithDetails;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
	const matchedMember = user?.members.find(
		(member: any) => member.organization?.id === user.lastUsedOrganizationId,
	);
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<div className="flex items-center gap-2 mt-3 ml-1">
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
						<GalleryVerticalEnd className="size-4" />
					</div>
					<span className="truncate font-semibold">Nexdoc.clinic</span>
				</div>
			</SidebarHeader>

			<SidebarContent className="gap-2">
				{data.map((item) => (
					<NavigationMenu
						key={item.title}
						navigation={item}
						role={matchedMember?.role as MemberRole}
					/>
				))}
			</SidebarContent>

			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
