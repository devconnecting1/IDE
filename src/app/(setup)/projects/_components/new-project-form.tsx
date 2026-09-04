"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RotateCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CollapsibleCardSection } from "@/components/ui/collapsible-card-section";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SecurityTranslations {
  dataApi: string;
  dataApiDescription: string;
  autoTables: string;
  autoTablesDescription: string;
  autoRls: string;
  autoRlsDescription: string;
}

interface PostgresTypeTranslations {
  postgres: string;
  postgresDefault: string;
  postgresDescription: string;
  postgresOriole: string;
  postgresOrioleAlpha: string;
  postgresOrioleDescription: string;
}

interface ProjectTranslations {
  titleLabel: string;
  titlePlaceholder: string;
  titleHelper: string;
  titleMinLength: string;
  titleMaxLength: string;
  regionLabel: string;
  regionHelper: string;
  regionValue: string;
  regionSelectPlaceholder: string;
  regionRecommended: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  passwordHelper: string;
  passwordMinLength: string;
  generatePassword: string;
  securityLabel: string;
  security: SecurityTranslations;
  advancedConfig: string;
  advancedConfigDescription: string;
  postgresTypeLabel: string;
  postgresType: PostgresTypeTranslations;
  cancel: string;
  createButton: string;
  createdSuccess: string;
}

function generateStrongPassword(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const length = 16;
  let password = "";
  const array = new Uint8Array(length);
  globalThis.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
}

interface RegionOption {
  value: string;
  label: string;
  code: string;
  countryCode: string;
  available: boolean;
  recommended?: boolean;
}

const REGIONS: readonly { continent: string; regions: readonly RegionOption[] }[] = [
  {
    continent: "Americas",
    regions: [
      { value: "us-west-1", label: "West US (North California)", code: "us-west-1", countryCode: "US", available: false },
      { value: "us-west-2", label: "West US (Oregon)", code: "us-west-2", countryCode: "US", available: false },
      { value: "us-east-1", label: "East US (North Virginia)", code: "us-east-1", countryCode: "US", available: false },
      { value: "us-east-2", label: "East US (Ohio)", code: "us-east-2", countryCode: "US", available: false },
      { value: "ca-central-1", label: "Canada (Central)", code: "ca-central-1", countryCode: "CA", available: false },
      { value: "sa-east-1", label: "South America (São Paulo)", code: "sa-east-1", countryCode: "BR", available: true, recommended: true },
    ],
  },
  {
    continent: "Europe",
    regions: [
      { value: "eu-west-1", label: "West EU (Ireland)", code: "eu-west-1", countryCode: "IE", available: false },
      { value: "eu-west-2", label: "West Europe (London)", code: "eu-west-2", countryCode: "GB", available: false },
      { value: "eu-west-3", label: "West EU (Paris)", code: "eu-west-3", countryCode: "FR", available: false },
      { value: "eu-central-1", label: "Central EU (Frankfurt)", code: "eu-central-1", countryCode: "DE", available: false },
      { value: "eu-central-2", label: "Central Europe (Zurich)", code: "eu-central-2", countryCode: "CH", available: false },
      { value: "eu-north-1", label: "North EU (Stockholm)", code: "eu-north-1", countryCode: "SE", available: false },
    ],
  },
  {
    continent: "Asia Pacific",
    regions: [
      { value: "ap-south-1", label: "South Asia (Mumbai)", code: "ap-south-1", countryCode: "IN", available: false },
      { value: "ap-southeast-1", label: "Southeast Asia (Singapore)", code: "ap-southeast-1", countryCode: "SG", available: false },
      { value: "ap-northeast-1", label: "Northeast Asia (Tokyo)", code: "ap-northeast-1", countryCode: "JP", available: false },
      { value: "ap-northeast-2", label: "Northeast Asia (Seoul)", code: "ap-northeast-2", countryCode: "KR", available: false },
      { value: "ap-southeast-2", label: "Oceania (Sydney)", code: "ap-southeast-2", countryCode: "AU", available: false },
    ],
  },
];

type StrengthLevel = "weak" | "fair" | "good" | "strong";

interface StrengthRule {
  label: string;
  met: boolean;
}

