"use client";
import * as React from "react";

import {
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  useTable,
} from "@tanstack/react-table";
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

import { createOpportunitiesColumns } from "./opportunities-table/columns";
import opportunitiesData from "./opportunities-table/data.json";
import { opportunitiesSchema } from "./opportunities-table/schema";

const stageOptions = [
  { value: "all", labelKey: "allStages" },
  { value: "Proposal Sent", labelKey: "stageProposalSent" },
  { value: "Discovery", labelKey: "stageDiscovery" },
  { value: "Negotiation", labelKey: "stageNegotiation" },
  { value: "Qualified", labelKey: "stageQualified" },
] as const;
const healthOptions = [
  { value: "all", labelKey: "allHealth" },
  { value: "On Track", labelKey: "healthOnTrack" },
  { value: "Needs Review", labelKey: "healthNeedsReview" },
  { value: "At Risk", labelKey: "healthAtRisk" },
  { value: "On Hold", labelKey: "healthOnHold" },
] as const;
const opportunities = opportunitiesSchema.parse(opportunitiesData);

function preventPaginationNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

export function OpportunitiesSection() {
  const t = useTranslations("crm");
  const locale = useLocale();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility] = React.useState<ColumnVisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const columns = React.useMemo(() => createOpportunitiesColumns(t, locale), [t, locale]);

  const table = useTable({
    features: dataTableFeatures,
    data: opportunities,
    columns,
    state: {
      rowSelection,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString",
  });
  const searchQuery = table.state.globalFilter ?? "";
  const stageFilter = (table.getColumn("stage")?.getFilterValue() as string | undefined) ?? "all";
  const healthFilter = (table.getColumn("health")?.getFilterValue() as string | undefined) ?? "all";
  const currentPage = table.state.pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const filteredOpportunityCount = table.getFilteredRowModel().rows.length;
  const visibleOpportunityCount = table.getRowModel().rows.length;
  const opportunityCountFormatter = new Intl.NumberFormat(locale);
  const pageNumbers = React.useMemo(() => {
    if (pageCount <= 3) {
      return Array.from({ length: pageCount }, (_, index) => index + 1);
    }

    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];

    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, pageCount]);

  return (
    <section>
      <Card className="@container/card">
        <CardHeader className="@[560px]/card:has-data-[slot=card-action]:grid-cols-[1fr_auto]! has-data-[slot=card-action]:grid-cols-1!">
          <CardTitle className="leading-none">{t("recentOpportunities")}</CardTitle>
          <CardDescription>{t("recentOpportunitiesDescription")}</CardDescription>
          <CardAction className="justify-self-stretch! @[560px]/card:justify-self-end! @[560px]/card:col-start-2! col-start-1! @[560px]/card:row-span-2! row-span-auto! @[560px]/card:row-start-1! row-start-auto!">
            <div className="flex flex-col @[560px]/card:items-end gap-2">
              <Input
                className="h-7 @[560px]/card:w-52 w-full min-w-40"
                placeholder={t("searchDeals")}
                value={searchQuery}
                onChange={(event) => {
                  table.setGlobalFilter(event.target.value || undefined);
                  table.setPageIndex(0);
                }}
              />
              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ListFilter data-icon="inline-start" />
                      {t("stage")}
                      <ChevronDownIcon data-icon="inline-end" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuRadioGroup
                      value={stageFilter}
                      onValueChange={(value) => {
                        table.getColumn("stage")?.setFilterValue(value === "all" ? undefined : value);
                        table.setPageIndex(0);
                      }}
                    >
                      {stageOptions.map((option) => (
                        <DropdownMenuRadioItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ListFilter data-icon="inline-start" />
                      {t("health")}
                      <ChevronDownIcon data-icon="inline-end" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuRadioGroup
                      value={healthFilter}
                      onValueChange={(value) => {
                        table.getColumn("health")?.setFilterValue(value === "all" ? undefined : value);
                        table.setPageIndex(0);
                      }}
                    >
                      {healthOptions.map((option) => (
                        <DropdownMenuRadioItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-0">
          <div className="overflow-hidden">
            <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4 **:data-[slot='table-cell']:py-4">
              <TableHeader className="border-t **:data-[slot='table-head']:h-11 **:data-[slot='table-head']:font-medium **:data-[slot='table-head']:text-foreground **:data-[slot='table-head']:text-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot='table-row']:border-border/50 **:data-[slot='table-row']:hover:bg-transparent">
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={table.state.rowSelection[row.id] && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          <table.FlexRender cell={cell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 text-center">
                      {t("noResults")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 pb-1">
            <p className="text-muted-foreground text-sm">
              {t("viewingCount", {
                visible: visibleOpportunityCount,
                total: opportunityCountFormatter.format(filteredOpportunityCount),
              })}
            </p>

            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent className="gap-1.5">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
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
    </section>
  );
}
