import Link from "next/link";

import { ExternalLink } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

export default async function Page() {
  const t = await getTranslations();

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-medium text-sm leading-none">{t("mail.mailPreview")}</h1>
          <p className="text-muted-foreground text-sm">{t("mail.mailPreviewDescription")}</p>
        </div>
        <Button asChild variant="ghost" size="icon-sm">
          <Link href="/mail" target="_blank" rel="noreferrer" aria-label={t("mail.openMailNewTab")}>
            <ExternalLink />
          </Link>
        </Button>
      </div>

      <iframe
        key={await getLocale()}
        src="/mail"
        title={t("mail.mailPreview")}
        className="min-h-0 flex-1 rounded-lg border bg-background"
      />
    </div>
  );
}
