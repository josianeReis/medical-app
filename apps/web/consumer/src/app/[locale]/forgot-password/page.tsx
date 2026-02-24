import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ForgotPasswordForm from "./ForgotPasswordForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common.forgot-password.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const ForgotPassword = () => {
  return <ForgotPasswordForm />;
};

export default ForgotPassword;