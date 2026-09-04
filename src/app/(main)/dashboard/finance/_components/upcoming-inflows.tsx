"use client";

import { format } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { ArrowDownLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { SimpleIcon } from "@/components/simple-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { formatCurrency } from "@/lib/utils";

import { accounts } from "./accounts";

type Inflow = {
  accountId: string;
  source: string;
  amount: number;
  expectedDate: Date;
};

const inflows: Inflow[] = [
  { accountId: "hsbc-checking", source: "Acme Corp · Salary", amount: 4560, expectedDate: new Date("2026-05-25") },
  {
    accountId: "revolut-premium",
    source: "Upwork · Project payout",
    amount: 1412,
    expectedDate: new Date("2026-05-28"),
  },
  {
    accountId: "investment-brokerage",
    source: "VWRL · Quarterly dividend",
    amount: 86.4,
    expectedDate: new Date("2026-06-12"),
  },
];

const total = inflows.reduce((sum, inflow) => sum + inflow.amount, 0);

export function UpcomingInflows() {
  const t = useTranslations("finance");
  const locale = useLocale();
  const dateFnsLocale = locale === "pt-BR" ? ptBR : enUS;
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">{t("upcomingInflows")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="flex items-baseline text-3xl tabular-nums leading-none tracking-tight">
            <span className="font-normal">{formatCurrency(total, { noDecimals: true })}</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-none">
            {t("upcomingInflowsDeposits", { count: inflows.length })}
          </p>
        </div>
        <Badge className="w-max gap-1.5 rounded-md border border-border bg-muted/70 px-2 py-1.5 text-muted-foreground text-sm">
          <ArrowDownLeft aria-hidden="true" className="size-4 text-green-600 dark:text-green-400" />
          {t("upcomingInflowsNetPositive")}
        </Badge>

        <div className="flex flex-col gap-3">
          {inflows.map((inflow) => {
            const account = accounts.find((candidate) => candidate.id === inflow.accountId);
            if (!account) return null;
            return (
              <Item key={`${inflow.accountId}-${inflow.source}`} variant="outline" size="xs">
                <ItemMedia>
                  <div aria-hidden="true" className="grid size-9 place-items-center rounded-md border bg-background">
                    <SimpleIcon icon={account.icon} aria-hidden="true" />
                  </div>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{inflow.source}</ItemTitle>
                  <ItemDescription>
                    {t("upcomingInflowsExpectedDate", {
                      date: format(inflow.expectedDate, locale === "pt-BR" ? "dd 'de' MMMM" : "MMM d", {
                        locale: dateFnsLocale,
                      }),
                    })}{" "}
                    · {account.name}
                  </ItemDescription>
                </ItemContent>
                <span className="font-medium text-green-600 text-sm tabular-nums dark:text-green-400">
                  +{formatCurrency(inflow.amount, { noDecimals: true })}
                </span>
              </Item>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
