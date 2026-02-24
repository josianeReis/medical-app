"use client";

import React from "react";
import { acceptInvitation } from "@/services/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@packages/ui-components";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  redirect,
  RedirectType,
  useParams,
} from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";

const acceptInvitationSchema = (tCommon: (key: string) => string) =>
  z.object({
    code: z.string().min(1, tCommon("code.errors.required")),
  });

export type AcceptInvitationInputs = z.infer<
  ReturnType<typeof acceptInvitationSchema>
>;

export const AcceptInvitationForm = () => {
  const t = useTranslations("common.accept-invitation");
  const searchParams = useParams();
  const code = searchParams.code as string;
  const tCommon = useTranslations("fields");

  const signinSchema = acceptInvitationSchema(tCommon);

  const form = useForm<AcceptInvitationInputs>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      code: code ?? "",
    },
  });

  const onSubmit: SubmitHandler<AcceptInvitationInputs> = async (data) => {
    const { error } = await acceptInvitation(data.code);
    if (error) {
      return toast.error(error, {
        id: error,
      });
    }
    redirect("/organizations", RedirectType.replace);
  };
  return (
    <div className="flex min-h-screen flex-col gap-1">
      <div className="flex justify-between px-7 pt-5 sm:px-10">
        <Link href="/" className="flex items-center gap-1">
          <ChevronLeft width={14} height={14} />
          Voltar
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-80 flex-col justify-between gap-4 sm:w-1/3">
          <h1 className="text-3xl font-extrabold text-black dark:text-white">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-500">{t("description")}</p>
          <div className="flex flex-col gap-2">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tCommon("code.label")}</FormLabel>
                      <FormControl>
                        <Input disabled={!!code} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {t("submit")}
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