function getStrengthLevel(score: number): StrengthLevel {
  if (score <= 1) return "weak";
  if (score <= 2) return "fair";
  if (score <= 3) return "good";
  return "strong";
}

const levelColors: Record<StrengthLevel, string> = {
  weak: "bg-destructive",
  fair: "bg-amber-500",
  good: "bg-blue-500",
  strong: "bg-emerald-500",
};

const levelTrackColors: Record<StrengthLevel, string> = {
  weak: "bg-destructive/15",
  fair: "bg-amber-500/15",
  good: "bg-blue-500/15",
  strong: "bg-emerald-500/15",
};

function PasswordStrength({
  password,
  labels,
}: {
  password: string;
  labels: {
    minChars: string;
    uppercase: string;
    lowercase: string;
    number: string;
    special: string;
    weak: string;
    fair: string;
    good: string;
    strong: string;
  };
}) {
  const rules: StrengthRule[] = [
    { label: labels.minChars, met: password.length >= 8 },
    { label: labels.uppercase, met: /[A-Z]/.test(password) },
    { label: labels.lowercase, met: /[a-z]/.test(password) },
    { label: labels.number, met: /[0-9]/.test(password) },
    { label: labels.special, met: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = rules.filter((r) => r.met).length;
  const level = getStrengthLevel(score);

  if (!password) return null;

  const levelLabel = labels[level];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1">
        {rules.map((rule, i) => (
          <div
            key={rule.label}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < score ? levelColors[level] : levelTrackColors[level]}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`font-medium text-xs ${level === "weak" ? "text-destructive" : ""} ${
            level === "fair" ? "text-amber-600 dark:text-amber-400" : ""
          } ${level === "good" ? "text-blue-600 dark:text-blue-400" : ""} ${
            level === "strong" ? "text-emerald-600 dark:text-emerald-400" : ""
          }`}
        >
          {levelLabel}
        </span>
        <span className="text-muted-foreground text-xs">
          {score}/{rules.length}
        </span>
      </div>
    </div>
  );
}

export function NewProjectForm({ t }: { t: ProjectTranslations }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, { message: t.titleMinLength }).max(64, { message: t.titleMaxLength }),
    password: z.string().min(8, { message: t.passwordMinLength }),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const passwordValue = form.watch("password");

  function handleGeneratePassword() {
    const pw = generateStrongPassword();
    form.setValue("password", pw, { shouldValidate: true });
    setShowPassword(true);
  }

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(t.createdSuccess.replace("{name}", data.name));
    router.push("/dashboard/default");
  }

  return (
    <div className="w-full max-w-2xl">
      <Card>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-0">
            <div className="flex flex-col gap-0 divide-y divide-border">
              {/* Project Name */}
              <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-6">
                <label htmlFor="project-name" className="min-w-[140px] pt-2 font-medium text-sm">
                  {t.titleLabel}
                </label>
                <div className="flex-1">
                  <Input
                    {...form.register("name")}
                    id="project-name"
                    placeholder={t.titlePlaceholder}
                    autoComplete="off"
                    aria-invalid={!!form.formState.errors.name}
                  />
                  <p className="mt-1.5 text-muted-foreground text-xs">{t.titleHelper}</p>
                  {form.formState.errors.name && (
                    <p className="mt-1 text-destructive text-xs">{form.formState.errors.name.message}</p>
                  )}
                </div>
              </div>

              {/* Region */}
              <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-6">
                <label htmlFor="project-region" className="min-w-[140px] pt-2 font-medium text-sm">
                  {t.regionLabel}
                </label>
                <div className="flex-1">
                  <Select defaultValue="sa-east-1">
                    <SelectTrigger id="project-region" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((group) => (
                        <SelectGroup key={group.continent}>
                          <SelectLabel className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                            {group.continent}
                          </SelectLabel>
                          {group.regions.map((region) => (
                            <SelectItem
                              key={region.value}
                              value={region.value}
                              disabled={!region.available}
                              className={!region.available ? "opacity-50" : ""}
                            >
                              <span className="flex items-center gap-2">
                                <span
                                  aria-hidden="true"
                                  className={cn(`flag:${region.countryCode}`, "shrink-0 rounded-xs ring-1 ring-foreground/10")}
                                />
                                <span>{region.label}</span>
                                <span className="text-muted-foreground text-xs">{region.code}</span>
                                {region.recommended && (
                                  <Badge variant="secondary" className="ml-auto px-1.5 py-0 text-[10px] leading-none">
                                    {t.regionRecommended}
                                  </Badge>
                                )}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-1.5 text-muted-foreground text-xs">{t.regionHelper}</p>
                </div>
              </div>

              {/* Database Password */}
              <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-6">
                <label htmlFor="project-password" className="min-w-[140px] pt-2 font-medium text-sm">
                  {t.passwordLabel}
                </label>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      {...form.register("password")}
                      id="project-password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t.passwordPlaceholder}
                      autoComplete="new-password"
                      aria-invalid={!!form.formState.errors.password}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg
                          className="size-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          className="size-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto px-0 text-xs"
                    onClick={handleGeneratePassword}
                  >
                    <RotateCw className="mr-1 size-3" aria-hidden="true" />
                    {t.generatePassword}
                  </Button>
                  <PasswordStrength
                    password={passwordValue || ""}
                    labels={{
                      minChars: t.security.dataApi,
                      uppercase: t.security.autoTables,
                      lowercase: t.security.autoRls,
                      number: t.security.dataApiDescription,
                      special: t.security.autoTablesDescription,
                      weak: "Weak",
                      fair: "Fair",
                      good: "Good",
                      strong: "Strong",
                    }}
                  />
                  {form.formState.errors.password && (
                    <p className="mt-1 text-destructive text-xs">{form.formState.errors.password.message}</p>
                  )}
                </div>
              </div>

              {/* Security */}
              <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-6">
                <span className="min-w-[140px] pt-2 font-medium text-sm">{t.securityLabel}</span>
                <div className="flex-1 space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox id="security-data-api" checked disabled />
                    <div className="space-y-1">
                      <label
                        htmlFor="security-data-api"
                        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t.security.dataApi}
                      </label>
                      <p className="text-muted-foreground text-xs">{t.security.dataApiDescription}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="security-auto-tables" checked disabled />
                    <div className="space-y-1">
                      <label
                        htmlFor="security-auto-tables"
                        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t.security.autoTables}
                      </label>
                      <p className="text-muted-foreground text-xs">{t.security.autoTablesDescription}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="security-auto-rls" checked disabled />
                    <div className="space-y-1">
                      <label
                        htmlFor="security-auto-rls"
                        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t.security.autoRls}
                      </label>
                      <p className="text-muted-foreground text-xs">{t.security.autoRlsDescription}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Configuration - Postgres Type */}
              <CollapsibleCardSection
                title={t.advancedConfig}
                description={t.advancedConfigDescription}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                  <span className="min-w-[140px] pt-2 font-medium text-sm">{t.postgresTypeLabel}</span>
                  <div className="flex-1">
                    <div className="rounded-lg border">
                      <label className="flex cursor-pointer items-start gap-3 border-b p-3 has-[[data-state=checked]]:bg-accent/50">
                        <input
                          type="radio"
                          name="postgres-type"
                          value="postgres"
                          defaultChecked
                          className="mt-0.5 accent-primary"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{t.postgresType.postgres}</span>
                            <Badge variant="secondary" className="px-1.5 py-0 text-[10px] leading-none">
                              {t.postgresType.postgresDefault}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-xs">{t.postgresType.postgresDescription}</p>
                        </div>
                      </label>
                      <label className="flex cursor-not-allowed items-start gap-3 p-3 opacity-50">
                        <input
                          type="radio"
                          name="postgres-type"
                          value="orioldb"
                          disabled
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{t.postgresType.postgresOriole}</span>
                            <Badge variant="secondary" className="px-1.5 py-0 text-[10px] leading-none">
                              {t.postgresType.postgresOrioleAlpha}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-xs">{t.postgresType.postgresOrioleDescription}</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </CollapsibleCardSection>
            </div>
          </CardContent>

          <Separator />

          <CardFooter className="flex items-center justify-between px-4 py-4 sm:px-6">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> : null}
              {t.createButton}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
