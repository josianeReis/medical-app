"use client";

import { updateUser } from "@/services/user";
import { Button } from "@packages/ui-components";
import { redirect } from "next/navigation";
import React from "react";
import { toast } from "sonner";

type OrganizationMember = {
  id: string;
  organization: { id: string; name: string; slug: string };
};

const Organizations = ({ members }: any) => {
  const openOrganization = async (org: { id: string; slug: string }) => {
    const { error } = await updateUser({
      data: {
        lastUsedOrganizationId: org.id,
      },
    });

    if (error) {
      return toast.error(error, {
        id: error,
      });
    }

    redirect(`/${org.slug}/dashboard`);
  };

  return (
    <div className="flex flex-col gap-2">
      {members?.map((member: OrganizationMember) => (
         <Button
          variant={"secondary"}
          key={member.organization.slug}
          className="border cursor-pointer rounded-sm p-2"
          onClick={() => openOrganization(member.organization)}
        >
        {member.organization.name}
        </Button>
      ))}
    </div>
  );
};

export default Organizations;
