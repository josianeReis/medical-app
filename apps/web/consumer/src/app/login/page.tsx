import { getCurrentUser } from "@/services/auth";
import { redirect, RedirectType } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("login.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const Login = async () => {
  const user = await getCurrentUser();
  if (user) {
    redirect("/", RedirectType.replace);
  }
  return <LoginForm />;
};

export default Login;
