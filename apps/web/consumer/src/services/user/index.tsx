"use server";
import { getCookieHeader, getErrorMessage } from "../api-client/api-client";
import { authClient } from "../auth/auth-client";

interface UpdateUser {
  data: {
    firstName?: string;
    lastName?: string;
    lastUsedOrganizationId?: string
  };
}

export async function updateUser(data: UpdateUser) {
  const { error } = await authClient.updateUser(
    {
      ...data.data,
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
