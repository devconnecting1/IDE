"use client";

import * as React from "react";

import { type ColumnDef, type SortingState, useTable } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type DataTableFeatures, dataTableFeatures } from "@/lib/data-table-features";
import { cn, formatCurrency } from "@/lib/utils";

type LedgerPriority = "Escalate" | "Coach" | "Reforecast" | null;

type LedgerRow = {
  id: number;
  account: string;
  dealId: string;
  stage: string;
  stageLabelKey: string;
  blockerDays: number;
  owner: string;
  idleDays: number;
  closeVarianceDays: number;
  priority: LedgerPriority;
  nextActionKey: string;
  riskScore: number;
};

const LEDGER_ROWS: LedgerRow[] = [
  {
    id: 1,
    account: "Oscorp Labs",
    dealId: "OPP-489",
    stage: "Legal",
    stageLabelKey: "stageLegal",
    blockerDays: 35,
    owner: "Leila Zhang",
    idleDays: 36,
    closeVarianceDays: 35,
    priority: "Escalate",
    nextActionKey: "actionJoinCall",
    riskScore: 81,
  },
  {
    id: 2,
    account: "Hooli AI",
    dealId: "OPP-475",
    stage: "Qualification",
    stageLabelKey: "stageQualification",
    blockerDays: 28,
    owner: "Omar Ali",
    idleDays: 33,
    closeVarianceDays: 28,
    priority: "Coach",
    nextActionKey: "actionReviewStrategy",
    riskScore: 76,
  },
  {
    id: 3,
    account: "Globex Systems",
    dealId: "OPP-447",
    stage: "Qualification",
    stageLabelKey: "stageQualification",
    blockerDays: 37,
    owner: "Sofia Bautista",
    idleDays: 34,
    closeVarianceDays: 37,
    priority: "Coach",
    nextActionKey: "actionReviewStrategy",
    riskScore: 75,
  },
  {
    id: 4,
    account: "Umbrella Corp",
    dealId: "OPP-459",
    stage: "Legal",
    stageLabelKey: "stageLegal",
    blockerDays: 24,
    owner: "Leila Zhang",
    idleDays: 29,
    closeVarianceDays: 24,
    priority: "Coach",
    nextActionKey: "actionReviewStrategy",
    riskScore: 72,
  },
  {
    id: 5,
    account: "Acme Industries",
    dealId: "OPP-421",
    stage: "Negotiation",
    stageLabelKey: "stageNegotiation",
    blockerDays: 32,
    owner: "Leila Zhang",
    idleDays: 31,
    closeVarianceDays: 32,
    priority: "Coach",
    nextActionKey: "actionReviewStrategy",
    riskScore: 69,
  },
  {
    id: 6,
    account: "Wayne Devices",
    dealId: "OPP-471",
    stage: "Proposal",
    stageLabelKey: "stageProposal",
    blockerDays: 22,
    owner: "Sofia Bautista",
    idleDays: 32,
    closeVarianceDays: 22,
    priority: "Reforecast",
    nextActionKey: "actionAdjustForecast",
    riskScore: 56,
  },
  {
    id: 7,
    account: "Aperture Health",
    dealId: "OPP-497",
    stage: "Proposal",
    stageLabelKey: "stageProposal",
    blockerDays: 20,
    owner: "Omar Ali",
    idleDays: 30,
    closeVarianceDays: 20,
    priority: "Reforecast",
    nextActionKey: "actionAdjustForecast",
    riskScore: 50,
  },
  {
    id: 8,
    account: "Northwind Labs",
    dealId: "OPP-438",
    stage: "Proposal",
    stageLabelKey: "stageProposal",
    blockerDays: 14,
    owner: "Julian Singh",
    idleDays: 23,
    closeVarianceDays: 14,
    priority: null,
    nextActionKey: "actionNoIntervention",
    riskScore: 42,
  },
  {
    id: 9,
    account: "Stark Logistics",
    dealId: "OPP-463",
    stage: "Negotiation",
    stageLabelKey: "stageNegotiation",
    blockerDays: 10,
    owner: "Julian Singh",
    idleDays: 21,
    closeVarianceDays: 10,
    priority: null,
    nextActionKey: "actionNoIntervention",
    riskScore: 39,
  },
  {
    id: 10,
    account: "Soylent Foods",
    dealId: "OPP-482",
    stage: "Negotiation",
    stageLabelKey: "stageNegotiation",
    blockerDays: 5,
    owner: "Julian Singh",
    idleDays: 24,
    closeVarianceDays: 5,
    priority: null,
    nextActionKey: "actionNoIntervention",
    riskScore: 31,
  },
];

