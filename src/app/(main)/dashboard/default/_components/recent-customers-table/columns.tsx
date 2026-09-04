"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Subscribe } from "@tanstack/react-table";
import { addMinutes, differenceInCalendarDays, endOfToday, format, parseISO } from "date-fns";
import { enUS, type Locale, ptBR } from "date-fns/locale";
import { CircleAlertIcon, CircleCheckIcon, Clock3Icon, LoaderIcon, UserRound } from "lucide-react";
import type { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { DataTableFeatures } from "@/lib/data-table-features";

import type { RecentCustomerRow } from "./schema";

type Translator = ReturnType<typeof useTranslations>;

const statusLabelKeys: Record<string, string> = {
  Subscribed: "statusSubscribed",
  Inactive: "statusInactive",
  Unsubscribed: "statusUnsubscribed",
};

const billingLabelKeys: Record<string, string> = {
  Paid: "billingPaid",
  Pending: "billingPending",
  Overdue: "billingOverdue",
  Trial: "billingTrial",
};

const planLabelKeys: Record<string, string> = {
  Starter: "planStarter",
  Growth: "planGrowth",
  Pro: "planPro",
  Enterprise: "planEnterprise",
};

const dateFnsLocales: Record<string, Locale> = { "pt-BR": ptBR, en: enUS };

function billingIcon(billing: string) {
  switch (billing) {
    case "Paid":
      return <CircleCheckIcon className="fill-green-500 stroke-primary-foreground dark:fill-green-600" />;
    case "Pending":
      return <LoaderIcon />;
    case "Overdue":
      return <CircleAlertIcon className="text-amber-600 dark:text-amber-500" />;
    case "Trial":
      return <Clock3Icon className="text-muted-foreground" />;
    default:
      return null;
  }
}

export function createRecentCustomersColumns(
  t: Translator,
  locale: string,
): ColumnDef<DataTableFeatures, RecentCustomerRow>[] {
  const dateFnsLocale = dateFnsLocales[locale] ?? enUS;
  const timePattern = dateFnsLocale === ptBR ? "HH:mm" : "h:mm a";

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
                aria-label={t("selectAllCustomers")}
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
                aria-label={t("selectCustomer", { name: row.original.name })}
              />
            )}
          </Subscribe>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: t("columnCustomer"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md border bg-muted">
            <UserRound className="size-4 text-muted-foreground" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-end justify-between gap-3">
              <div className="grid min-w-0 gap-0.5">
                <span className="truncate font-medium text-sm leading-none">{row.original.name}</span>
                <span className="truncate text-muted-foreground text-xs leading-none">#{row.original.id}</span>
              </div>
            </div>
          </div>
        </div>
      ),
      enableHiding: false,
    },
    {
      id: "search",
      accessorFn: (row) => `${row.id} ${row.name} ${row.email}`,
      filterFn: "includesString",
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: t("columnStatus"),
      filterFn: "equalsString",
      cell: ({ row }) => (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {t(statusLabelKeys[row.original.status])}
        </Badge>
      ),
    },
    {
      accessorKey: "billing",
      header: t("columnBilling"),
      filterFn: "equalsString",
      cell: ({ row }) => (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {billingIcon(row.original.billing)}
          {t(billingLabelKeys[row.original.billing])}
        </Badge>
      ),
    },
    {
      accessorKey: "plan",
      header: t("columnPlan"),
      cell: ({ row }) => <span className="text-sm">{t(planLabelKeys[row.original.plan])}</span>,
    },
    {
      id: "joinedWindow",
      accessorFn: (row) => {
        const daysSinceJoined = differenceInCalendarDays(endOfToday(), parseISO(row.joined));

        if (daysSinceJoined <= 30) return ["30", "90"];
        if (daysSinceJoined <= 90) return ["90"];
        return [];
      },
      filterFn: "arrIncludes",
      enableHiding: true,
    },
    {
      accessorKey: "joined",
      header: t("columnJoined"),
      cell: ({ row }) => {
        const baseDate = parseISO(row.original.joined);
        const joinedAt = addMinutes(baseDate, 9 * 60 + (Number(row.original.id) % 12) * 17);

        return (
          <div className="grid gap-0.5">
            <span className="text-sm">{format(joinedAt, "do MMMM yyyy", { locale: dateFnsLocale })}</span>
            <span className="text-muted-foreground text-xs">
              {t("atTime", { time: format(joinedAt, timePattern) })}
            </span>
          </div>
        );
      },
    },
  ];
}
