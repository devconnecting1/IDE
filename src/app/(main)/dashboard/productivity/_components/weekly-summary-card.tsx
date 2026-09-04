import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export async function WeeklySummaryCard() {
  const t = await getTranslations("productivity");

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>{t("sumThisWeek")}</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            {t("viewAll")}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground">{t("encouragement")}</p>
        <div className="flex flex-col gap-2">
          <div className="font-medium">{t("goalsCompleted", { completed: 4, total: 6 })}</div>
          <Progress value={66} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
