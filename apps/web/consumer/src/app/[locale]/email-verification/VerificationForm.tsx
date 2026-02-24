"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@packages/ui-components";
import { useTranslations } from "next-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { sendVerificationOtp, verifyEmail } from "@/services/auth";
import { toast } from "sonner";
import {  useSearchParams } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { redirectWithParams } from "@/utils/params";

const createSigninSchema = (tCommon: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, tCommon("email.errors.required"))
      .email(tCommon("email.errors.invalid")),
    code: z.string(),
  });

export type SigninInputs = z.infer<ReturnType<typeof createSigninSchema>>;

export const VerificationEmail = () => {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  const t = useTranslations("common.email-verification");
  const tCommon = useTranslations("fields");
  const signinSchema = createSigninSchema(tCommon);
  const [seconds, setSeconds] = useState(600);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const format = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const form = useForm<SigninInputs>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: emailParam,
      code: "",
    },
  });

  const onSubmit: SubmitHandler<SigninInputs> = async (data) => {
    const { error, success } = await verifyEmail(data);
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Email verificado com sucesso");
      redirectWithParams('/login', { code: searchParams.get("code") });
    }
  };

  const handleSendCode = async () => {
    const email = form.getValues("email");

    const { error } = await sendVerificationOtp(email, "email-verification");
    if (error) {
      toast.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-1">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-80 flex-col justify-between gap-4 sm:w-1/3">
          <h1 className="text-3xl font-extrabold text-black dark:text-white">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-600">{t("description")}</p>

          <div className="flex flex-col gap-2">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="flex items-end gap-2 ">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{tCommon("email.label")}</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            placeholder={tCommon("email.placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>{t("code")}</FormLabel>
                        <div className="text-sm text-gray-600">
                          {seconds > 0 ? (
                            <p>{format(seconds)}</p>
                          ) : (
                            <p
                              onClick={handleSendCode}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <RefreshCcw size={12} />
                              Solicite um novo token
                            </p>
                          )}
                        </div>
                      </div>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup className="w-full">
                            <InputOTPSlot className="w-full" index={0} />
                            <InputOTPSlot className="w-full" index={1} />
                            <InputOTPSlot className="w-full" index={2} />
                            <InputOTPSlot className="w-full" index={3} />
                            <InputOTPSlot className="w-full" index={4} />
                            <InputOTPSlot className="w-full" index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" variant="default" className=" w-full">
                  {t("verify")}
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};