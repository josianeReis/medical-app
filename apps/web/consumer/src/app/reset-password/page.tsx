import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import ResetPasswordForm from "./ResetPasswordForm";

interface ResetPasswordProps {
  searchParams: Promise<{
    token: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reset-password.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const ResetPassword = async ({ searchParams }: ResetPasswordProps) => {
  const { token } = await searchParams;

  if (!token) {
    redirect("/reset-password/error");
  }
  return <ResetPasswordForm code={token} />;
};

export default ResetPassword;
