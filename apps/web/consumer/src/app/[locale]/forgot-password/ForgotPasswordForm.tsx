"use client";
import { sendVerificationOtp, resetPassword } from "@/services/auth";
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
import { ChevronLeft, Eye, EyeOff, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createForgotPasswordSchema = (tCommon: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, tCommon("email.errors.required"))
      .email(tCommon("email.errors.invalid")),
    password: z.string(),
    code: z.string(),
  });

export type ForgotPasswordInputs = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

const ForgotPasswordForm = () => {
  const t = useTranslations("common.forgot-password");
  const tCommon = useTranslations("fields");
  const [sentCode, setSentCode] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const forgotPasswordSchema = createForgotPasswordSchema(tCommon);
  const [seconds, setSeconds] = useState(600);

  useEffect(() => {
    if (!sentCode || seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [sentCode, seconds]);

  const format = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const form = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    const { error, success } = await resetPassword(data);
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Senha alterada com sucesso");
      redirect("/login");
    }
  };

  const handleSendCode = async () => {
    const email = form.getValues("email");
    setSentCode(true);

    const { error } = await sendVerificationOtp(email, "forget-password");
    if (error) {
      toast.error(error);
    }
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
          <div className="flex flex-col gap-2">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{tCommon("email.label")}</FormLabel>
                        <FormControl>
                          <Input
                            disabled={sentCode}
                            placeholder={tCommon("email.placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    onClick={handleSendCode}
                    disabled={sentCode}
                  >
                    {t("send-code")}
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tCommon("password.label")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            disabled={!sentCode}
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
                        <InputOTP maxLength={6} disabled={!sentCode} {...field}>
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

                <Button
                  disabled={!sentCode}
                  className="w-full rounded-md bg-primary p-2 shadow-sm"
                  type="submit"
                >
                  {t("reset-password")}
                </Button>
              </form>
            </FormProvider>
            <div className="flex flex-col justify-center gap-2 text-center text-sm sm:flex-row">
              {t("remembered-password")}
              <Link href="/login" className="tracking-wide underline">
                {t("login")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
