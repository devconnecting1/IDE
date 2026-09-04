import { Ellipsis } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const landingPages = [
  {
    bounce: "18%",
    conversions: "1.84k",
    convRate: "6.4%",
    path: "/pricing",
    time: "4m 32s",
    visitors: "28.6k",
  },
  {
    bounce: "24%",
    conversions: "1.26k",
    convRate: "2.0%",
    path: "/dashboard",
    time: "3m 12s",
    visitors: "64.2k",
  },
  {
    bounce: "31%",
    conversions: "940",
    convRate: "2.2%",
    path: "/docs/getting-started",
    time: "5m 18s",
    visitors: "41.8k",
  },
  {
    bounce: "15%",
    conversions: "720",
    convRate: "7.2%",
    path: "/signup",
    time: "2m 44s",
    visitors: "10.0k",
  },
  {
    bounce: "42%",
    conversions: "180",
    convRate: "2.0%",
    path: "/blog/analytics-guide",
    time: "1m 18s",
    visitors: "8.9k",
  },
];

export async function AcquisitionLandingPages() {
  const t = await getTranslations("analytics");

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("acqLandingPages")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <Table className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4">
          <TableHeader className="[&_tr]:border-border/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8" />
              <TableHead className="h-8 text-right font-normal">{t("views")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("acqConversions")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("acqConvRate")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("bounce")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("avgTime")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:border-border/50">
            {landingPages.map((page) => (
              <TableRow className="hover:bg-transparent" key={page.path}>
                <TableCell className="max-w-0 truncate py-4 font-medium">{page.path}</TableCell>
                <TableCell className="text-right tabular-nums">{page.visitors}</TableCell>
                <TableCell className="text-right tabular-nums">{page.conversions}</TableCell>
                <TableCell className="text-right tabular-nums">{page.convRate}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{page.bounce}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{page.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
