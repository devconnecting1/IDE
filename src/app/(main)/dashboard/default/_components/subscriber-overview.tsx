import { Download } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import customersData from "./data.json";
import type { RecentCustomerRow } from "./recent-customers-table/schema";
import { RecentCustomersTable } from "./recent-customers-table/table";

const customers = customersData as RecentCustomerRow[];

export async function SubscriberOverview() {
  const t = await getTranslations("default");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">{t("customerCount", { count: 18426 })}</CardTitle>
        <CardDescription>{t("subscriberDescription")}</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <Download />
            {t("export")}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-0">
        <RecentCustomersTable data={customers} />
      </CardContent>
    </Card>
  );
}
