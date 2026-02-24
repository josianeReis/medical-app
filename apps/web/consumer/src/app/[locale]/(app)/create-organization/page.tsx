import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CreateOrganizationForm } from "./createOrganizationForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common.create-organization.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const CreateOrganization = async () => {
  return (
    <ProtectedRoute>
      <CreateOrganizationForm />
    </ProtectedRoute>
  );
};

export default CreateOrganization;
