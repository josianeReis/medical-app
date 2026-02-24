'use client';

import { type LucideIcon } from 'lucide-react';

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@packages/ui-components';
import { OrganizationRole } from '@/utils/constants';
import { redirect, RedirectType } from 'next/navigation';

interface NavigationMenuProps {
	navigation: {
		title: string;
		pages: {
			title: string;
			url: string;
			icon: LucideIcon;
			permissions: MemberRole[];
		}[];
	};
	role?: MemberRole;
}

export function NavigationMenu({
	navigation,
	role = OrganizationRole.DOCTOR,
}: NavigationMenuProps) {
	const permittedPages = navigation.pages.filter((item) =>
		item.permissions.includes(role),
	);
	return (
		<SidebarGroup>
			<SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
				{permittedPages.length === 0 ? null : navigation.title}
			</SidebarGroupLabel>
			<SidebarMenu>
				{navigation.pages.map((item) => (
					<SidebarMenuItem key={item.title}>
						{item.permissions.includes(role) && (
							<SidebarMenuButton
								tooltip={item.title}
								className="flex items-center gap-2"
								onClick={() => redirect(item.url, RedirectType.push)}
							>
								{item.icon && <item.icon className="size-4" />}
								<p className="text-sm">{item.title}</p>
							</SidebarMenuButton>
						)}
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
