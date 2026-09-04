import {
  ArrowUpDown,
  Bell,
  ChevronDown,
  CircleDashed,
  CircleGauge,
  Clock3,
  Copy,
  EllipsisVertical,
  FileText,
  Plus,
  RefreshCw,
  Settings,
  SquareTerminal,
  Terminal,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { SimpleIcon } from "@/components/simple-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import {
  environmentLabelKeys,
  type InfrastructureEnvironment,
  type InfrastructureGroup,
  statusLabelKeys,
} from "./infrastructure-data";

type InfrastructureTranslator = Awaited<ReturnType<typeof getTranslations<"infrastructure">>>;

export async function ProjectEnvironments({ group }: { group: InfrastructureGroup }) {
  const t = await getTranslations("infrastructure");

  return (
    <Collapsible
      defaultOpen
      className="flex flex-col overflow-hidden rounded-xl border bg-card py-3 text-card-foreground data-[state=open]:gap-3 data-[state=open]:pb-0"
    >
      <div className="flex flex-col gap-2 px-4 sm:flex-row sm:items-center">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="group -ml-2 h-auto w-full justify-start gap-2 px-2 py-1 hover:bg-transparent aria-expanded:bg-transparent sm:flex-1"
          >
            <ChevronDown className="group-data-[state=open]:rotate-180" />
            <div className="flex min-w-0 items-baseline gap-1.5 text-left">
              <span className="shrink-0 font-medium leading-none">{group.organization}</span>
              <span className="min-w-0 truncate text-muted-foreground text-sm">({t(group.nameKey)})</span>
            </div>
          </Button>
        </CollapsibleTrigger>
        <div className="flex w-full items-center justify-between gap-2 sm:ml-auto sm:w-auto sm:justify-end">
          <Button variant="ghost" size="sm" className="-ml-1.5 sm:ml-0">
            <Plus data-icon="inline-start" />
            {t("addEnvironment")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-sm">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuGroup>
                {group.rows.length > 0 ? (
                  <DropdownMenuItem>
                    <FileText />
                    {t("activityLogs")}
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem>
                  <Terminal />
                  {t("openConsole")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  {t("projectSettings")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RefreshCw />
                  {t("syncStatus")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  {t("manageAlerts")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Copy />
                  {t("copyProjectId")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CollapsibleContent>
        {group.rows.length > 0 ? <EnvironmentTable rows={group.rows} t={t} /> : <EmptyProjectState t={t} />}
      </CollapsibleContent>
    </Collapsible>
  );
}

function EnvironmentTable({ rows, t }: { rows: InfrastructureEnvironment[]; t: InfrastructureTranslator }) {
  return (
    <div className="scrollbar-thin overflow-x-auto [scrollbar-color:var(--border)_transparent] **:data-[slot=table-container]:overflow-visible [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1">
      <Table className="min-w-[1700px] table-fixed **:data-[slot='table-cell']:px-5 **:data-[slot='table-head']:px-5">
        <colgroup>
          <col className="w-90" />
          <col className="w-40" />
          <col className="w-42" />
          <col className="w-35" />
          <col className="w-35" />
          <col className="w-38" />
          <col className="w-98" />
          <col className="w-55" />
          <col className="w-18" />
        </colgroup>
        <TableHeader className="bg-muted/50 [&_tr]:border-y">
          <TableRow>
            <TableHead className="font-medium">
              <span className="inline-flex items-center gap-1">
                {t("colDomain")} <ArrowUpDown className="size-4" />
              </span>
            </TableHead>
            <TableHead>{t("colPlatform")}</TableHead>
            <TableHead>{t("colEnvironment")}</TableHead>
            <TableHead>{t("colHealth")}</TableHead>
            <TableHead>{t("colLatency")}</TableHead>
            <TableHead>{t("colUptime")}</TableHead>
            <TableHead>{t("colResources")}</TableHead>
            <TableHead>{t("colServer")}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody className="**:data-[slot='table-row']:hover:bg-transparent">
          {rows.map((row) => (
            <TableRow key={row.domain}>
              <TableCell>
                <span className="block truncate font-medium" title={row.domain}>
                  {row.domain}
                </span>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-2 font-medium text-muted-foreground">
                  <SimpleIcon icon={row.platform.icon} className="size-4 fill-current" />
                  {row.platform.name}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={row.environment === "Expired" ? "destructive" : "secondary"}
                  className={cn(
                    "rounded-sm px-1.5 py-0.5",
                    row.environment === "Production" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                    row.environment === "Staging" && "bg-sky-500/10 text-sky-600 dark:text-sky-400",
                  )}
                >
                  {t(environmentLabelKeys[row.environment])}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={row.status === "Online" ? "secondary" : "destructive"}
                  className={cn(
                    "rounded-sm px-1.5 py-0.5",
                    row.status === "Online" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      row.status === "Online" ? "bg-emerald-500" : "bg-destructive",
                    )}
                  />
                  {t(statusLabelKeys[row.status])}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground tabular-nums">
                  <CircleGauge className="size-4" />
                  {row.latency}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground tabular-nums">
                  <Clock3 className="size-4" />
                  {row.uptime}
                </span>
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-3 gap-4">
                  <ResourceMeter labelKey="cpu" value={row.resources.cpu} t={t} />
                  <ResourceMeter labelKey="ram" value={row.resources.ram} t={t} />
                  <ResourceMeter labelKey="disk" value={row.resources.disk} t={t} />
                </div>
              </TableCell>
              <TableCell>
                <span className="flex flex-col font-medium">
                  {row.server}
                  <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <span
                      aria-hidden="true"
                      className={cn("shrink-0 rounded-xs text-sm ring-1 ring-foreground/10", `flag:${row.countryCode}`)}
                    />
                    {row.countryCode} · {row.plan}
                  </span>
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="-mr-2">
                      <SquareTerminal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40" align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <FileText />
                        {t("viewLogs")}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Terminal />
                        {t("openConsole")}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RefreshCw />
                        {t("restart")}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Copy />
                        {t("copyUrl")}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ResourceMeter({ labelKey, value, t }: { labelKey: string; value: number; t: InfrastructureTranslator }) {
  const isCritical = value >= 70;
  const isWarning = value >= 55;

  return (
    <span className="min-w-0 space-y-1">
      <span className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-medium text-muted-foreground">{t(labelKey)}</span>
        <span
          className={cn(
            "font-medium text-emerald-600 tabular-nums dark:text-emerald-400",
            isWarning && "text-amber-600 dark:text-amber-400",
            isCritical && "text-destructive",
          )}
        >
          {value}%
        </span>
      </span>
      <span className="block h-1.5 overflow-hidden rounded-full bg-muted-foreground/20">
        <span
          className={cn(
            "block h-full rounded-full bg-emerald-500",
            isWarning && "bg-amber-500",
            isCritical && "bg-destructive",
          )}
          style={{ width: `${value}%` }}
        />
      </span>
    </span>
  );
}

function EmptyProjectState({ t }: { t: InfrastructureTranslator }) {
  return (
    <div className="flex min-h-24 items-center justify-center border-t bg-muted/50 p-4">
      <div className="flex items-center gap-2">
        <CircleDashed className="size-4" />
        <p className="font-medium text-sm">{t("noEnvironments")}</p>
      </div>
    </div>
  );
}
