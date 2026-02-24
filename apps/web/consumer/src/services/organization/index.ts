"use server";
import { OrganizationRole } from "@/utils/constants";
import {
  getCookieHeader,
  getErrorMessage,
  handleSetCookies,
} from "../api-client/api-client";
import { authClient } from "../auth/auth-client";
import { getCurrentUser } from "../auth";

interface CreateOrganization {
  name: string;
  slug: string;
}

export async function createOrganization(data: CreateOrganization) {
  const { error, data: organization } = await authClient.organization.create(
    {
      name: data.name,
      slug: data.slug,
    },
    {
      headers: {
        ...(await getCookieHeader()),
      },
    }
  );

  if (error || !organization) {
    return {
      error: await getErrorMessage(error),
      success: false,
    };
  }

  return { success: true, data };
}

export async function setActiveOrganization(id: string) {
  const { error } = await authClient.organization.setActive(
    {
      organizationId: id,
    },
    {
      headers: {
        ...(await getCookieHeader()),
      },
      onResponse: async (data) => {
        const setCookie = data.response.headers.getSetCookie();
        await handleSetCookies(setCookie);
      },
    }
  );

  if (error) {
    return {
      error: await getErrorMessage(error),
      success: false,
    };
  }

  return { success: true };
}

export async function getFullOrganization(slug: string): Promise<{
  error?: string;
  success: boolean;
  data?: Organization;
}> {
  const { data, error } = await authClient.organization.getFullOrganization(
    {
      query: { organizationSlug: slug },
    },
    {
      headers: {
        ...(await getCookieHeader()),
      },
    }
  );

  if (error && !data) {
    return {
      error: await getErrorMessage(error),
      success: false,
    };
  }

  return {
    success: true,
    data: data,
  };
}

interface UpdateOrganization {
  data: {
    name?: string;
    slug?: string;
    metadata: {
      cep?: string;
      address?: string;
      number?: string;
      cpf?: string;
      cnpj?: string;
      city?: string;
      state?: string;
    };
  };
  id: string;
}
export async function updateOrganization(data: UpdateOrganization) {
  const { error } = await authClient.organization.update(
    {
      data: {
        name: data.data.name,
        slug: data.data.slug,
        metadata: data.data.metadata,
      },
      organizationId: data.id,
    },
    {
      headers: {
        ...(await getCookieHeader()),
      },
    }
  );

  if (error) {
    return {
      error: await getErrorMessage(error),
      success: false,
    };
  }

  return { success: true };
}

export async function deleteOrganization(id: string) {
  const { error } = await authClient.organization.delete(
    {
      organizationId: id,
    },
    {
      headers: {
        ...(await getCookieHeader()),
      },
    }
  );

  if (error) {
    return {
      error: await getErrorMessage(error),
      success: false,
    };
  }

  return { success: true };
}

export async function inviteMemberToOrganization(data: {
  email: string;
  role: OrganizationRole;
  slug: string;
}) {

 const user = await getCurrentUser();

  const currentOrganization = user?.members?.find(
    (member: any) => member.organization?.slug === data.slug,
  );

  
  const { error } = await authClient.organization.inviteMember(
    {
      email: data.email,
      role: data.role,
      resend: true,
      organizationSlug: currentOrganization?.organization.slug,
      organizationId: currentOrganization?.organization.id,
    },
    {
      headers: {
        ...(await getCookieHeader()),
      },
    }
  );

  if (error) {
    return {
      error: await getErrorMessage(error),
      success: false,
    };
  }

  return { success: true };
}

export async function acceptInvitation(invitationId: string): Promise<{
  error?: string;
  success: boolean;
}> {
  const { error } = await authClient.organization.acceptInvitation(
    {
      invitationId: invitationId,
    },
    {
      headers: {
        ...(await getCookieHeader()),
      },
    }
  );
  if (error) {
    return { error: await getErrorMessage(error), success: false };
  }

  return { success: true };
}

export async function removeMember(
  member: string,
  organizationId: string
): Promise<{
  error?: string;
  success: boolean;
}> {
  const { error } = await authClient.organization.removeMember(
    {
      memberIdOrEmail: member,
      organizationId: organizationId,
    },
    {
      headers: {
        ...(await getCookieHeader()),
      },
    }
  );
  if (error) {
    return { error: await getErrorMessage(error), success: false };
  }

  return { success: true };
}

interface MemberRoleUpdate {
  id: string;
  role: MemberRole;
  organizationId: string;
}

export async function updateMemberRole({
  id,
  role,
  organizationId,
}: MemberRoleUpdate): Promise<{
  error?: string;
  success: boolean;
}> {
  const { error } = await authClient.organization.updateMemberRole(
    {
      memberId: id,
      role: role,
      organizationId: organizationId,
    },
    {
      headers: {
        ...(await getCookieHeader()),
      },
    }
  );
  if (error) {
    return { error: await getErrorMessage(error), success: false };
  }

  return { success: true };
}
