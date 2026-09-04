"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Rocket } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const ORG_TYPES = ["personal", "educational", "startup", "agency", "company", "na"] as const;
const PLANS = ["free", "pro", "team"] as const;

interface OrganizationTranslations {
  title: string;
  description: string;
  nameLabel: string;
  namePlaceholder: string;
  nameHelper: string;
  nameMinLength: string;
  nameMaxLength: string;
  typeLabel: string;
  typeHelper: string;
  typeRequired: string;
  types: Record<string, string>;
  planLabel: string;
  planHelper: string;
  planRequired: string;
  plans: Record<string, string>;
  learnMore: string;
  cancel: string;
  createButton: string;
  createdSuccess: string;
}

export function OrganizationForm({ t }: { t: OrganizationTranslations }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, { message: t.nameMinLength }).max(64, { message: t.nameMaxLength }),
    type: z.enum(ORG_TYPES, { message: t.typeRequired }),
    plan: z.enum(PLANS, { message: t.planRequired }),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "personal",
      plan: "free",
    },
  });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(t.createdSuccess.replace("{name}", data.name));
    router.push("/projects");
  }

  return (
    <div className="w-full max-w-2xl">
      <Card>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-0">
            <div className="flex flex-col gap-0 divide-y divide-border">
              {/* Name */}
              <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-6">
                <label htmlFor="org-name" className="min-w-[140px] pt-2 font-medium text-sm">
                  {t.nameLabel}
                </label>
                <div className="flex-1">
                  <Input
                    {...form.register("name")}
                    id="org-name"
                    placeholder={t.namePlaceholder}
                    autoComplete="organization"
                    aria-invalid={!!form.formState.errors.name}
                  />
                  <p className="mt-1.5 text-muted-foreground text-xs">{t.nameHelper}</p>
                  {form.formState.errors.name && (
                    <p className="mt-1 text-destructive text-xs">{form.formState.errors.name.message}</p>
                  )}
                </div>
              </div>

              {/* Type */}
              <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-6">
                <label htmlFor="org-type" className="min-w-[140px] pt-2 font-medium text-sm">
                  {t.typeLabel}
                </label>
                <div className="flex-1">
                  <Controller
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <select
                        id="org-type"
                        value={field.value}
                        onChange={field.onChange}
                        className="h-9 w-full min-w-0 appearance-none rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:hover:bg-input/50"
                      >
                        <option value="personal">{t.types.personal}</option>
                        <option value="educational">{t.types.educational}</option>
                        <option value="startup">{t.types.startup}</option>
                        <option value="agency">{t.types.agency}</option>
                        <option value="company">{t.types.company}</option>
                        <option value="na">{t.types.na}</option>
                      </select>
                    )}
                  />
                  <p className="mt-1.5 text-muted-foreground text-xs">{t.typeHelper}</p>
                  {form.formState.errors.type && (
                    <p className="mt-1 text-destructive text-xs">{form.formState.errors.type.message}</p>
                  )}
                </div>
              </div>

              {/* Plan */}
              <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-6">
                <label htmlFor="org-plan" className="min-w-[140px] pt-2 font-medium text-sm">
                  {t.planLabel}
                </label>
                <div className="flex-1">
                  <Controller
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                      <select
                        id="org-plan"
                        value={field.value}
                        onChange={field.onChange}
                        className="h-9 w-full min-w-0 appearance-none rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:hover:bg-input/50"
                      >
                        <option value="free">{t.plans.free}</option>
                        <option value="pro">{t.plans.pro}</option>
                        <option value="team">{t.plans.team}</option>
                      </select>
                    )}
                  />
                  <p className="mt-1.5 text-muted-foreground text-xs">
                    {t.planHelper}{" "}
                    <span className="text-foreground underline underline-offset-2 hover:no-underline">
                      {t.learnMore}
                    </span>
                  </p>
                  {form.formState.errors.plan && (
                    <p className="mt-1 text-destructive text-xs">{form.formState.errors.plan.message}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <Separator />

          <CardFooter className="flex items-center justify-between px-4 py-4 sm:px-6">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Rocket className="mr-2 size-4" aria-hidden="true" />
              )}
              {t.createButton}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
