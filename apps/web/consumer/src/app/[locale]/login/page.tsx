import { getCurrentUser } from "@/services/auth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "./loginForm";
import { redirect } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common.login.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const Login = async () => {
  const user = await getCurrentUser();
  if (user) {
    redirect({
      href: "/organizations",
      locale: user.language,
    });
  }
  return <LoginForm />;
};

export default Login;
