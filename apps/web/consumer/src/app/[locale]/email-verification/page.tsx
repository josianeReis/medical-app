import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { VerificationEmail } from "./VerificationForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common.email-verification.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const SendVerificationEmail = async () => {
  return <VerificationEmail />;
};

export default SendVerificationEmail;
