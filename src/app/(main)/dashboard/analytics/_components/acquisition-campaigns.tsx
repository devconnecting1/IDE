import { Ellipsis } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const campaigns = [
  {
    bounce: "22%",
    conversions: "680",
    convRate: "4.5%",
    campaignKey: "campaignSpringLaunch",
    revenue: "$12.4k",
    roi: "3.2x",
    sessions: "16.8k",
    spend: "$3.9k",
  },
  {
    bounce: "18%",
    conversions: "420",
    convRate: "3.5%",
    campaignKey: "campaignNewsletter",
    revenue: "$8.6k",
    roi: "4.8x",
    sessions: "12.0k",
    spend: "$1.8k",
  },
  {
    bounce: "35%",
    conversions: "240",
    convRate: "3.1%",
    campaignKey: "campaignRetargeting",
    revenue: "$5.2k",
    roi: "2.1x",
    sessions: "7.7k",
    spend: "$2.5k",
  },
  {
    bounce: "28%",
    conversions: "180",
    convRate: "3.1%",
    campaignKey: "campaignBrandSearch",
    revenue: "$4.8k",
    roi: "5.2x",
    sessions: "5.9k",
    spend: "$920",
  },
  {
    bounce: "40%",
    conversions: "120",
    convRate: "2.8%",
    campaignKey: "campaignPartners",
    revenue: "$3.1k",
    roi: "1.8x",
    sessions: "4.3k",
    spend: "$1.7k",
  },
];

export async function AcquisitionCampaigns() {
  const t = await getTranslations("analytics");

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("acqCampaigns")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <Table className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4">
          <TableHeader className="[&_tr]:border-border/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8" />
              <TableHead className="h-8 text-right font-normal">{t("acqSessions")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("acqConversions")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("acqConvRate")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("bounce")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("acqRevenue")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("acqSpend")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("acqRoi")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:border-border/50">
            {campaigns.map((c) => (
              <TableRow className="hover:bg-transparent" key={c.campaignKey}>
                <TableCell className="py-4 font-medium">{t(c.campaignKey)}</TableCell>
                <TableCell className="text-right tabular-nums">{c.sessions}</TableCell>
                <TableCell className="text-right tabular-nums">{c.conversions}</TableCell>
                <TableCell className="text-right tabular-nums">{c.convRate}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{c.bounce}</TableCell>
                <TableCell className="text-right tabular-nums">{c.revenue}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{c.spend}</TableCell>
                <TableCell className="text-right tabular-nums">{c.roi}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
