import { MessageCard } from "@/components/MessageCard";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reset-password/success.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}
const ResetPasswordSuccess = async () => {
  const t = await getTranslations("reset-password/success");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <MessageCard
          variant="success"
          title={t("title")}
          description={t("description")}
          description2={t("description2")}
          backButton={t("backButton")}
          backButtonHref="/login"
        />
      </div>
    </div>
  );
};

export default ResetPasswordSuccess;
