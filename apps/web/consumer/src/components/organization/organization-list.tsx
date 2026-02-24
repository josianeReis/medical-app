"use client";

import { authClient } from "@/services/auth/auth-client";
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@packages/ui-components";
import { Organization } from "better-auth/plugins/organization";
import { redirect } from "next/navigation";
import React from "react";

const OrganizationList = () => {
  const { data: organizations } = authClient.useListOrganizations();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="text-sm">
        Trocar de organização
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {organizations?.map((item: Organization) => (
            <DropdownMenuItem
              key={item.id}
              className="text-sm cursor-pointer"
              onClick={() => redirect(`/${item.slug}/dashboard`)}
            >
              {item.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-sm cursor-pointer"
            onClick={() => redirect("/accept-invitation")}
          >
            Entrar em uma organização
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};

export default OrganizationList;
