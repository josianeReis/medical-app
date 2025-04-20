"use server";

import { env } from "@/utils/env";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getCookieHeader,
  getErrorMessage,
  handleSetCookies,
} from "../api-client/api-client";
import { authClient, User } from "./auth-client";

interface SigninData {
  email: string;
  password: string;
}

export async function login(signinData: SigninData): Promise<{
  error?: string;
  success: boolean;
}> {
  "use server";

  const { email, password } = signinData;

  if (!email || !password) {
    return { error: "Email and password are required", success: false };
  }

  const { error, data } = await authClient.signIn.email(
    {
      email,
      password,
      callbackURL: `${env.NEXT_PUBLIC_APP_URL}/email-verification/success`,
    },
    {
      onSuccess: async (data) => {
        const setCookie = data.response.headers.getSetCookie();
        await handleSetCookies(setCookie);
      },
      fetchOptions: {
        headers: {
          ...(await getCookieHeader()),
        },
      },
    }
  );

  revalidatePath("/", "layout");

  if (error?.code || !data) {
    if (error?.code === "EMAIL_NOT_VERIFIED") {
      redirect("/email-verification");
    }
    return { error: await getErrorMessage(error), success: false };
  }

  return { success: true };
}

interface SignupData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export async function signup(signupData: SignupData): Promise<{
  error?: string;
  success: boolean;
  isEmailVerified: boolean;
}> {
  "use server";
  const { email, firstName, lastName, password } = signupData;
  const t = await getTranslations("api.errorCodes");

  const { error, data } = await authClient.signUp.email(
    {
      email,
      firstName,
      lastName,
      password,
      name: `${firstName} ${lastName}`,
      callbackURL: `${env.NEXT_PUBLIC_APP_URL}/email-verification/success`,
    },
    {
      onSuccess: async (data) => {
        const setCookie = data.response.headers.getSetCookie();
        await handleSetCookies(setCookie);
      },
      fetchOptions: {
        headers: {
          ...(await getCookieHeader()),
        },
      },
    }
  );

  revalidatePath("/", "layout");

  if (error?.code || !data) {
    return {
      error: await getErrorMessage(error),
      success: false,
      isEmailVerified: false,
    };
  }

  if (!data.user.emailVerified) {
    return {
      error: t("EMAIL_NOT_VERIFIED"),
      success: false,
      isEmailVerified: false,
    };
  } else {
    return { success: true, isEmailVerified: true };
  }
}

export async function logout() {
  "use server";
  const cookieStore = await cookies();
  const { error } = await authClient.signOut({
    fetchOptions: {
      headers: {
        ...(await getCookieHeader()),
      },
      onResponse: async (data) => {
        const setCookie = data.response.headers.getSetCookie();
        await handleSetCookies(setCookie);
      },
    },
  });

  if (error) {
    console.error("Error signing out from server");
    console.error("Logout error:", error);

    cookieStore
      .getAll()
      .map((cookie) =>
        cookieStore.set({ name: cookie.name, value: "", maxAge: 0 })
      );
  }
}

export async function sendVerificationEmail(email?: string): Promise<{
  error?: string;
  success: boolean;
  emailVerified: boolean;
  emailRequired?: boolean;
}> {
  "use server";
  const user = await getCurrentUser();
  if (user?.emailVerified) {
    return { success: true, emailVerified: true };
  }

  email = email ?? user?.email;

  if (!email) {
    return {
      error: await getErrorMessage({
        code: "EMAIL_REQUIRED",
        message: "Email is required",
        status: 400,
        statusText: "Bad Request",
      }),
      success: false,
      emailVerified: false,
      emailRequired: true,
    };
  }
  const { error } = await authClient.sendVerificationEmail({
    email: email ?? user?.email ?? "",
    callbackURL: `${env.NEXT_PUBLIC_APP_URL}/email-verification/success`,
    fetchOptions: {
      headers: {
        ...(await getCookieHeader()),
      },
    },
  });
  if (error) {
    return {
      error: await getErrorMessage(error),
      success: false,
      emailVerified: false,
    };
  }
  return { success: true, emailVerified: false };
}

export async function forgotPassword(email: string): Promise<{
  error?: string;
  success: boolean;
}> {
  "use server";
  const { error } = await authClient.forgetPassword({
    email,
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });
  if (error) {
    return { error: await getErrorMessage(error), success: false };
  }
  return { success: true };
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{
  error?: string;
  success: boolean;
}> {
  "use server";
  const { error } = await authClient.resetPassword({ token, newPassword });
  if (error) {
    return { error: await getErrorMessage(error), success: false };
  }
  return { success: true };
}

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await authClient.getSession({
    fetchOptions: {
      headers: {
        ...(await getCookieHeader()),
      },
    },
  });

  if (error?.code || !data?.user.email) {
    console.log("Failed to get user data");
    return null;
  }

  return data.user;
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
