import { format } from "date-fns";
import { enUS, type Locale, ptBR } from "date-fns/locale";
import { Network, Printer, Volume2 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { patients } from "./_components/data";
import { PatientMonitoring } from "./_components/patient-monitoring";

const dateFnsLocales: Record<string, Locale> = { "pt-BR": ptBR, en: enUS };

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations("patientMonitoring");
  const now = new Date();
  const tzFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone: "America/Sao_Paulo",
    year: "numeric",
  });
  const tzParts = Object.fromEntries(
    tzFormatter
      .formatToParts(now)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, Number(value)] as const),
  );
  const tzNow = new Date(tzParts.year, tzParts.month - 1, tzParts.day, tzParts.hour, tzParts.minute, tzParts.second);

  return (
    <div
      className="flex min-h-[calc(100svh-var(--dashboard-header-height))] min-w-0 flex-col"
      data-content-padding="false"
    >
      <div className="grid min-h-10 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-2 py-2 text-sm lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:py-0">
        <div className="truncate lg:overflow-visible">{t("title")}</div>
        <div className="whitespace-nowrap">{t("patientCount", { count: patients.length })}</div>
        <div className="col-span-2 flex items-center justify-between gap-5 text-muted-foreground lg:col-span-1 lg:justify-end">
          <span className="whitespace-nowrap tabular-nums">
            {format(tzNow, "dd MMM yyyy", { locale: dateFnsLocales[locale] ?? enUS })}&nbsp;&nbsp;
            {format(tzNow, "HH:mm:ss")}
          </span>
          <Tooltip>
            <TooltipTrigger aria-label={t("alarmAudio")} className="inline-flex" type="button">
              <Volume2 aria-hidden="true" className="size-4" />
            </TooltipTrigger>
            <TooltipContent>{t("alarmAudio")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger aria-label={t("networkConnected")} className="inline-flex" type="button">
              <Network aria-hidden="true" className="size-4" />
            </TooltipTrigger>
            <TooltipContent>{t("networkConnected")}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Separator />

      {/*
        data.ts holds the patients and PatientMonitoring renders the screen.
        use-patient-vital-series.ts repeats templates from waveform-data.ts,
        while use-realtime-tick.ts and realtime-utils.ts move the charts.
      */}
      <PatientMonitoring patients={patients} />

      <Separator />
      <footer className="flex flex-wrap gap-2 p-2 *:data-[slot=button]:h-11 *:data-[slot=button]:min-w-32 *:data-[slot=button]:flex-1 *:data-[slot=button]:rounded-none">
        <Button variant="outline">{t("mainScreen")}</Button>
        <Button variant="outline">{t("patientSetup")}</Button>
        <Button variant="outline">{t("alarmReview")}</Button>
        <Button variant="outline">{t("waveReview")}</Button>
        <Button variant="outline">{t("trends")}</Button>
        <Button variant="outline">
          <Printer data-icon="inline-start" />
          {t("print")}
        </Button>
        <Button variant="outline">
          <Volume2 data-icon="inline-start" />
          {t("silence")}
        </Button>
        <Badge className="h-11 min-w-44 flex-1 rounded-none text-muted-foreground" variant="outline">
          {t("deviceConnected", { bed: "C04" })}
        </Badge>
      </footer>
    </div>
  );
}
