import { Ellipsis } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const channels = [
  {
    channelKey: "sourceOrganicSearch",
    convRate: "6.2%",
    conversions: "5_540",
    revenue: "$18.4k",
    valuePerSession: "$0.21",
  },
  {
    channelKey: "sourceDirect",
    convRate: "7.8%",
    conversions: "4_310",
    revenue: "$14.2k",
    valuePerSession: "$0.26",
  },
  {
    channelKey: "channelEmail",
    convRate: "12.4%",
    conversions: "2_260",
    revenue: "$8.6k",
    valuePerSession: "$0.47",
  },
  {
    channelKey: "sourcePaid",
    convRate: "9.6%",
    conversions: "2_180",
    revenue: "$6.2k",
    valuePerSession: "$0.27",
  },
  {
    channelKey: "sourceReferral",
    convRate: "5.8%",
    conversions: "1_760",
    revenue: "$4.8k",
    valuePerSession: "$0.16",
  },
  {
    channelKey: "channelAffiliates",
    convRate: "8.2%",
    conversions: "690",
    revenue: "$2.4k",
    valuePerSession: "$0.29",
  },
  {
    channelKey: "sourceSocial",
    convRate: "3.4%",
    conversions: "1_300",
    revenue: "$1.8k",
    valuePerSession: "$0.05",
  },
];

export async function ConversionsByChannel() {
  const t = await getTranslations("analytics");

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("convByChannel")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <Table className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4">
          <TableHeader className="[&_tr]:border-border/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8" />
              <TableHead className="h-8 text-right font-normal">{t("convConversions")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("convConvRate")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("convRevenueLabel")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("convValuePerSession")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:border-border/50">
            {channels.map((ch) => (
              <TableRow className="hover:bg-transparent" key={ch.channelKey}>
                <TableCell className="py-4 font-medium">{t(ch.channelKey)}</TableCell>
                <TableCell className="text-right tabular-nums">{ch.conversions}</TableCell>
                <TableCell className="text-right tabular-nums">{ch.convRate}</TableCell>
                <TableCell className="text-right tabular-nums">{ch.revenue}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{ch.valuePerSession}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
