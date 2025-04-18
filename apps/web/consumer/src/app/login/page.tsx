"use client";
import { useTranslations } from "next-intl";
import { AUTH_API_URL } from "@/utils/constants";
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
import Link from "next/link";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { z } from "zod";

const signinSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email invalid"),
  password: z.string().min(1, "Password should be at least 6 caracters"),
});

type SigninInputs = z.infer<typeof signinSchema>;

const Login = () => {
  const t = useTranslations("login");
  const form = useForm<SigninInputs>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit: SubmitHandler<SigninInputs> = async (data) => {
    await fetch(`${AUTH_API_URL}/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="flex flex-col gap-6">
          <CardHeader>
            <CardTitle>{t("login")}</CardTitle>
            <CardDescription>
            {t("description")}
            </CardDescription>
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
                    <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex.: johndoe@gmail.com"
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
                        <FormLabel>{t("password")}</FormLabel>
                        <Link
                          href="/forget_password"
                          className="hover:underline mx-1"
                        >
                          {t("forgotpassword")}
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Ex.: 123@.#fdscvAPamfg1234"
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

export default Login;
