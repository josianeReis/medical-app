"use client";

import { updateUser } from "@/services/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserWithDetails } from "@packages/auth-config/plugins/user-session-details-client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@packages/ui-components";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ProfileFormProps {
  user: UserWithDetails;
}

const profileSchema = (tCommon: (key: string) => string) =>
  z.object({
    firstName: z.string().min(1, tCommon("first-name.errors.required")),
    lastName: z.string().min(1, tCommon("last-name.errors.required")),
    username: z.string().min(1, tCommon("username.errors.required")),
    profilePicture: z.string().optional(),
    language: z.enum(["pt", "en", "es"]),
  });

export type ProfileInputs = z.infer<ReturnType<typeof profileSchema>>;

const ProfileForm = ({ user }: ProfileFormProps) => {
  const t = useTranslations("settings.profile");
  const tCommon = useTranslations("fields");
  const signinSchema = profileSchema(tCommon);
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeUrl = (language: string) => {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";
    router.push(`/${language}${pathWithoutLocale}`);
  };

  const form = useForm<ProfileInputs>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      username: user?.username || "",
      profilePicture: user?.image || "",
      language: user?.language || "pt",
    },
  });

  const updateProfileField = async (
    field: "email" | "firstName" | "lastName" | "username" | "language",
    newValue: string,
    onSuccess?: () => void
  ) => {
    if (!user?.id || newValue === user[field]) return;

    const result = await updateUser({
      data: { [field]: newValue },
    });

    if (result.success) {
      toast.success("Perfil atualizado com sucesso!");
      onSuccess?.();
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
                name="firstName"
                render={() => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel className="w-full">
                      {tCommon("profile-picture.label")}
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
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel className="w-full">
                      {tCommon("first-name.label")}
                    </FormLabel>
                    <FormControl>
                      <div className="w-full relative ">
                        <Input
                          {...field}
                          onBlur={(e) => {
                            if (e.target.value !== user?.firstName) {
                              updateProfileField("firstName", e.target.value);
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
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel className="w-full">
                      {tCommon("last-name.label")}
                    </FormLabel>

                    <FormControl>
                      <div className="w-full relative ">
                        <Input
                          {...field}
                          onBlur={(e) => {
                            if (e.target.value !== user?.lastName) {
                              updateProfileField("lastName", e.target.value);
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
                name="username"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel className="w-full">
                      {tCommon("username.label")}
                    </FormLabel>

                    <FormControl>
                      <div className="w-full relative ">
                        <Input
                          {...field}
                          onBlur={(e) => {
                            if (e.target.value !== user?.username) {
                              updateProfileField("username", e.target.value);
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </FormProvider>
        </div>

        <div>
          <p>{t("preferences.title")}</p>
          <div className="border bg-white rounded-sm px-4 mt-4">
            <div className="flex items-center gap-2 py-4">
              <div className="w-full">
                <Label> {t("preferences.languages.title")}</Label>
                <p className="text-xs text-gray-600 mt-1">
                  {t("preferences.languages.description")}
                </p>
              </div>

              <FormProvider {...form}>
                <form>
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value !== user?.language) {
                              updateProfileField("language", value, () =>
                                handleChangeUrl(value)
                              );
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">
                              {t("languages.en")}
                            </SelectItem>
                            <SelectItem value="es">
                              {t("languages.es")}
                            </SelectItem>
                            <SelectItem value="pt">
                              {t("languages.pt")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
