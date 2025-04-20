import { MessageCard } from "@/components/MessageCard";
import { sendVerificationEmail } from "@/services/auth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { DisplayToast } from "../../../components/display-toast";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("email-verification/error.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const EmailVerificationError = async ({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) => {
  const { email } = await searchParams;
  const t = await getTranslations("email-verification/error");
  let errorComponent: ReactNode;

  const {
    error,
    emailVerified,
    emailRequired = false,
  } = await sendVerificationEmail(email);
  if (error) {
    errorComponent = <DisplayToast message={error} type="error" />;
  }

  if (emailRequired) {
    redirect("/login");
  }

  if (emailVerified) {
    errorComponent = (
      <DisplayToast message={t("emailAlreadyVerified")} type="success" />
    );
    redirect("/email-verification/success");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {errorComponent}

        <MessageCard
          variant="error"
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

export default EmailVerificationError;
