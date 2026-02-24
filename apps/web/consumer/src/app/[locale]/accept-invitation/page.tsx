import { getCurrentUser } from "@/services/auth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { AcceptInvitationForm } from "./AcceptInvitationForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common.accept-invitation.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const AcceptInvitation = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login`);
  }

  return <AcceptInvitationForm />;
};

export default AcceptInvitation;
