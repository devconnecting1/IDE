import { Ellipsis } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const content = [
  { avgTime: "5m 06s", exits: "12.4%", path: "/blog/analytics-guide", scrollDepth: "78%", views: "19.3k" },
  { avgTime: "4m 44s", exits: "8.2%", path: "/docs/getting-started", scrollDepth: "82%", views: "28.6k" },
  { avgTime: "3m 12s", exits: "18.6%", path: "/dashboard", scrollDepth: "64%", views: "64.2k" },
  { avgTime: "2m 08s", exits: "22.1%", path: "/pricing", scrollDepth: "71%", views: "41.8k" },
  { avgTime: "1m 18s", exits: "34.8%", path: "/contact", scrollDepth: "56%", views: "8.9k" },
  { avgTime: "4m 22s", exits: "10.6%", path: "/docs/api-reference", scrollDepth: "85%", views: "14.2k" },
  { avgTime: "3m 48s", exits: "15.4%", path: "/blog/product-update", scrollDepth: "74%", views: "11.8k" },
];

export async function EngagementContent() {
  const t = await getTranslations("analytics");

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("engContentEngagement")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <Table className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4">
          <TableHeader className="[&_tr]:border-border/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8" />
              <TableHead className="h-8 text-right font-normal">{t("engViews")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("engAvgTime")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("engScrollDepth")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("engExits")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:border-border/50">
            {content.map((item) => (
              <TableRow className="hover:bg-transparent" key={item.path}>
                <TableCell className="max-w-0 truncate py-4 font-medium">{item.path}</TableCell>
                <TableCell className="text-right tabular-nums">{item.views}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{item.avgTime}</TableCell>
                <TableCell className="text-right tabular-nums">{item.scrollDepth}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{item.exits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
