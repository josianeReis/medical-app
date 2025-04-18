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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
} from "@packages/ui-components";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Email invalid"),
    password: z.string().min(6, "Password should be at least 6 caracters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password should be at least 6 caracters")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupInputs = z.infer<typeof signupSchema>;

const Signup = () => {
   const t = useTranslations("signup");
  const form = useForm<SignupInputs>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    delete data.confirmPassword;

    await fetch(`${AUTH_API_URL}/sign-up/email`, {
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
            <CardTitle>{t("title")} </CardTitle>
            <CardDescription>
              {t("description")}
            </CardDescription>
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
                      <FormLabel>{t("firstname")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex.: John" {...field} />
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
                      <FormLabel>{t("lastname")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex.: Doe" {...field} />
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
                      <FormLabel>{t("password")}</FormLabel>
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("confirmnewpassword")}</FormLabel>
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
                  
                  <Link href="/signup/email" className="hover:underline mx-2">
                  {t("createaccount")}
                  </Link>
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
