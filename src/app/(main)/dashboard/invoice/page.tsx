import { Save, Send } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

import { Invoice } from "./_components/invoice";

export default async function Page() {
  const t = await getTranslations();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-medium text-3xl leading-none tracking-tight">{t("invoice.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("invoice.description")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline">
            <Save data-icon="inline-start" />
            {t("invoice.saveAsDraft")}
          </Button>
          <Button type="button">
            <Send data-icon="inline-start" />
            {t("invoice.sendInvoice")}
          </Button>
        </div>
      </div>

      <Invoice />
    </div>
  );
}
