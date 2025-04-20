"use client";
import { forgotPassword } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@packages/ui-components";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ForgotPasswordForm = () => {
  const t = useTranslations("forgot-password");
  const tCommon = useTranslations("common.formFields");
  const forgotPasswordSchema = z.object({
    email: z
      .string()
      .min(1, tCommon("email.fieldErrors.required"))
      .email(tCommon("email.fieldErrors.invalid")),
  });

  type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;
  const form = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    const { error, success } = await forgotPassword(data.email);
    if (error) {
      toast.error(error);
    }
    if (success) {
      redirect("/forgot-password/success");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="flex flex-col gap-4">
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
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
                <Button
                  type="submit"
                  variant="default"
                  className="w-full mt-6 self-center"
                >
                  {t("forgotPasswordButton")}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline" asChild>
              <Link href="/login">
                <ChevronLeft />
                {t("backButton")}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
