import { BellOff } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function FocusCard() {
  const t = await getTranslations("productivity");

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>{t("sumFocus")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <div className="text-3xl tracking-tight">90:00</div>
            <Button className="min-w-24">{t("start")}</Button>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <BellOff className="size-3" />
            <span>{t("noNotificationsFocus")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
