import { getCurrentUser } from "@/services/auth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AcceptInvitationForm } from "../AcceptInvitationForm";
import { redirectWithParams } from "@/utils/params";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common.accept-invitation.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

interface PageProps {
  params: Promise<{
    code: string;
  }>;
  searchParams?: {
    newUser?: string;
    email?: string;
  };
}

const AcceptInvitationCode = async ({ params, searchParams }: PageProps) => {
  const user = await getCurrentUser();
  const { code } = await params;

  const searchParamsObj = await searchParams;
  const newUser = searchParamsObj?.newUser;
  const email = searchParamsObj?.email;

  if (newUser) {
    redirectWithParams("/signup", { email, code });
  }

  if (!user) {
    redirectWithParams("/login", { code });
  }

  return <AcceptInvitationForm />;
};

export default AcceptInvitationCode;
