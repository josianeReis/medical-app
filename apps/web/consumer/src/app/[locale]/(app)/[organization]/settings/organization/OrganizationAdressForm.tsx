"use client";

import { updateOrganization } from "@/services/organization";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
} from "@packages/ui-components";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

const organizationAddressSchema = (tCommon: (key: string) => string) =>
  z.object({
    cep: z.string().min(1, tCommon("cep.errors.required")),
    address: z.string().min(1, tCommon("address.errors.required")),
    number: z.string().min(1, tCommon("number.errors.required")),
    state: z.string().optional(),
    city: z.string().optional(),
  });

export type OrganizationAddressInputs = z.infer<
  ReturnType<typeof organizationAddressSchema>
>;

const OrganizationAdressForm = ({
  organization,
  id = "",
}: {
  organization: OrganizationMetadata;
  id: string | undefined;
}) => {
  const tCommon = useTranslations("fields");
  const inviteSchema = organizationAddressSchema(tCommon);

  const form = useForm<OrganizationAddressInputs>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      cep: organization?.cep || "",
      address: organization?.address || "",
      number: organization?.number || "",
      city: organization?.city || "",
      state: organization?.state || "",
    },
  });

  const onSubmit: SubmitHandler<OrganizationAddressInputs> = async (data) => {
    const result = await updateOrganization({
      id: id,
      data: {
        metadata: {
          ...organization,
          ...data,
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
    <div>
      <p>Endereço</p>

      <div className="border bg-white rounded-sm px-4 mt-4">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="w-full">
                    {tCommon("address.label")}
                  </FormLabel>
                  <FormControl>
                    <div className="w-full relative ">
                      <Input {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="w-full">
                    {tCommon("number.label")}
                  </FormLabel>
                  <FormControl>
                    <div className="w-full relative ">
                      <Input {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="w-full">
                    {tCommon("city.label")}
                  </FormLabel>
                  <FormControl>
                    <div className="w-full relative ">
                      <Input {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="w-full">
                    {tCommon("cep.label")}
                  </FormLabel>
                  <FormControl>
                    <div className="w-full relative ">
                      <Input {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="flex justify-end mt-4">
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default OrganizationAdressForm;
