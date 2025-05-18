"use client";

import React from "react";
import { login } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
} from "@packages/ui-components";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createSigninSchema = (tCommon: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, tCommon("email.fieldErrors.required"))
      .email(tCommon("email.fieldErrors.invalid")),
    password: z.string().min(1, tCommon("password.fieldErrors.required")),
  });

export type SigninInputs = z.infer<ReturnType<typeof createSigninSchema>>;

export const LoginForm = () => {
  const t = useTranslations("login");
  const tCommon = useTranslations("common.formFields");
  
  const signinSchema = createSigninSchema(tCommon);

  const form = useForm<SigninInputs>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SigninInputs> = async (data) => {
    const { error } = await login(data);
    if (error) {
      form.setError("email", { message: "" });
      form.setError("password", { message: error });
      return toast.error(error, {
        id: error,
      });
    }
    redirect("/", RedirectType.replace);
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="flex flex-col gap-6">
          <CardHeader>
            <CardTitle>{t("login")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tCommon("email.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tCommon("email.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col-2 gap-29 text-sm">
                        <FormLabel>{tCommon("password.label")}</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="hover:underline mx-1"
                        >
                          {t("forgotPassword")}
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          placeholder={tCommon("password.placeholder")}
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="default" className="w-full mt-4">
                  {t("submit")}
                </Button>
              </form>
            </FormProvider>
          </CardContent>
          <CardFooter className="justify-center">
            <Label>{t("labelfooter")} </Label>
            <Link href="/signup" className="hover:underline mx-2">
              {t("linksignup")}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
