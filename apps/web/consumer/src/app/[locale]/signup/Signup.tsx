"use client";
import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@packages/ui-components";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "@/services/auth";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

const createSignupSchema = (tCommon: (key: string) => string) =>
  z
    .object({
      firstName: z.string().min(1, tCommon("first-name.errors.required")),
      lastName: z.string().min(1, tCommon("last-name.errors.required")),
      email: z
        .string()
        .min(1, tCommon("email.errors.required"))
        .email("Email invalid"),
      password: z
        .string()
        .nonempty(tCommon("password.errors.required"))
        .min(6, tCommon("password.errors.minlength")),
      confirmPassword: z
        .string()
        .nonempty(tCommon("confirm-password.errors.required"))
        .min(6, tCommon("confirm-password.errors.match"))
        .optional(),
      terms: z.boolean(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tCommon("confirm-password.errors.match"),
      path: ["confirm-password"],
    });
export type SignupInputs = z.infer<ReturnType<typeof createSignupSchema>>;

export const SignupForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("common.signup");
  const tCommon = useTranslations("fields");
  const [showPassword, setShowPassword] = useState(false);

  const signupSchema = createSignupSchema(tCommon);

  const form = useForm<SignupInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: searchParams.get("email") || "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    delete data.confirmPassword;
    const { error } = await signup(data);

    if (error) {
      return toast.error(error, {
        id: error,
      });
    }

    // TODO: Re-enable email verification redirect when OTP flow is restored.
    router.push("/organizations");
    return;
  };

  return (
    <div className="flex min-h-screen flex-col gap-1">
      <div className="flex justify-between px-7 pt-5 sm:px-10">
        <Link href="/login" className="flex items-center gap-1">
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="flex w-full gap-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{tCommon("first-name.label")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{tCommon("last-name.label")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tCommon("email.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tCommon("email.placeholder")}
                          disabled={!!searchParams.get("email")}
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
                        <div className="relative">
                          <Input
                            placeholder="•••••••••"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
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
                      <FormLabel>{tCommon("password.label")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="•••••••••"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            className="mt-0.5"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            ref={field.ref}
                            name={field.name}
                            disabled={field.disabled}
                          />
                          <p className="text-sm">
                            {t("user-accept")}{" "}
                            <Link
                              href="/term-of-responsability"
                              className="font-bold"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("term-of-responsability")}
                            </Link>
                          </p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant="default"
                  className=" w-full"
                  disabled={!form.getValues("terms")}
                >
                  {t("create-account")}
                </Button>
              </form>
            </Form>
            <div className="flex flex-col justify-center gap-2 text-center text-sm sm:flex-row">
              {t("already-have-account")}
              <Link href="/login" className="tracking-wide underline">
                {t("signin")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
