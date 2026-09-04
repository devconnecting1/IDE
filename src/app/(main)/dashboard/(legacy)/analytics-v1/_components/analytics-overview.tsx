"use client";

import * as React from "react";

import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns";
import { enUS, type Locale, ptBR } from "date-fns/locale";
import { Check, ChevronsUpDown, Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { DateRange } from "react-day-picker";
import { Area, ComposedChart, XAxis, YAxis } from "recharts";

import { DateRangePicker } from "@/components/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, formatCurrency } from "@/lib/utils";

type RiskView = "risk-view" | "momentum" | "quality";
type FilterToggleKey = "enterpriseOnly" | "stalledOnly" | "overdueOnly" | "includeRenewals";

const FILTER_OPTIONS: Array<{ key: FilterToggleKey; labelKey: string; summaryKey: string }> = [
  { key: "enterpriseOnly", labelKey: "filtersEnterpriseOnly", summaryKey: "filtersEnterprise" },
  { key: "stalledOnly", labelKey: "filtersStalledOnly", summaryKey: "filtersStalled" },
  { key: "overdueOnly", labelKey: "filtersOverdueOnly", summaryKey: "filtersOverdue" },
  { key: "includeRenewals", labelKey: "filtersIncludeRenewals", summaryKey: "filtersRenewals" },
];

const dateFnsLocales: Record<string, Locale> = { "pt-BR": ptBR, en: enUS };

const riskViews: Array<{
  value: RiskView;
  labelKey: string;
  descriptionKey: string;
}> = [
  {
    value: "risk-view",
    labelKey: "viewRisk",
    descriptionKey: "viewRiskDescription",
  },
  {
    value: "momentum",
    labelKey: "viewMomentum",
    descriptionKey: "viewMomentumDescription",
  },
  {
    value: "quality",
    labelKey: "viewQuality",
    descriptionKey: "viewQualityDescription",
  },
];

const RISK_SUMMARY_METRICS = [
  {
    key: "stalled",
    labelKey: "metricStalledDeals",
    value: "8",
    comparatorKey: "vsPreviousPeriod",
  },
  {
    key: "risk",
    labelKey: "metricRevenueAtRisk",
    amount: 1_151_000,
    comparatorKey: "vsPreviousPeriod",
  },
  {
    key: "win-rate",
    labelKey: "metricWinRateTrend",
    value: "+8.3pp",
    comparatorKey: "vsPreviousPeriod",
  },
  {
    key: "cycle",
    labelKey: "metricSalesCycleDrift",
    days: "2.3",
    comparatorKey: "vsPreviousPeriod",
  },
] as const;

export function AnalyticsOverview() {
  const locale = useLocale();
  const t = useTranslations("analyticsV1");
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>(() => {
    const to = startOfDay(new Date());
    return { from: subDays(to, 29), to };
  });
  const [selectedFilters, setSelectedFilters] = React.useState<FilterToggleKey[]>(["includeRenewals"]);
  const [revenueSeries, setRevenueSeries] = React.useState(() =>
    buildRevenueChartData(dateRange.from, dateRange.to, locale),
  );

  const handleFilterToggle = (key: FilterToggleKey, checked: boolean) => {
    setSelectedFilters((prev) => {
      if (checked) {
        return prev.includes(key) ? prev : [...prev, key];
      }
      return prev.filter((item) => item !== key);
    });
  };

  const handleDateRangeChange = (value: DateRange | undefined) => {
    if (!value?.from || !value?.to) {
      return;
    }
    const nextDateRange = { from: value.from, to: value.to };
    setDateRange(nextDateRange);
    setRevenueSeries(buildRevenueChartData(nextDateRange.from, nextDateRange.to, locale));
  };
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <RiskViewSelect />
          <FiltersPopover selectedFilters={selectedFilters} onToggle={handleFilterToggle} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
          <Button variant="secondary">
            <Download />
            {t("exportButton")}
          </Button>
        </div>
      </div>

      <SummaryRow revenueSeries={revenueSeries} />
    </div>
  );
}

function buildRevenueChartData(from: Date, to: Date, locale: string) {
  const days = eachDayOfInterval({ start: from, end: to });
  const minRevenue = 22_000;
  const maxRevenue = 32_000;
  let currentRevenue = 27_500;
  const dateFnsLocale = dateFnsLocales[locale] ?? enUS;

  return days.map((day) => {
    const nextRevenue = currentRevenue + Math.round((Math.random() - 0.45) * 4_000);
    currentRevenue = Math.max(minRevenue, Math.min(maxRevenue, nextRevenue));

    return {
      day: format(day, "MMM d", { locale: dateFnsLocale }),
      revenue: currentRevenue,
    };
  });
}

function formatRiskMetricValue(
  item: (typeof RISK_SUMMARY_METRICS)[number],
  locale: string,
  t: ReturnType<typeof useTranslations<"analyticsV1">>,
) {
  if ("amount" in item) {
    return formatCurrency(item.amount, { noDecimals: true }, locale);
  }
  if ("days" in item) {
    return t("daysToAction", { value: item.days });
  }
  return item.value;
}

