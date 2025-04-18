"use client";
import { useTranslations } from "next-intl";
import {
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@packages/ui-components";
import Link from "next/link";
import React from "react";
import { ChevronLeft, CircleCheckBig } from "lucide-react";

const ChangePassword = () => {
  const t = useTranslations("change-password");
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="flex flex-col gap-6">
          <CardHeader className="items-center justify-center gap-2">
          <CircleCheckBig className="m-2"color="#42d40c" />
            <CardTitle className="text-2xl">
              {t("title")}
            </CardTitle>
            <CardDescription className=" text-center text-slate-950">
              <p>{t("descripionreset")}</p>
              <p>{t("descripionclick")}</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CardFooter className="items-center justify-center">
              <Link
                href="/login"
                className={buttonVariants({ variant: "outline" })}
              >
                <ChevronLeft/>
               {t("backtologin")}
              </Link>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
