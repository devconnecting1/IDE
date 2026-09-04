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
          <h1 className="font-medium text-sm leading-none">{t("chat.chatPreview")}</h1>
          <p className="text-muted-foreground text-sm">{t("chat.chatPreviewDescription")}</p>
        </div>
        <Button asChild variant="ghost" size="icon-sm">
          <Link href="/chat" target="_blank" rel="noreferrer" aria-label={t("chat.openChatNewTab")}>
            <ExternalLink />
          </Link>
        </Button>
      </div>

      <iframe
        key={await getLocale()}
        src="/chat"
        title={t("chat.chatPreview")}
        className="min-h-0 flex-1 rounded-lg border bg-background"
      />
    </div>
  );
}
