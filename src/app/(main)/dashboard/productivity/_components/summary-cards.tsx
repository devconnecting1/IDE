import { ArrowRight, Clock3, Focus, type LucideIcon, TrendingUp } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SummaryCard = {
  titleKey: string;
  value?: string;
  valueKey?: string;
  descriptionKey: string;
  icon: LucideIcon;
};

const summaryCards: SummaryCard[] = [
  { titleKey: "sumToday", value: "4", descriptionKey: "sumTasksScheduled", icon: Clock3 },
  { titleKey: "sumThisWeek", value: "68%", descriptionKey: "sumProgress", icon: TrendingUp },
  { titleKey: "sumFocus", valueKey: "sumDeepWork", descriptionKey: "sumHoursRemaining", icon: Focus },
];

export async function SummaryCards() {
  const t = await getTranslations("productivity");

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summaryCards.map((item) => (
        <Card key={item.titleKey} className="shadow-xs">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="grid size-7 place-items-center rounded-lg border bg-muted">
                  <item.icon className="size-4" />
                </div>
                {t(item.titleKey)}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-2xl leading-none tracking-tight">
                {item.valueKey ? t(item.valueKey) : item.value}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground tabular-nums leading-none">{t(item.descriptionKey)}</p>
                <ArrowRight className="size-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
