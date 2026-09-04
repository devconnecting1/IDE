import { Ellipsis } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const events = [
  { avgTime: "0.2s", count: "482.1k", eventKey: "eventPageView", uniqueUsers: "213.1k" },
  { avgTime: "0.1s", count: "324.6k", eventKey: "eventClick", uniqueUsers: "189.4k" },
  { avgTime: "1.8s", count: "198.2k", eventKey: "eventScroll", uniqueUsers: "162.8k" },
  { avgTime: "3.2s", count: "86.4k", eventKey: "eventFormSubmit", uniqueUsers: "74.2k" },
  { avgTime: "0.4s", count: "62.8k", eventKey: "eventSearch", uniqueUsers: "48.6k" },
  { avgTime: "2.1s", count: "48.2k", eventKey: "eventDownload", uniqueUsers: "41.8k" },
  { avgTime: "12.4s", count: "38.6k", eventKey: "eventVideoPlay", uniqueUsers: "32.4k" },
];

export async function EngagementTopEvents() {
  const t = await getTranslations("analytics");

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("engTopEvents")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <Table className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4">
          <TableHeader className="[&_tr]:border-border/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8" />
              <TableHead className="h-8 text-right font-normal">{t("engEvents")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("engUniqueUsers")}</TableHead>
              <TableHead className="h-8 text-right font-normal">{t("engAvgTime")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:border-border/50">
            {events.map((event) => (
              <TableRow className="hover:bg-transparent" key={event.eventKey}>
                <TableCell className="py-4 font-medium">{t(event.eventKey)}</TableCell>
                <TableCell className="text-right tabular-nums">{event.count}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{event.uniqueUsers}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{event.avgTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
