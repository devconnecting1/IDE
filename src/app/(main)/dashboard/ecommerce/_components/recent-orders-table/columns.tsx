import type { ColumnDef } from "@tanstack/react-table";
import { Subscribe } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { enUS, type Locale, ptBR } from "date-fns/locale";
import { MoreHorizontal } from "lucide-react";
import type { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { formatCurrency } from "@/lib/utils";

import type { OrderRow } from "./schema";

type EcommerceTranslator = ReturnType<typeof useTranslations<"ecommerce">>;

const dateFnsLocales: Record<string, Locale> = { "pt-BR": ptBR, en: enUS };

function formatOrderDate(date: string, locale: string) {
  return format(parseISO(date), "h:mm a, d MMM yyyy", { locale: dateFnsLocales[locale] ?? enUS });
}

function PaymentBadge({ status, t }: { status: OrderRow["payment"]; t: EcommerceTranslator }) {
  if (status === "Paid") {
    return (
      <Badge
        className="border-green-700/25 text-green-700 dark:border-green-300/25 dark:text-green-300"
        variant="outline"
      >
        <span className="size-1.5 rounded-full bg-current" />
        {t("paymentPaid")}
      </Badge>
    );
  }

  if (status === "Refunded") {
    return (
      <Badge variant="destructive">
        <span className="size-1.5 rounded-full bg-current" />
        {t("paymentRefunded")}
      </Badge>
    );
  }

  return (
    <Badge
      className="border-yellow-700/25 text-yellow-700 dark:border-yellow-300/25 dark:text-yellow-300"
      variant="outline"
    >
      <span className="size-1.5 rounded-full bg-current" />
      {t("paymentPending")}
    </Badge>
  );
}

function FulfillmentBadge({ status, t }: { status: OrderRow["fulfillment"]; t: EcommerceTranslator }) {
  if (status === "Fulfilled") {
    return (
      <Badge
        className="border-green-700/25 text-green-700 dark:border-green-300/25 dark:text-green-300"
        variant="outline"
      >
        <span className="size-1.5 rounded-full bg-current" />
        {t("fulfillmentFulfilled")}
      </Badge>
    );
  }

  if (status === "Returned") {
    return (
      <Badge variant="destructive">
        <span className="size-1.5 rounded-full bg-current" />
        {t("fulfillmentReturned")}
      </Badge>
    );
  }

  return (
    <Badge variant="destructive">
      <span className="size-1.5 rounded-full bg-current" />
      {t("fulfillmentUnfulfilled")}
    </Badge>
  );
}

export function createRecentOrdersColumns(
  t: EcommerceTranslator,
  locale: string,
): ColumnDef<DataTableFeatures, OrderRow>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="w-10">
          <Subscribe
            source={table.atoms.rowSelection}
            selector={() =>
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected() && "indeterminate")
            }
          >
            {(checked) => (
              <Checkbox
                aria-label={t("selectAllOrders")}
                checked={checked}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              />
            )}
          </Subscribe>
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-10">
          <Subscribe source={row.table.atoms.rowSelection} selector={(selection) => Boolean(selection?.[row.id])}>
            {(checked) => (
              <Checkbox
                aria-label={t("selectOrder", { id: row.original.id })}
                checked={checked}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
              />
            )}
          </Subscribe>
        </div>
      ),
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: "id",
      header: t("colOrder"),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <div className="font-medium leading-none">{row.original.id}</div>
          <div className="text-muted-foreground text-xs">{t("itemsCount", { count: row.original.items })}</div>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "customer",
      header: t("colCustomer"),
    },
    {
      id: "statusSummary",
      header: t("colStatus"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <PaymentBadge status={row.original.payment} t={t} />
          <FulfillmentBadge status={row.original.fulfillment} t={t} />
        </div>
      ),
      filterFn: (row, _columnId, value) => {
        if (value === "Needs action") {
          return (
            row.original.payment === "Pending" ||
            row.original.payment === "Refunded" ||
            row.original.fulfillment === "Unfulfilled" ||
            row.original.fulfillment === "Returned"
          );
        }

        if (value === "Unfulfilled") {
          return row.original.fulfillment === "Unfulfilled";
        }

        if (value === "Unpaid") {
          return row.original.payment === "Pending";
        }

        if (value === "Returns") {
          return row.original.payment === "Refunded" || row.original.fulfillment === "Returned";
        }

        return true;
      },
    },
    {
      accessorKey: "total",
      header: () => <div className="w-28">{t("colTotal")}</div>,
      cell: ({ row }) => <div className="w-28 tabular-nums">{formatCurrency(row.original.total, {}, locale)}</div>,
    },
    {
      accessorKey: "date",
      header: () => <div className="w-44">{t("colDate")}</div>,
      cell: ({ row }) => <div className="w-44 text-muted-foreground">{formatOrderDate(row.original.date, locale)}</div>,
    },
    {
      id: "actions",
      header: () => <div className="flex w-full justify-end">{t("colActions")}</div>,
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex w-full justify-end">
              <Button aria-label={t("openOrderActions")} size="icon-sm" variant="ghost">
                <MoreHorizontal />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>{t("orderActionsLabel")}</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>{t("viewOrder")}</DropdownMenuItem>
              <DropdownMenuItem>{t("contactCustomer")}</DropdownMenuItem>
              <DropdownMenuItem>{t("copyOrderId")}</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableHiding: false,
      enableSorting: false,
    },
  ];
}
