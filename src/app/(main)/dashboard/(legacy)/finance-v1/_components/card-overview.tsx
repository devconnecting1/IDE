"use client";

import { addDays, format } from "date-fns";
import { enUS, type Locale, ptBR } from "date-fns/locale";
import { Home, Receipt, Sparkles, Zap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { siApple, siMastercard } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

const now = new Date();

const dateFnsLocales: Record<string, Locale> = { "pt-BR": ptBR, en: enUS };

const upcomingPayments = [
  {
    id: 1,
    icon: Home,
    titleKey: "paymentRent",
    amount: 1200,
    dayOffset: 2,
  },
  {
    id: 2,
    icon: Zap,
    titleKey: "paymentElectricity",
    amount: 75,
    dayOffset: 2,
  },
  {
    id: 3,
    icon: Sparkles,
    titleKey: "paymentChatGpt",
    amount: 20,
    dayOffset: 7,
  },
  {
    id: 4,
    icon: Receipt,
    titleKey: "paymentCreditCard",
    amount: 420,
    dayOffset: 9,
  },
];

export function CardOverview() {
  const locale = useLocale();
  const t = useTranslations("financeV1");
  const dateFnsLocale = dateFnsLocales[locale] ?? enUS;

  return (
    <Card className="shadow-xs">
      <CardHeader className="items-center">
        <CardTitle>{t("myCard")}</CardTitle>
        <CardDescription>{t("cardOverviewDescription", { total: 4 })}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full place-items-center">
            <div className="relative flex aspect-8/5 w-full max-w-100 flex-col justify-between overflow-hidden rounded-xl bg-primary p-6">
              <div className="flex items-start justify-between">
                <SimpleIcon icon={siApple} className="size-5 fill-primary-foreground sm:size-8" />
              </div>

              <div className="space-y-1">
                <p className="font-mono text-primary-foreground/90 text-sm tracking-[0.15em] sm:text-lg">
                  •••• •••• •••• 2301
                </p>
              </div>

              <div className="flex items-end justify-between">
                <div className="space-y-2">
                  <p className="font-medium font-mono text-primary-foreground text-sm uppercase tracking-wide">
                    Matheus Moraes
                  </p>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[10px] text-primary-foreground/80 uppercase tracking-wider">
                        {t("validThru")}
                      </p>
                      <p className="font-mono text-primary-foreground/80 text-xs">06/30</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-primary-foreground/80 uppercase tracking-wider">{t("cvv")}</p>
                      <p className="font-mono text-primary-foreground/80 text-xs">•••</p>
                    </div>
                  </div>
                </div>
                <SimpleIcon icon={siMastercard} className="size-7 fill-primary-foreground/80 sm:size-10" />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("cardType")}</span>
              <span className="font-medium tabular-nums">{t("cardVirtual")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("billingCycle")}</span>
              <span className="font-medium tabular-nums">{t("cardBillingOrdinal")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("cardLimit")}</span>
              <span className="font-medium tabular-nums">{formatCurrency(62_000, {}, locale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("availableBalance")}</span>
              <span className="font-medium tabular-nums">{formatCurrency(13_100.06, {}, locale)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Button className="w-full" size="sm">
              {t("manageCard")}
            </Button>

            <Button className="w-full" variant="outline" size="sm">
              {t("addCard")}
            </Button>
          </div>
          <Separator />

          <div className="space-y-4">
            <h6 className="text-muted-foreground text-sm uppercase">{t("upcomingPayments")}</h6>

            <div className="space-y-4">
              {upcomingPayments.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <transaction.icon className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex w-full items-end justify-between">
                    <div>
                      <p className="font-medium text-sm">{t(transaction.titleKey)}</p>
                      <p className="text-muted-foreground text-xs">
                        {t("dueOn", {
                          date: format(addDays(now, transaction.dayOffset), "do MMMM yyyy", {
                            locale: dateFnsLocale,
                          }),
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-destructive text-sm tabular-nums leading-none">
                        {formatCurrency(transaction.amount, { noDecimals: true }, locale)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full" size="sm" variant="outline">
              {t("viewAllPayments")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
