"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Subscribe } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import type { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { cn, formatCurrency } from "@/lib/utils";

import type { OpportunityRow } from "./schema";

type Translator = ReturnType<typeof useTranslations>;

const stageLabelKeys: Record<string, string> = {
  "Proposal Sent": "stageProposalSent",
  Discovery: "stageDiscovery",
  Negotiation: "stageNegotiation",
  Qualified: "stageQualified",
};

const healthLabelKeys: Record<string, string> = {
  "On Track": "healthOnTrack",
  "Needs Review": "healthNeedsReview",
  "At Risk": "healthAtRisk",
  "On Hold": "healthOnHold",
};

const healthStripSlots = Array.from({ length: 18 }, (_, index) => ({
  id: `strip-${index + 1}`,
  threshold: index + 1,
}));

function getHealthScore(health: OpportunityRow["health"]) {
  switch (health) {
    case "On Track":
      return 18;
    case "Needs Review":
      return 11;
    case "At Risk":
      return 7;
    case "On Hold":
      return 4;
    default:
      return 0;
  }
}

export function createOpportunitiesColumns(
  t: Translator,
  locale: string,
): ColumnDef<DataTableFeatures, OpportunityRow>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Subscribe
          source={table.atoms.rowSelection}
          selector={() =>
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected() && "indeterminate")
          }
        >
          {(checked) => (
            <Checkbox
              checked={checked}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label={t("selectAllOpportunities")}
            />
          )}
        </Subscribe>
      ),
      cell: ({ row }) => (
        <Subscribe source={row.table.atoms.rowSelection} selector={(selection) => Boolean(selection?.[row.id])}>
          {(checked) => (
            <Checkbox
              checked={checked}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label={t("selectOpportunity", { account: row.original.account })}
            />
          )}
        </Subscribe>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: t("columnId"),
      cell: ({ row }) => <div className="text-sm tracking-tight">{row.original.id}</div>,
      enableHiding: false,
    },
    {
      accessorKey: "account",
      header: t("columnAccount"),
      cell: ({ row }) => <div className="font-medium text-sm">{row.original.account}</div>,
    },
    {
      accessorKey: "stage",
      header: t("stage"),
      cell: ({ row }) => (
        <Badge variant="outline" className="rounded-full px-2.5">
          {t(stageLabelKeys[row.original.stage])}
        </Badge>
      ),
      filterFn: "equalsString",
    },
    {
      accessorKey: "priority",
      header: t("columnPriority"),
      cell: ({ row }) => <div className="text-sm">{row.original.priority}</div>,
    },
    {
      accessorKey: "health",
      header: t("health"),
      cell: ({ row }) => (
        <div className="flex items-end gap-0.5" title={t(healthLabelKeys[row.original.health])}>
          <span className="sr-only">{t(healthLabelKeys[row.original.health])}</span>
          {healthStripSlots.map((slot) => (
            <div
              key={`${row.original.id}-${slot.id}`}
              className={cn(
                "h-5 w-1 rounded-full",
                slot.threshold <= getHealthScore(row.original.health) ? "bg-green-500/85" : "bg-green-500/15",
              )}
            />
          ))}
        </div>
      ),
      filterFn: "equalsString",
    },
    {
      accessorKey: "value",
      header: t("columnValue"),
      cell: ({ row }) => (
        <div className="font-medium text-sm tabular-nums">
          {formatCurrency(Number(row.original.value.replace(/[$,]/g, "")), {}, locale)}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">{t("edit")}</div>,
      cell: () => (
        <div className="text-right">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full text-muted-foreground hover:bg-transparent focus-visible:bg-transparent"
          >
            <Pencil />
            <span className="sr-only">{t("editOpportunity")}</span>
          </Button>
        </div>
      ),
      enableHiding: false,
    },
  ];
}
