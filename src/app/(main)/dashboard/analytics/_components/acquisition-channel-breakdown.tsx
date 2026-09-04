import { Ellipsis } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const channels = [
  {
    bounce: "28%",
    convRate: "3.0%",
    channelKey: "sourceOrganicSearch",
    conversions: "2.68k",
    time: "4m 12s",
    visitors: "89.4k",
  },
  {
    bounce: "35%",
    convRate: "3.5%",
    channelKey: "sourceDirect",
    conversions: "1.93k",
    time: "3m 48s",
    visitors: "55.2k",
  },
  {
    bounce: "52%",
    convRate: "2.0%",
    channelKey: "sourceSocial",
    conversions: "760",
    time: "1m 56s",
    visitors: "38.1k",
  },
  {
    bounce: "31%",
    convRate: "4.0%",
    channelKey: "sourceReferral",
    conversions: "1.22k",
    time: "4m 36s",
    visitors: "30.4k",
  },
  {
    bounce: "42%",
    convRate: "5.0%",
    channelKey: "sourcePaid",
    conversions: "1.14k",
    time: "2m 24s",
    visitors: "22.7k",
  },
  {
    bounce: "22%",
    convRate: "5.0%",
    channelKey: "channelEmail",
    conversions: "910",
    time: "5m 06s",
    visitors: "18.2k",
  },
  {
    bounce: "38%",
    convRate: "5.0%",
    channelKey: "channelAffiliates",
    conversions: "420",
    time: "3m 18s",
    visitors: "8.4k",
  },
];

export async function AcquisitionChannelBreakdown() {
  const t = await getTranslations("analytics");

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("acqChannelBreakdown")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <Table className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4">
          <TableHeader className="[&_tr]:border-border/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8" />
              <TableHead className="h-8 text-right font-normal">{t("acqVisitors")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("acqConversions")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("acqConvRate")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("acqBounce")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("acqAvgTime")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:border-border/50">
            {channels.map((ch) => (
              <TableRow className="hover:bg-transparent" key={ch.channelKey}>
                <TableCell className="py-4 font-medium">{t(ch.channelKey)}</TableCell>
                <TableCell className="text-right tabular-nums">{ch.visitors}</TableCell>
                <TableCell className="text-right tabular-nums">{ch.conversions}</TableCell>
                <TableCell className="text-right tabular-nums">{ch.convRate}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{ch.bounce}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{ch.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
