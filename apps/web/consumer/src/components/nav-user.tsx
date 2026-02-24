"use client";

import { ChevronsUpDown } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@packages/ui-components";

import { logout } from "@/services/auth";
import { redirect, useParams } from "next/navigation";
import OrganizationList from "./organization/organization-list";
import { UserWithDetails } from "@packages/auth-config/plugins/user-session-details-client";

export function NavUser({
  user,
}: {
  user?: UserWithDetails;
}) {
  const params = useParams();
  const organizationSlug = params.organization as string;
  const { isMobile } = useSidebar();

  const handleLogout = async () => {
    await logout();
    redirect("/");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.image ?? undefined}
                  alt={user?.name ?? ""}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.firstName.at(0)}
                  {user?.lastName.at(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{`${user?.firstName} ${user?.lastName}`}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.image ?? undefined}
                    alt={user?.name ?? "user picture"}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.firstName.at(0)}
                    {user?.lastName.at(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{`${user?.firstName} ${user?.lastName}`}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => redirect(`/${organizationSlug}/settings`)}
            >
              Configurações
            </DropdownMenuItem>

            <OrganizationList />

            <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
