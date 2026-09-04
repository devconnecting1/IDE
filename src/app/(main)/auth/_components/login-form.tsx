"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { setClientCookie } from "@/lib/cookie.client";

import { OtpVerification } from "./otp-verification";

const DEMO_EMAIL = "matheusmoraesdj2025@gmail.com";
const DEMO_PASSWORD = "10092004@Matheus";

export function LoginForm() {
  const t = useTranslations("auth.form");
  const router = useRouter();
  const [otpEmail, setOtpEmail] = useState<string | null>(null);

  const formSchema = useMemo(
    () =>
      z.object({
        email: z.email({ message: t("emailInvalid") }),
        password: z.string().min(6, { message: t("passwordTooShort") }),
        remember: z.boolean().optional(),
      }),
    [t],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (data.email === DEMO_EMAIL && data.password === DEMO_PASSWORD) {
      setOtpEmail(data.email);
      return;
    }
    toast.error(t("invalidCredentials"));
  }

  function handleOtpSuccess() {
    setClientCookie("demo-auth", "1", 1);
    router.push("/organization");
  }

  if (otpEmail) {
    return <OtpVerification email={otpEmail} onSuccess={handleOtpSuccess} onBack={() => setOtpEmail(null)} />;
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldGroup className="gap-4">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-email">{t("emailLabel")}</FieldLabel>
              <Input
                {...field}
                id="login-email"
                type="email"
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-password">{t("passwordLabel")}</FieldLabel>
              <Input
                {...field}
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="remember"
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                id="login-remember"
                name={field.name}
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                aria-invalid={fieldState.invalid}
              />
              <FieldContent>
                <FieldLabel htmlFor="login-remember" className="font-normal">
                  {t("rememberMe")}
                </FieldLabel>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>
      <Button className="w-full" type="submit">
        {t("submit")}
      </Button>
    </form>
  );
}
