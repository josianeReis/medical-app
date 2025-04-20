import { Metadata } from "next";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("forgot-password.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const ForgotPassword = () => {
  return <ForgotPasswordForm />;
};

export default ForgotPassword;
