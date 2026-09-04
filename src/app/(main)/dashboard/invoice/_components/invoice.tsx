"use client";

import { useTranslations } from "next-intl";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { getDefaultInvoiceValues, type InvoiceFormValues } from "./data";
import { InvoiceForm } from "./invoice-form";
import { InvoicePreview } from "./invoice-preview";

export function Invoice() {
  const t = useTranslations("invoice");
  const form = useForm<InvoiceFormValues>({
    defaultValues: getDefaultInvoiceValues(t),
  });
  const invoice = useWatch({ control: form.control }) as InvoiceFormValues;

  return (
    <FormProvider {...form}>
      <form className="grid gap-5 xl:grid-cols-2" noValidate onSubmit={(event) => event.preventDefault()}>
        <InvoiceForm />
        <InvoicePreview invoice={invoice} />
      </form>
    </FormProvider>
  );
}
