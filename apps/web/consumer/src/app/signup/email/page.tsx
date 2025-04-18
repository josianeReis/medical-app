"use client";
import { useTranslations } from "next-intl";
import { AUTH_API_URL } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  buttonVariants,
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
} from "@packages/ui-components";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@packages/ui-components/components/ui/input-otp";
import { ChevronLeft } from "lucide-react";

import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const sendVerificationEmailSchema = z.object({
  code: z.string().min(1, "Email is required"),
});

type SendVerificationEmailInputs = z.infer<typeof sendVerificationEmailSchema>;

const SendVerificationEmail = () => {
  const t = useTranslations("signup/email");
  const form = useForm<SendVerificationEmailInputs>({
    resolver: zodResolver(sendVerificationEmailSchema),
  });

  const onSubmit: SubmitHandler<SendVerificationEmailInputs> = async (data) => {
    await fetch(`${AUTH_API_URL}/send/verification/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm ">
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
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
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="items-center justify-center">
                        {t("code")}
                      </FormLabel>
                      <FormControl>
                        <InputOTP
                          {...field}
                          containerClassName="items-center justify-center"
                          className=""
                          maxLength={6}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="default" className="w-full mt-4">
                  <Link href="/send/verification/email">
                   {t("sendverificationemail")}
                  </Link>
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center">
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline" })}
            >
              <ChevronLeft />
              {t("backtologin")}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SendVerificationEmail;
