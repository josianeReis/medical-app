import { MessageCard } from "@/components/MessageCard";
import { getCurrentUser } from "@/services/auth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("email-verification/success.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const EmailVerificationSuccess = async ({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; email?: string }>;
}) => {
  const { error, email: emailParam } = await searchParams;
  const user = await getCurrentUser();

  const email = emailParam ?? user?.email;

  if (error || (user && !user.emailVerified)) {
    redirect(
      `/email-verification/error?${new URLSearchParams({
        ...(error ? { error } : {}),
        ...(email ? { email } : {}),
      }).toString()}`
    );
  }

  const t = await getTranslations("email-verification/success");

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

export default EmailVerificationSuccess;
