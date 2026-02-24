import { redirect, RedirectType } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import OrganizationForm from "./OrganizationForm";
import { getFullOrganization } from "@/services/organization";
import { getCurrentUser } from "@/services/auth";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("settings.organization.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

interface PageProps {
  params: Promise<{
    organization: string;
  }>;
}

const Organization = async ({ params }: PageProps) => {
  const { organization: organizationSlug } = await params;
  const organization = await getFullOrganization(organizationSlug);
  const user = await getCurrentUser();

  if (!organization) {
    redirect("/organization", RedirectType.replace);
  }

  if (!user) {
    redirect("/login", RedirectType.replace);
  }

  return <OrganizationForm organization={organization.data} user={user} />;
};

export default Organization;
