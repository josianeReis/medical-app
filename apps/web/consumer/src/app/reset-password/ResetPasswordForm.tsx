"use client";
import { resetPassword } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@packages/ui-components";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ResetPasswordFormProps {
  code: string;
}

const createResetPasswordSchema = (tCommon: (key: string) => string) =>
  z.object({
      newPassword: z
        .string()
        .nonempty(tCommon("newPassword.fieldErrors.required"))
        .min(6, tCommon("newPassword.fieldErrors.minlength")),
      confirmNewPassword: z
        .string()
        .nonempty(tCommon("confirmNewPassword.fieldErrors.required"))
        .min(6, tCommon("confirmNewPassword.fieldErrors.match")),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: tCommon("confirmNewPassword.fieldErrors.match"),
      path: ["confirmNewPassword"],
    });

export type ResetPasswordInputs = z.infer<ReturnType<typeof createResetPasswordSchema>>;

const ResetPasswordForm = ({ code = "" }: ResetPasswordFormProps) => {
  const t = useTranslations("reset-password");
  const tCommon = useTranslations("common.formFields");
  
  const resetPasswordSchema = createResetPasswordSchema(tCommon);

  const form = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (data) => {
    const { error, success } = await resetPassword(code, data.newPassword);
    if (error) {
      toast.error(error);
      redirect("/reset-password/error");
    }
    if (success) {
      redirect("/reset-password/success");
    }
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="flex flex-col gap-6">
          <CardHeader>
            <CardTitle>{t("title")} </CardTitle>
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
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tCommon("newPassword.label")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={tCommon("newPassword.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tCommon("confirmNewPassword.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={tCommon(
                            "confirmNewPassword.placeholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="default" className="w-full mt-4">
                  {t("resetpassword")}
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
