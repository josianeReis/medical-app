"use client";

import { updateOrganization } from "@/services/organization";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Separator,
} from "@packages/ui-components";
import React from "react";
import { toast } from "sonner";
import DeadZone from "./DeadZone";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { RedirectType, redirect } from "next/navigation";
import OrganizationAdressForm from "./OrganizationAdressForm";
import { UserWithDetails } from "@packages/auth-config/plugins/user-session-details-client";

interface OrganizationProps {
  organization: Organization | undefined;
  user: UserWithDetails;
}

const organizationSchema = (tCommon: (key: string) => string) =>
  z.object({
    name: z.string().min(1, tCommon("name.errors.required")),
    slug: z.string().min(1, tCommon("slug.errors.required")),
    logo: z.string().optional(),
    cpf: z.string().max(14, tCommon("cpf.errors.invalid")).optional(),
    cnpj: z.string().max(18, tCommon("cnpj.errors.invalid")).optional(),
  });

export type OrganizationInputs = z.infer<ReturnType<typeof organizationSchema>>;

const OrganizationForm = ({ organization, user }: OrganizationProps) => {
  const t = useTranslations("settings.organization");
  const tCommon = useTranslations("fields");
  const inviteSchema = organizationSchema(tCommon);
  const organizationMetadata = JSON.parse(organization?.metadata || "{}");

  const form = useForm<OrganizationInputs>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      name: organization?.name || "",
      slug: organization?.slug || "",
      logo: organization?.logo || "",
      cpf: organizationMetadata?.cpf || "",
      cnpj: organizationMetadata?.cnpj || "",
    },
  });

  const updateOrganizationField = async (
    field: "name" | "slug",
    newValue: string,
    onSuccess?: () => void
  ) => {
    if (!organization?.id || newValue === organization[field]) return;

    const result = await updateOrganization({
      id: organization.id,
      data: {
        [field]: newValue,
        metadata: organizationMetadata,
      },
    });

    if (result.success) {
      toast.success("Oganização atualizada com sucesso");
      onSuccess?.();
    } else {
      console.error("Erro ao atualizar:", result.error);
    }
  };

  const updateMetadataField = async (
    field: "cnpj" | "cpf",
    newValue: string
  ) => {
    if (!organization?.id || newValue === organizationMetadata[field]) return;

    const result = await updateOrganization({
      id: organization.id,
      data: {
        metadata: {
          ...organizationMetadata,
          [field]: newValue,
        },
      },
    });

    if (result.success) {
      toast.success("Oganização atualizada com sucesso");
    } else {
      console.error("Erro ao atualizar:", result.error);
    }
  };

  return (
    <div className="py-2 sm:px-24 md:px-36  lg:px-44  xl:px-72">
      <div className="flex w-full flex-col justify-between gap-4">
        <h1 className="text-3xl text-medium text-black dark:text-white">
          {t("title")}
        </h1>

        <div className="border bg-white rounded-sm px-4 mt-4">
          <FormProvider {...form}>
            <form className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="logo"
                render={() => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel className="w-full">
                      {tCommon("logo.label")}
                    </FormLabel>
                    <FormControl>
                      <div className="w-10 h-9 border  bg-green-700 rounded-full"></div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel className="w-full">
                      {tCommon("name.label")}
                    </FormLabel>
                    <FormControl>
                      <div className="w-full relative ">
                        <Input
                          {...field}
                          onBlur={(e) => {
                            if (e.target.value !== organization?.slug) {
                              updateOrganizationField("slug", e.target.value);
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel className="w-full">
                      {tCommon("slug.label")}
                    </FormLabel>
                    <FormControl>
                      <div className="w-full relative ">
                        <Dialog>
                          <DialogTrigger className="w-full">
                            <div className="w-full relative">
                              <p className="text-sm absolute px-3 pt-1 text-gray-500 font-medium">
                                nexdoc.clinic/
                              </p>
                              <Input
                                className="h-7 pl-[6.4rem] pb-1.5"
                                defaultValue={organization?.slug ?? ""}
                              />
                            </div>
                          </DialogTrigger>
                          <DialogContent className="p-0">
                            <DialogHeader>
                              <DialogTitle className="p-4">
                                {t("dialog.title")}
                              </DialogTitle>
                              <Separator />
                            </DialogHeader>

                            <div className="px-4 space-y-4">
                              <p className="text-muted-foreground text-sm">
                                {t("dialog.description")}
                              </p>

                              <div className="grid gap-3">
                                <Label htmlFor="name-1">
                                  {t("dialog.label")}
                                </Label>
                                <div className=" relative">
                                  <p className="text-sm absolute px-3 pt-2 text-gray-500 font-medium">
                                    nexdoc.clinic/
                                  </p>
                                  <Input
                                    {...field}
                                    className=" pl-[6.4rem] pb-1.5"
                                  />
                                </div>
                              </div>
                            </div>

                            <DialogFooter className="p-4">
                              <DialogClose>
                                <Button> {t("dialog.cancel")}</Button>
                              </DialogClose>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  updateOrganizationField(
                                    "slug",
                                    form.getValues("slug"),

                                    () =>
                                      redirect(
                                        `/${form.getValues("slug")}/settings/organization`,
                                        RedirectType.replace
                                      )
                                  )
                                }
                              >
                                {t("dialog.submit")}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {form.getValues("cpf") ? (
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel>{tCommon("cpf.label")}</FormLabel>

                      <FormControl>
                        <div className="w-full relative ">
                          <Input
                            {...field}
                            onBlur={(e) => {
                              if (e.target.value !== organization?.slug) {
                                updateMetadataField("cpf", e.target.value);
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-full">
                        {tCommon("cnpj.label")}
                      </FormLabel>

                      <FormControl>
                        <div className="w-full relative ">
                          <Input
                            {...field}
                            onBlur={(e) => {
                              if (e.target.value !== organization?.slug) {
                                updateMetadataField("cnpj", e.target.value);
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </FormProvider>
        </div>

        <OrganizationAdressForm
          organization={organizationMetadata}
          id={organization?.id}
        />
        <DeadZone organization={organization} user={user} />
      </div>
    </div>
  );
};

export default OrganizationForm;
