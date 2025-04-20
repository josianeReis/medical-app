import { MessageCard } from "@/components/MessageCard";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reset-password/error.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const ResetPasswordError = async () => {
  const t = await getTranslations("reset-password/error");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <MessageCard
          variant="error"
          title={t("title")}
          description={t("description")}
          description2={t("description2")}
          backButton={t("backButton")}
          backButtonHref="/forgot-password"
        />
      </div>
    </div>
  );
};

export default ResetPasswordError;
