"use client";
"use no memo";

import * as React from "react";

import {
  type ColumnFiltersState,
  type ColumnVisibilityState,
  flexRender,
  type PaginationState,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import { enUS, ptBR } from "date-fns/locale";
import { ChevronDownIcon, ListFilter } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dataTableFeatures } from "@/lib/data-table-features";

import { accounts } from "./accounts";
import { createTransactionsColumns } from "./transactions-table/columns";
import transactionsData from "./transactions-table/data.json";
import { transactionCategories, transactionsSchema, transactionTypes } from "./transactions-table/schema";

const transactions = transactionsSchema.parse(transactionsData);
const categoryOptions = ["all", ...transactionCategories] as const;
const typeOptions = ["all", ...transactionTypes] as const;

function preventPaginationNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function getAriaSort(canSort: boolean, state: false | "asc" | "desc") {
  if (!canSort) return undefined;
  if (state === "asc") return "ascending" as const;
  if (state === "desc") return "descending" as const;
  return "none" as const;
}

const hiddenColumns: ColumnVisibilityState = { type: false };

type TransactionsSectionProps = {
  initialAccountFilter?: string;
  onAccountFilterConsumed?: () => void;
};

export function TransactionsSection({ initialAccountFilter, onAccountFilterConsumed }: TransactionsSectionProps) {
  const t = useTranslations("finance");
  const locale = useLocale();
  const dateFnsLocale = locale === "pt-BR" ? ptBR : enUS;
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(() =>
    initialAccountFilter ? [{ id: "accountId", value: initialAccountFilter }] : [],
  );
  const [columnVisibility] = React.useState<ColumnVisibilityState>(hiddenColumns);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const columns = React.useMemo(() => createTransactionsColumns(t, dateFnsLocale), [t, dateFnsLocale]);

  const table = useTable({
    features: dataTableFeatures,
    data: transactions,
    columns,
    state: { rowSelection, columnFilters, columnVisibility, sorting, globalFilter, pagination },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString",
  });

  React.useEffect(() => {
    if (!initialAccountFilter) return;
    table.getColumn("accountId")?.setFilterValue(initialAccountFilter);
    table.setPageIndex(0);
    onAccountFilterConsumed?.();
  }, [initialAccountFilter, table, onAccountFilterConsumed]);

  const searchQuery = table.state.globalFilter ?? "";
  const accountFilter = (table.getColumn("accountId")?.getFilterValue() as string | undefined) ?? "all";
  const categoryFilter = (table.getColumn("category")?.getFilterValue() as string | undefined) ?? "all";
  const typeFilter = (table.getColumn("type")?.getFilterValue() as string | undefined) ?? "all";
  const currentPage = table.state.pagination.pageIndex + 1;
  const pageCount = Math.max(1, table.getPageCount());
  const filteredTransactionCount = table.getFilteredRowModel().rows.length;
  const visibleTransactionCount = table.getRowModel().rows.length;
  const pageNumbers = React.useMemo(() => {
    if (pageCount <= 3) return Array.from({ length: pageCount }, (_, index) => index + 1);
    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];
    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, pageCount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">{t("txnTitle")}</CardTitle>
        <CardDescription>{t("txnDescription")}</CardDescription>
        <CardAction>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              aria-label={t("txnSearchAria")}
              className="h-7 w-44 md:w-52"
              placeholder={t("txnSearchPlaceholder")}
              value={searchQuery}
              onChange={(event) => {
                table.setGlobalFilter(event.target.value || undefined);
                table.setPageIndex(0);
              }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ListFilter aria-hidden="true" data-icon="inline-start" />
                  {t("txnFilterAccount")}
                  <ChevronDownIcon aria-hidden="true" data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuRadioGroup
                  value={accountFilter}
                  onValueChange={(value) => {
                    table.getColumn("accountId")?.setFilterValue(value === "all" ? undefined : value);
                    table.setPageIndex(0);
                  }}
                >
                  <DropdownMenuRadioItem value="all">{t("txnAllAccounts")}</DropdownMenuRadioItem>
                  {accounts.map((account) => (
                    <DropdownMenuRadioItem key={account.id} value={account.id}>
                      {account.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ListFilter aria-hidden="true" data-icon="inline-start" />
                  {t("txnFilterCategory")}
                  <ChevronDownIcon aria-hidden="true" data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuRadioGroup
                  value={categoryFilter}
                  onValueChange={(value) => {
                    table.getColumn("category")?.setFilterValue(value === "all" ? undefined : value);
                    table.setPageIndex(0);
                  }}
                >
                  {categoryOptions.map((option) => (
                    <DropdownMenuRadioItem key={option} value={option}>
                      {option === "all" ? t("txnAllCategories") : option}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ListFilter aria-hidden="true" data-icon="inline-start" />
                  {t("txnFilterType")}
                  <ChevronDownIcon aria-hidden="true" data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuRadioGroup
                  value={typeFilter}
                  onValueChange={(value) => {
                    table.getColumn("type")?.setFilterValue(value === "all" ? undefined : value);
                    table.setPageIndex(0);
                  }}
                >
                  {typeOptions.map((option) => (
                    <DropdownMenuRadioItem key={option} value={option}>
                      {(() => {
                        if (option === "all") return t("txnTypeAll");
                        if (option === "credit") return t("txnTypeCredit");
                        return t("txnTypeDebit");
                      })()}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <div className="overflow-hidden">
          <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4 **:data-[slot='table-cell']:py-4">
            <TableHeader className="border-t **:data-[slot='table-head']:h-11 **:data-[slot='table-head']:font-medium **:data-[slot='table-head']:text-foreground **:data-[slot='table-head']:text-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const ariaSort = getAriaSort(header.column.getCanSort(), header.column.getIsSorted());
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan} aria-sort={ariaSort}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot='table-row']:border-border/50 **:data-[slot='table-row']:hover:bg-transparent">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 text-center">
                    {t("txnNoResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 pb-1">
          <p className="text-muted-foreground text-sm">
            {t("txnShowing", { visible: visibleTransactionCount, filtered: filteredTransactionCount.toLocaleString() })}
          </p>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent className="gap-1.5">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text={t("paginationPrevious")}
                  className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined}
                  onClick={(event) => {
                    preventPaginationNavigation(event);
                    table.previousPage();
                  }}
                />
              </PaginationItem>
              {pageNumbers[0] > 1 ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}
              {pageNumbers.map((pageNumber) => (
                <PaginationItem key={`page-${pageNumber}`}>
                  <PaginationLink
                    href="#"
                    isActive={table.state.pagination.pageIndex === pageNumber - 1}
                    onClick={(event) => {
                      preventPaginationNavigation(event);
                      table.setPageIndex(pageNumber - 1);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {pageNumbers[pageNumbers.length - 1] < pageCount ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  text={t("paginationNext")}
                  className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined}
                  onClick={(event) => {
                    preventPaginationNavigation(event);
                    table.nextPage();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
