"use client";

import { createContext, useContext } from "react";

import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { useSortable } from "@dnd-kit/react/sortable";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { FlexRender, Subscribe } from "@tanstack/react-table";
import { CircleCheckIcon, EllipsisVerticalIcon, GripVerticalIcon, LoaderIcon, TrendingUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TableCell, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import type { DataTableFeatures } from "@/lib/data-table-features";

import type { ProposalSectionsRow } from "./schema";

const statusLabelKeys: Record<string, string> = {
  Done: "statusDone",
  "In Progress": "statusInProgress",
  "In Process": "statusInProcess",
  "Not Started": "statusNotStarted",
};

const typeLabelKeys: Record<string, string> = {
  "Cover page": "typeCoverPage",
  "Table of contents": "typeTableOfContents",
  "Executive Summary": "typeExecutiveSummary",
  "Technical Approach": "typeTechnicalApproach",
  Design: "typeDesign",
  Capabilities: "typeCapabilities",
  "Focus Documents": "typeFocusDocuments",
  Narrative: "typeNarrative",
  Financial: "typeFinancial",
  Legal: "typeLegal",
  "Plain language": "typePlainLanguage",
  Planning: "typePlanning",
  Research: "typeResearch",
  "Technical content": "typeTechnicalContent",
  Visual: "typeVisual",
};

type Translator = ReturnType<typeof useTranslations>;

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

type SortableRowContextValue = Pick<ReturnType<typeof useSortable>, "handleRef">;

const SortableRowContext = createContext<SortableRowContextValue | null>(null);

function DragHandle() {
  const sortableRow = useContext(SortableRowContext);
  const t = useTranslations();

  if (!sortableRow) {
    return null;
  }

  const { handleRef } = sortableRow;

  return (
    <Button ref={handleRef} variant="ghost" size="icon" className="size-7 text-muted-foreground hover:bg-transparent">
      <GripVerticalIcon />
      <span className="sr-only">{t("defaultV1.dragToReorder")}</span>
    </Button>
  );
}

function ProposalSectionDetailViewer({ item }: { item: ProposalSectionsRow }) {
  const isMobile = useIsMobile();
  const t = useTranslations();

  const chartConfig = {
    desktop: {
      label: t("defaultV1.chartDesktop"),
      color: "var(--primary)",
    },
    mobile: {
      label: t("defaultV1.chartMobile"),
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>{t("defaultV1.showingTotalVisitors6Months")}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 font-medium leading-none">
                  {t("defaultV1.trendingUpByPercent", { percent: 5.2 })} <TrendingUpIcon />
                </div>
                <div className="text-muted-foreground">{t("defaultV1.drawerTestParagraph")}</div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">{t("defaultV1.columnHeader")}</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">{t("defaultV1.labelType")}</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder={t("defaultV1.selectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Table of Contents">{t("defaultV1.typeTableOfContents")}</SelectItem>
                      <SelectItem value="Executive Summary">{t("defaultV1.typeExecutiveSummary")}</SelectItem>
                      <SelectItem value="Technical Approach">{t("defaultV1.typeTechnicalApproach")}</SelectItem>
                      <SelectItem value="Design">{t("defaultV1.typeDesign")}</SelectItem>
                      <SelectItem value="Capabilities">{t("defaultV1.typeCapabilities")}</SelectItem>
                      <SelectItem value="Focus Documents">{t("defaultV1.typeFocusDocuments")}</SelectItem>
                      <SelectItem value="Narrative">{t("defaultV1.typeNarrative")}</SelectItem>
                      <SelectItem value="Cover Page">{t("defaultV1.typeCoverPage")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">{t("default.columnStatus")}</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder={t("defaultV1.selectStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Done">{t("defaultV1.statusDone")}</SelectItem>
                      <SelectItem value="In Progress">{t("defaultV1.statusInProgress")}</SelectItem>
                      <SelectItem value="Not Started">{t("defaultV1.statusNotStarted")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">{t("defaultV1.columnTarget")}</Label>
                <Input id="target" defaultValue={item.target} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">{t("defaultV1.columnLimit")}</Label>
                <Input id="limit" defaultValue={item.limit} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">{t("defaultV1.columnReviewer")}</Label>
              <Select defaultValue={item.reviewer}>
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder={t("defaultV1.selectReviewer")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                    <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
                    <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>{t("defaultV1.submit")}</Button>
          <DrawerClose asChild>
            <Button variant="outline">{t("defaultV1.doneAction")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function createInlineSaveHandler(t: Translator, header: string) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: t("defaultV1.saving", { header }),
      success: t("defaultV1.doneAction"),
      error: t("defaultV1.error"),
    });
  };
}

export function createProposalSectionsColumns(t: Translator): ColumnDef<DataTableFeatures, ProposalSectionsRow>[] {
  return [
    {
      id: "drag",
      header: () => null,
      cell: () => <DragHandle />,
      enableSorting: false,
      enableHiding: false,
    },
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
                aria-label={t("tasks.selectAll")}
              />
            )}
          </Subscribe>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Subscribe source={row.table.atoms.rowSelection} selector={(rowSelection) => Boolean(rowSelection?.[row.id])}>
            {(checked) => (
              <Checkbox
                checked={checked}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label={t("tasks.selectRow")}
              />
            )}
          </Subscribe>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "header",
      header: t("defaultV1.columnHeader"),
      cell: ({ row }) => <ProposalSectionDetailViewer item={row.original} />,
      enableHiding: false,
    },
    {
      accessorKey: "type",
      header: t("defaultV1.columnSectionType"),
      cell: ({ row }) => {
        const typeLabelKey = typeLabelKeys[row.original.type];

        return (
          <div className="w-32">
            <Badge variant="outline" className="px-1.5 text-muted-foreground">
              {typeLabelKey ? t(`defaultV1.${typeLabelKey}`) : row.original.type}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("default.columnStatus"),
      cell: ({ row }) => {
        const statusLabelKey = statusLabelKeys[row.original.status];

        return (
          <Badge variant="outline" className="px-1.5 text-muted-foreground">
            {row.original.status === "Done" ? (
              <CircleCheckIcon className="fill-green-500 stroke-primary-foreground dark:fill-green-600" />
            ) : (
              <LoaderIcon />
            )}
            {statusLabelKey ? t(`defaultV1.${statusLabelKey}`) : row.original.status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "target",
      header: () => <div className="w-full text-right">{t("defaultV1.columnTarget")}</div>,
      cell: ({ row }) => (
        <form onSubmit={createInlineSaveHandler(t, row.original.header)}>
          <Label htmlFor={`${row.original.id}-target`} className="sr-only">
            {t("defaultV1.columnTarget")}
          </Label>
          <Input
            id={`${row.original.id}-target`}
            defaultValue={row.original.target}
            className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:focus-visible:bg-input/30 dark:hover:bg-input/30"
          />
        </form>
      ),
    },
    {
      accessorKey: "limit",
      header: () => <div className="w-full text-right">{t("defaultV1.columnLimit")}</div>,
      cell: ({ row }) => (
        <form onSubmit={createInlineSaveHandler(t, row.original.header)}>
          <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
            {t("defaultV1.columnLimit")}
          </Label>
          <Input
            id={`${row.original.id}-limit`}
            defaultValue={row.original.limit}
            className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:focus-visible:bg-input/30 dark:hover:bg-input/30"
          />
        </form>
      ),
    },
    {
      accessorKey: "reviewer",
      header: t("defaultV1.columnReviewer"),
      cell: ({ row }) => {
        const isAssigned = row.original.reviewer !== "Assign reviewer";

        if (isAssigned) {
          return row.original.reviewer;
        }

        return (
          <>
            <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
              {t("defaultV1.columnReviewer")}
            </Label>
            <Select>
              <SelectTrigger
                id={`${row.original.id}-reviewer`}
                className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                size="sm"
              >
                <SelectValue placeholder={t("defaultV1.assignReviewer")} />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                  <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        );
      },
    },
    {
      id: "actions",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
              size="icon"
            >
              <EllipsisVerticalIcon />
              <span className="sr-only">{t("tasks.openMenu")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>{t("tasks.edit")}</DropdownMenuItem>
            <DropdownMenuItem>{t("tasks.makeCopy")}</DropdownMenuItem>
            <DropdownMenuItem>{t("tasks.favorite")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">{t("tasks.delete")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
    },
  ];
}

export function DraggableProposalSectionsRow({
  row,
  index,
  isSelected,
}: {
  row: Row<DataTableFeatures, ProposalSectionsRow>;
  index: number;
  isSelected: boolean;
}) {
  const { handleRef, isDragging, ref } = useSortable({
    id: row.original.id,
    index,
    type: "proposal-section",
    accept: "proposal-section",
    group: "proposal-sections",
    modifiers: [RestrictToVerticalAxis],
  });

  return (
    <SortableRowContext.Provider value={{ handleRef }}>
      <TableRow
        ref={ref}
        data-state={isSelected && "selected"}
        data-dragging={isDragging}
        className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            <FlexRender cell={cell} />
          </TableCell>
        ))}
      </TableRow>
    </SortableRowContext.Provider>
  );
}