function SummaryRow({ revenueSeries }: { revenueSeries: Array<{ day: string; revenue: number }> }) {
  const locale = useLocale();
  const t = useTranslations("analyticsV1");
  const revenueChartConfig = {
    revenue: {
      label: t("chartRevenue"),
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const revenueValues = revenueSeries.map((point) => point.revenue);
  const minRevenue = Math.min(...revenueValues);
  const maxRevenue = Math.max(...revenueValues);
  const midpoint = (minRevenue + maxRevenue) / 2;
  const halfRange = Math.max((maxRevenue - minRevenue) * 1.6, 4_500);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="min-w-0 space-y-2">
        <div>
          <div className="font-medium text-muted-foreground text-sm">{t("sectionRevenue")}</div>
          <div className="font-semibold text-3xl tabular-nums tracking-tight sm:text-4xl">
            {formatCurrency(1_248_000, { noDecimals: true }, locale)}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">+9.4%</Badge>
          <Badge variant="secondary">+{formatCurrency(107_000, { noDecimals: true }, locale)}</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
          <span>{t("previousValue", { value: formatCurrency(1_141_000, { noDecimals: true }, locale) })}</span>
          <Badge variant="outline" className="font-medium text-xs">
            {t("riskLadderScore", { score: 30 })}
          </Badge>
        </div>
        <div>
          <ChartContainer config={revenueChartConfig} className="h-10 w-full rounded-md border">
            <ComposedChart data={revenueSeries} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <XAxis dataKey="day" hide />
              <YAxis hide domain={[midpoint - halfRange, midpoint + halfRange]} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                dataKey="revenue"
                type="natural"
                fill="var(--color-revenue)"
                fillOpacity={0.14}
                stroke="var(--color-revenue)"
              />
            </ComposedChart>
          </ChartContainer>
          <span className="text-muted-foreground text-xs">{t("selectedRange")}</span>
        </div>
      </div>

      <Card className="min-w-0 py-4 shadow-xs xl:col-span-2">
        <CardHeader className="px-4">
          <CardTitle>{t("riskSummary")}</CardTitle>
          <CardDescription>{t("riskSummaryDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0 xl:divide-x xl:[&>div:first-child]:pl-0 xl:[&>div:last-child]:pr-0 xl:[&>div]:px-5">
          {RISK_SUMMARY_METRICS.map((item) => (
            <div key={item.key} className="min-w-0 space-y-1">
              <div className="text-muted-foreground text-sm">{t(item.labelKey)}</div>
              <div className="font-semibold text-2xl tabular-nums leading-tight">
                {formatRiskMetricValue(item, locale, t)}
              </div>
              <div className="text-muted-foreground text-xs">{t(item.comparatorKey)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function RiskViewSelect() {
  const t = useTranslations("analyticsV1");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("risk-view");
  const listId = React.useId();
  const selectedView = riskViews.find((view) => view.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-controls={listId}
          aria-expanded={open}
          className="w-54 justify-between"
        >
          <div className="flex items-center gap-2">
            <div
              className="size-2 rounded-full bg-primary"
              style={{
                boxShadow: "0 0 8px color-mix(in oklab, var(--primary) 50%, transparent)",
              }}
            />
            {selectedView ? t(selectedView.labelKey) : null}
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-54 p-0">
        <Command>
          <CommandList id={listId}>
            <CommandGroup>
              {riskViews.map((view) => (
                <CommandItem
                  key={view.value}
                  value={view.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span>{t(view.labelKey)}</span>
                    <span className="text-muted-foreground text-xs">{t(view.descriptionKey)}</span>
                  </div>
                  <Check className={cn("ml-auto", value === view.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function FiltersPopover({
  selectedFilters,
  onToggle,
}: {
  selectedFilters: FilterToggleKey[];
  onToggle: (key: FilterToggleKey, checked: boolean) => void;
}) {
  const t = useTranslations("analyticsV1");
  const [open, setOpen] = React.useState(false);
  const activeCount = selectedFilters.length;

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" aria-expanded={open}>
            {t("filters")}
            <Badge className="tabular-nums" variant="secondary">
              {activeCount}
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{t("filters")}</h3>
              <Badge variant="outline" className="font-medium text-xs tabular-nums">
                {t("riskLadderScore", { score: 30 })}
              </Badge>
            </div>
            <div className="space-y-3">
              {FILTER_OPTIONS.map((item) => (
                <FilterToggle
                  key={item.key}
                  id={item.key}
                  label={t(item.labelKey)}
                  checked={selectedFilters.includes(item.key)}
                  onCheckedChange={(checked) => onToggle(item.key, checked)}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <span className="text-muted-foreground text-sm">
        {t("showingSummary", { summary: summarizeFilterState(selectedFilters, t) })}
      </span>
    </div>
  );
}

function FilterToggle({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex cursor-pointer items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={(value) => onCheckedChange(Boolean(value))} />
      <Label htmlFor={id} className="cursor-pointer font-normal text-sm">
        {label}
      </Label>
    </div>
  );
}

function summarizeFilterState(
  selectedFilters: FilterToggleKey[],
  t: ReturnType<typeof useTranslations<"analyticsV1">>,
) {
  if (selectedFilters.length === 0) {
    return t("filtersAllDeals");
  }
  return FILTER_OPTIONS.filter((item) => selectedFilters.includes(item.key))
    .map((item) => t(item.summaryKey))
    .join(" · ");
}