const priorityTone: Record<Exclude<LedgerPriority, null>, string> = {
  Escalate: "border-destructive/35 bg-destructive/10 text-destructive",
  Coach: "border-primary/35 bg-primary/10 text-primary",
  Reforecast: "border-amber-500/35 bg-amber-500/10 text-amber-700",
};

const priorityLabelKey: Record<Exclude<LedgerPriority, null>, string> = {
  Escalate: "priorityEscalate",
  Coach: "priorityCoach",
  Reforecast: "priorityReforecast",
};

function buildLedgerColumns(
  t: ReturnType<typeof useTranslations<"analyticsV1">>,
): ColumnDef<DataTableFeatures, LedgerRow>[] {
  return [
    {
      accessorKey: "account",
      header: t("columnAccount"),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">{row.original.account}</p>
          <p className="text-muted-foreground text-xs">
            {row.original.dealId} · {t(row.original.stageLabelKey)}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "blocker",
      header: t("columnBlocker"),
      cell: ({ row }) => (
        <div className="max-w-44 whitespace-normal text-xs">
          {t("blockerOverdue", { days: row.original.blockerDays })}
        </div>
      ),
    },
    {
      accessorKey: "owner",
      header: t("columnOwner"),
      cell: ({ row }) => <span className="text-xs">{row.original.owner}</span>,
    },
    {
      accessorKey: "idleDays",
      header: t("columnIdleDays"),
      cell: ({ row }) => (
        <span className="text-xs tabular-nums">{t("idleDaysSuffix", { days: row.original.idleDays })}</span>
      ),
    },
    {
      accessorKey: "closeVariance",
      header: t("columnCloseVariance"),
      cell: ({ row }) => (
        <span className="text-xs tabular-nums">
          {t("closeVarianceOverdue", { days: row.original.closeVarianceDays })}
        </span>
      ),
    },
    {
      accessorKey: "nextAction",
      header: t("columnNextAction"),
      cell: ({ row }) => (
        <div className="flex max-w-64 flex-col gap-1 whitespace-normal">
          {row.original.priority ? (
            <Badge variant="outline" className={cn("text-[10px] uppercase", priorityTone[row.original.priority])}>
              {t(priorityLabelKey[row.original.priority])}
            </Badge>
          ) : null}
          <p className="text-xs">{t(row.original.nextActionKey)}</p>
        </div>
      ),
    },
    {
      accessorKey: "riskScore",
      header: ({ column }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="-mr-2 h-8 px-2 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("columnRiskLadder")}
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Badge
            variant="outline"
            className={cn(
              "min-w-12 justify-center font-medium tabular-nums",
              row.original.riskScore >= 80 && "border-destructive/35 bg-destructive/10 text-destructive",
              row.original.riskScore >= 65 &&
                row.original.riskScore < 80 &&
                "border-amber-500/35 bg-amber-500/10 text-amber-700",
            )}
          >
            {row.original.riskScore}
          </Badge>
        </div>
      ),
    },
  ];
}

export function ActionsRiskLedger() {
  const locale = useLocale();
  const t = useTranslations("analyticsV1");
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "riskScore", desc: true }]);

  const table = useTable({
    features: dataTableFeatures,
    data: LEDGER_ROWS,
    columns: buildLedgerColumns(t),
    getRowId: (row) => String(row.id),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <Card className="min-w-0 shadow-xs">
      <CardHeader>
        <CardTitle>{t("titleRiskLedger")}</CardTitle>
        <CardDescription>{t("descriptionRiskLedger")}</CardDescription>
        <CardAction>
          <Badge variant="outline" className="font-medium tabular-nums">
            {t("accountsCount", { count: LEDGER_ROWS.length })}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 rounded-lg border bg-muted/20 p-3 text-sm sm:grid-cols-4 sm:divide-x sm:divide-border/60">
          <LedgerStat label={t("statCriticalAccounts")} value="1" detail={t("statCriticalAccountsDetail")} />
          <LedgerStat label={t("statEscalationsDue")} value="1" detail={t("statEscalationsDueDetail")} />
          <LedgerStat label={t("statMedianInactivity")} value="31d" detail={t("statMedianInactivityDetail")} />
          <LedgerStat
            label={t("statOverdueRevenue")}
            value={formatCurrency(1084000, { noDecimals: true }, locale)}
            detail={t("statOverdueRevenueDetail")}
          />
        </div>

        <div className="min-w-0 overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function LedgerStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="flex flex-col gap-1 px-0 sm:px-3 last:sm:pr-0 first:sm:pl-0">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-semibold text-base tabular-nums">{value}</p>
      <p className="text-muted-foreground text-xs">{detail}</p>
    </div>
  );
}
