"use client";

import { useEffect, useState } from "react";
import { redirect as redi, useParams } from "next/navigation";
import { PropsWithChildren } from "react";
import { getCurrentUser } from "@/services/auth";
import { usePathname, useRouter } from "@/i18n/navigation";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "") || "/";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();

      if (!user?.email) {
        redi("/login");
      }

      if (params.locale !== user?.language) {
        router.push(`/${pathWithoutLocale}`);
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [params.locale, pathWithoutLocale, router]);

  return loading ? <div /> : <>{children}</>;
}
