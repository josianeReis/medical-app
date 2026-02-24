"use client";

import React, { useEffect } from "react";
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
import { redirect, RedirectType } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createOrganization } from "@/services/organization";

const createOrganizationSchema = () =>
  z.object({
    name: z.string(),
    slug: z.string(),
  });

export type CreateOrganizationInputs = z.infer<
  ReturnType<typeof createOrganizationSchema>
>;

export const CreateOrganizationForm = () => {
  const t = useTranslations("common.create-organization");
  const organizationSchema = createOrganizationSchema();

  const form = useForm<CreateOrganizationInputs>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });
  const name = form.watch("name");

  useEffect(() => {
    if (name) {
      const newSlug = name.trim().toLowerCase().replace(/\s+/g, "-");
      form.setValue("slug", newSlug);
    }
  }, [name, form]);

  const onSubmit: SubmitHandler<CreateOrganizationInputs> = async (data) => {
    const slug = form.getValues("slug");
    const { error } = await createOrganization(data);
    if (error) {
      form.setError("name", { message: "" });
      form.setError("slug", { message: error });
      return toast.error(error, {
        id: error,
      });
    }

    redirect(`/${slug}/dashboard`, RedirectType.replace);
  };
  return (
    <div className="flex min-h-screen flex-col gap-1">
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("slug")}</FormLabel>

                      <FormControl>
                        <Input type="text" {...field} />
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
