"use server";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getCurrentUser } from "@/services/auth";
import { redirect } from "next/navigation";
import Organizations from "./Organizations";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common.organizations.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const OrganizationsList = async () => {
  const t = await getTranslations("common.organizations");
  const data = await getCurrentUser();

  if (!data.members.length) {
    redirect("/create-organization");
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col gap-1">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-80 flex-col justify-between gap-4 sm:w-1/3">
            <h1 className="text-3xl font-extrabold text-black dark:text-white">
              {t("title")}
            </h1>
            <p className="text-sm text-gray-500">{t("description")}</p>
            <Organizations members={data?.members} />
            <p className="text-center text-sm">
              {t("accept-invitation")}{" "}
              <Link
                href="/accept-invitation"
                className="font-semibold hover:underline"
              >
                {t("enter")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrganizationsList;
