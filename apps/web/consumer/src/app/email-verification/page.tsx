import { MessageCard } from "@/components/MessageCard";
import { MailCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("email-verification.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const SendVerificationEmail = async () => {
  const t = await getTranslations("email-verification");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <MessageCard
          variant="custom"
          title={t("title")}
          description={t("description")}
          description2={t("description2")}
          backButton={t("backButton")}
          backButtonHref="/login"
          icon={<MailCheck className="text-green-500" />}
        />
      </div>
    </div>
  );
};

export default SendVerificationEmail;
