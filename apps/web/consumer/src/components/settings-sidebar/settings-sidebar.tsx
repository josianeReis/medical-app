'use client';

import { OrganizationRole } from '@/utils/constants';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
} from '@packages/ui-components';
import { Organization } from 'better-auth/plugins/organization';
import { Building, ChevronLeft, CircleUser, Users } from 'lucide-react';
import Link from 'next/link';

interface SettingsSidebarProps {
	role: string;
	teamId: string;
	organization: Organization;
}

export function SettingsSidebar({ organization, role }: SettingsSidebarProps) {
	return (
		<Sidebar collapsible="icon">
			<div className="flex justify-between px-4 py-5">
				<Link
					href={`/${organization.slug}/dashboard`}
					className="flex items-center gap-1 text-sm cursor-pointer"
				>
					<ChevronLeft width={14} height={14} />
					Voltar
				</Link>
			</div>
			<SidebarContent className="gap-0">
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<Link
								href={`/${organization.slug}/settings/profile`}
								className="text-sm px-2.5 flex items-center gap-2"
							>
								<CircleUser size={14} />
								Perfil
							</Link>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				{role === OrganizationRole.OWNER && (
					<SidebarGroup>
						<SidebarGroupLabel>Organização</SidebarGroupLabel>
						<SidebarMenu>
							<SidebarMenuItem>
								<Link
									href={`/${organization.slug}/settings/organization`}
									className="text-sm px-2.5 flex items-center gap-2"
								>
									<Building size={14} />
									Organização
								</Link>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<Link
									href={`/${organization.slug}/settings/members`}
									className="text-sm px-2.5 flex items-center gap-2"
								>
									<Users size={14} />
									Membros
								</Link>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
				)}
			</SidebarContent>
		</Sidebar>
	);
}
