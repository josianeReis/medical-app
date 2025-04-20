"use client";
import { signup } from "@/services/auth";
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
  Label,
} from "@packages/ui-components";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const Signup = () => {
  const t = useTranslations("signup");
  const tCommon = useTranslations("common.formFields");

  const signupSchema = z
    .object({
      firstName: z.string().min(1, tCommon("firstName.fieldErrors.required")),
      lastName: z.string().min(1, tCommon("lastName.fieldErrors.required")),
      email: z
        .string()
        .min(1, tCommon("email.fieldErrors.required"))
        .email("Email invalid"),
      password: z
        .string()
        .nonempty(tCommon("password.fieldErrors.required"))
        .min(6, tCommon("password.fieldErrors.minlength")),
      confirmPassword: z
        .string()
        .nonempty(tCommon("confirmPassword.fieldErrors.required"))
        .min(6, tCommon("confirmPassword.fieldErrors.match"))
        .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tCommon("confirmPassword.fieldErrors.match"),
      path: ["confirmPassword"],
    });

  type SignupInputs = z.infer<typeof signupSchema>;

  const form = useForm<SignupInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    delete data.confirmPassword;

    const { error, isEmailVerified } = await signup(data);
    if (error) {
      return toast.error(error, {
        id: error,
      });
    }
    if (!isEmailVerified) {
      toast.warning(t("emailNotVerified"), {
        id: t("emailNotVerified"),
      });
      redirect("/email-verification");
    }
    toast.success(t("success"));
    redirect("/login");
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tCommon("firstName.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tCommon("firstName.placeholder")}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tCommon("lastName.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tCommon("lastName.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <FormLabel>{tCommon("password.label")}</FormLabel>
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tCommon("confirmNewPassword.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tCommon("confirmNewPassword.placeholder")}
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" variant="default" className="w-full mt-4">
                  {t("createaccount")}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center">
            <Label>{t("labelfooter")}</Label>
            <Link href="/login" className="hover:underline mx-2">
              {t("signin")}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
