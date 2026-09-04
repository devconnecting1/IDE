"use client";

import { format, isToday, isYesterday, subDays } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

import { SimpleIcon } from "@/components/simple-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { cn, formatCurrency } from "@/lib/utils";

import { accounts } from "./accounts";

type ActivityEntry = {
  accountId: string;
  description: string;
  dateOffset: number;
  hours: number;
  minutes: number;
  amount: number;
};

const activity: ActivityEntry[] = [
  { accountId: "revolut-premium", description: "Tesco Express", dateOffset: 0, hours: 14, minutes: 32, amount: -42.15 },
  { accountId: "revolut-premium", description: "Apple Pay top-up", dateOffset: 1, hours: 9, minutes: 11, amount: 250 },
  {
    accountId: "hsbc-checking",
    description: "Standing order · Rent",
    dateOffset: 14,
    hours: 9,
    minutes: 0,
    amount: -1180,
  },
  { accountId: "binance-btc", description: "Spot buy · BTC", dateOffset: 15, hours: 22, minutes: 48, amount: -1500 },
  {
    accountId: "investment-brokerage",
    description: "Dividend · VWRL",
    dateOffset: 16,
    hours: 16,
    minutes: 0,
    amount: 86.4,
  },
];

export function RecentAccountActivity() {
  const t = useTranslations("finance");
  const locale = useLocale();
  const dateFnsLocale = locale === "pt-BR" ? ptBR : enUS;

  const now = new Date();

  const formatDate = (entry: ActivityEntry): string => {
    const date = subDays(now, entry.dateOffset);
    date.setHours(entry.hours, entry.minutes, 0, 0);

    if (isToday(date)) {
      return `${t("today")} · ${format(date, "HH:mm")}`;
    }
    if (isYesterday(date)) {
      return `${t("yesterday")} · ${format(date, "HH:mm")}`;
    }
    return format(date, "dd MMM · HH:mm", { locale: dateFnsLocale });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">{t("recentActivity")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-3">
          {activity.map((entry) => {
            const account = accounts.find((candidate) => candidate.id === entry.accountId);
            if (!account) return null;
            const positive = entry.amount >= 0;
            return (
              <Item key={`${entry.accountId}-${entry.description}`} variant="outline" size="xs">
                <ItemMedia>
                  <div aria-hidden="true" className="grid size-8 place-items-center rounded-md border bg-background">
                    <SimpleIcon icon={account.icon} aria-hidden="true" className="size-4" />
                  </div>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{entry.description}</ItemTitle>
                  <ItemDescription>
                    {account.name} · {formatDate(entry)}
                  </ItemDescription>
                </ItemContent>
                <span
                  className={cn(
                    "font-medium text-sm tabular-nums",
                    positive ? "text-green-600 dark:text-green-400" : "text-foreground",
                  )}
                >
                  {positive ? "+" : ""}
                  {formatCurrency(entry.amount)}
                </span>
              </Item>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
