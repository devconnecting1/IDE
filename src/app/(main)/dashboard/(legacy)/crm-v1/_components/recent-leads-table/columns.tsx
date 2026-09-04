"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Subscribe } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import type { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/lib/data-table-features";

import type { RecentLeadRow } from "./schema";

const statusLabelKeys: Record<string, string> = {
  Qualified: "stageQualified",
  Negotiation: "stageNegotiation",
  "Proposal Sent": "stageProposalSent",
  Contacted: "statusContacted",
  Won: "stageWon",
  New: "statusNew",
};

const sourceLabelKeys: Record<string, string> = {
  Website: "sourceWebsite",
  Referral: "sourceReferral",
  "Social Media": "sourceSocialMedia",
  "Cold Outreach": "sourceColdOutreach",
  Other: "sourceOther",
};

const lastActivityLabelKeys = {
  minutes: "lastActivityMinutes",
  hours: "lastActivityHours",
  days: "lastActivityDays",
} as const;

type Translator = ReturnType<typeof useTranslations>;

export function createRecentLeadsColumns(t: Translator): ColumnDef<DataTableFeatures, RecentLeadRow>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
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
                aria-label={t("selectAll")}
              />
            )}
          </Subscribe>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Subscribe source={row.table.atoms.rowSelection} selector={(selection) => Boolean(selection?.[row.id])}>
            {(checked) => (
              <Checkbox
                checked={checked}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label={t("selectRow")}
              />
            )}
          </Subscribe>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: t("columnRef"),
      cell: ({ row }) => <span className="tabular-nums">{row.original.id}</span>,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: t("columnName"),
      cell: ({ row }) => row.original.name,
      enableHiding: false,
    },
    {
      accessorKey: "company",
      header: t("columnCompany"),
      cell: ({ row }) => row.original.company,
    },
    {
      accessorKey: "status",
      header: t("columnStatus"),
      cell: ({ row }) => {
        const statusLabelKey = statusLabelKeys[row.original.status];

        return <Badge variant="secondary">{statusLabelKey ? t(statusLabelKey) : row.original.status}</Badge>;
      },
    },
    {
      accessorKey: "source",
      header: t("columnSource"),
      cell: ({ row }) => {
        const sourceLabelKey = sourceLabelKeys[row.original.source];

        return <Badge variant="outline">{sourceLabelKey ? t(sourceLabelKey) : row.original.source}</Badge>;
      },
    },
    {
      accessorKey: "lastActivity",
      header: t("columnLastActivity"),
      cell: ({ row }) => {
        const { lastActivityValue, lastActivityUnit } = row.original;

        return (
          <span className="text-muted-foreground tabular-nums">
            {t(lastActivityLabelKeys[lastActivityUnit], { value: lastActivityValue })}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex size-8 text-muted-foreground">
              <EllipsisVertical />
              <span className="sr-only">{t("openMenu")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuGroup>
              <DropdownMenuItem>{t("actionView")}</DropdownMenuItem>
              <DropdownMenuItem>{t("actionAssign")}</DropdownMenuItem>
              <DropdownMenuItem>{t("actionArchive")}</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">{t("actionDelete")}</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableHiding: false,
    },
  ];
}
