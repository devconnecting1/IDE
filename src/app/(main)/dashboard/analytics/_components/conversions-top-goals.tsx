import { Ellipsis } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const goals = [
  { completions: "2_840", goalKey: "goalSignup", goalValue: "Free", rate: "13.3%", revenue: "—" },
  { completions: "1_620", goalKey: "goalFreeTrial", goalValue: "$0 (trial)", rate: "7.6%", revenue: "—" },
  { completions: "1_240", goalKey: "goalUpgrade", goalValue: "$29–$99", rate: "5.8%", revenue: "$24.8k" },
  { completions: "1_860", goalKey: "goalPurchase", goalValue: "$19–$49", rate: "8.7%", revenue: "$18.6k" },
  { completions: "860", goalKey: "goalEnterprise", goalValue: "$500+", rate: "4.0%", revenue: "$5.2k" },
];

export async function ConversionsTopGoals() {
  const t = await getTranslations("analytics");

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("convTopGoals")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <Table className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4">
          <TableHeader className="[&_tr]:border-border/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8" />
              <TableHead className="h-8 text-right font-normal">{t("convGoalValue")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("convCompletions")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("convRate")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("convRevenue")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:border-border/50">
            {goals.map((g) => (
              <TableRow className="hover:bg-transparent" key={g.goalKey}>
                <TableCell className="py-4 font-medium">{t(g.goalKey)}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{g.goalValue}</TableCell>
                <TableCell className="text-right tabular-nums">{g.completions}</TableCell>
                <TableCell className="text-right tabular-nums">{g.rate}</TableCell>
                <TableCell className="text-right tabular-nums">{g.revenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
