import { Ellipsis } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const countries = [
  { code: "US", countryKey: "countryUs", visitors: 42_800, percentage: 21.4 },
  { code: "BR", countryKey: "countryBr", visitors: 38_200, percentage: 19.1 },
  { code: "GB", countryKey: "countryGb", visitors: 18_400, percentage: 9.2 },
  { code: "DE", countryKey: "countryDe", visitors: 14_600, percentage: 7.3 },
  { code: "IN", countryKey: "countryIn", visitors: 12_100, percentage: 6.1 },
  { code: "FR", countryKey: "countryFr", visitors: 9_800, percentage: 4.9 },
  { code: "JP", countryKey: "countryJp", visitors: 8_400, percentage: 4.2 },
  { code: "CA", countryKey: "countryCa", visitors: 7_200, percentage: 3.6 },
  { code: "AU", countryKey: "countryAu", visitors: 5_600, percentage: 2.8 },
];

export async function AudienceCountries() {
  const t = await getTranslations("analytics");

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("audienceCountries")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <Table className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4">
          <TableHeader className="[&_tr]:border-border/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8" />
              <TableHead className="h-8 font-normal" />
              <TableHead className="h-8 w-24 text-right font-normal">{t("views")}</TableHead>
              <TableHead className="h-8 w-32 text-right font-normal">{t("visitorsLabel")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:border-border/50">
            {countries.map((country) => (
              <TableRow className="hover:bg-transparent" key={country.code}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`flag:${country.code} shrink-0 rounded-xs text-lg ring-1 ring-foreground/10`}
                    />
                    <span className="min-w-0 truncate font-medium">{t(country.countryKey)}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <Progress className="h-1.5 w-24" value={country.percentage} />
                    <span className="text-muted-foreground text-sm tabular-nums">{country.percentage}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">{country.visitors.toLocaleString()}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">
                  {country.visitors.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
