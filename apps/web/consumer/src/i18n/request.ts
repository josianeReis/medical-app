import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { getCurrentUser } from "@/services/auth";

export default getRequestConfig(async ({ requestLocale }) => {
  const user = await getCurrentUser();
  const requested = await requestLocale;

  const preferredLocale =
    user?.language && hasLocale(routing.locales, user.language)
      ? user.language
      : requested;

  const locale = hasLocale(routing.locales, preferredLocale)
    ? preferredLocale
    : routing.defaultLocale;
    
  return {
    locale,
    messages: (await import(`./messages/${locale}/${locale}.ts`)).default,
  };
});
