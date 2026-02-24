import { getCurrentUser } from "@/services/auth";
import { redirect, RedirectType } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("settings.profile.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const Profile = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login", RedirectType.replace);
  }

  return <ProfileForm user={user} />;
};

export default Profile;
