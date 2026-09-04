import { AlertTriangleIcon, Copy, Plane, Ship, Star, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { ShipmentActivityTab } from "./shipment-activity-tab";
import { ShipmentCargoTab } from "./shipment-cargo-tab";
import { getEtaLabel, type Shipment, statusLabelKeys, tierLabelKeys } from "./shipment-data";
import { ShipmentDocumentsTab } from "./shipment-documents-tab";
import { ShipmentRouteMap } from "./shipment-route-map";
import { ShipmentRouteTab } from "./shipment-route-tab";

const modeIcons = {
  air: Plane,
  land: Truck,
  sea: Ship,
} as const;

const modeLabelKeys = {
  air: "modeAir",
  land: "modeLand",
  sea: "modeSea",
} as const;

const routeTypeLabelKeys = {
  road: "routeRoad",
  flight: "routeFlight",
  ship: "routeShip",
} as const;

const progressRingClasses: Record<Shipment["status"], string> = {
  Scheduled: "text-muted-foreground",
  "In Transit": "text-primary",
  "Out for Delivery": "text-primary",
  Delivered: "text-green-600",
  Delayed: "text-destructive",
  "On Hold": "text-amber-500",
  "Customs Hold": "text-amber-500",
};

const statusBadgeClasses: Record<Shipment["status"], string> = {
  Scheduled: "border-muted bg-muted/50 text-muted-foreground",
  "In Transit": "border-primary/20 bg-primary/10 text-primary",
  "Out for Delivery": "border-primary/20 bg-primary/10 text-primary",
  Delivered: "border-green-600/20 bg-green-600/10 text-green-600",
  Delayed: "border-destructive/20 bg-destructive/10 text-destructive",
  "On Hold": "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Customs Hold": "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

type ShipmentDetailsProps = {
  shipment: Shipment | null;
};

function getContactLabel(mode: Shipment["mode"]) {
  if (mode === "land") {
    return "callDriver";
  }

  if (mode === "air") {
    return "callAirlineSupport";
  }

  return "callCaptain";
}

function getTransportNumberLabel(mode: Shipment["mode"]) {
  if (mode === "land") {
    return "vehicleNumber";
  }

  if (mode === "air") {
    return "flightNumber";
  }

  return "vesselNumber";
}

function EmptyShipmentOverview() {
  const t = useTranslations("logistics");

  return (
    <div className="grid min-h-48 place-items-center rounded-lg border border-dashed text-muted-foreground text-sm">
      {t("emptyState")}
    </div>
  );
}

function ShipmentOverview({ shipment }: { shipment: Shipment }) {
  const t = useTranslations("logistics");
  const ContactIcon = modeIcons[shipment.mode];
  const contactLabel = t(getContactLabel(shipment.mode));
  const transportNumberLabel = t(getTransportNumberLabel(shipment.mode));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center gap-2">
          <h1 className="font-medium text-lg tabular-nums tracking-tight sm:text-xl">#{shipment.id}</h1>
          <Button variant="ghost" size="icon-sm" aria-label={t("copyShipmentId")}>
            <Copy />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <Badge variant="outline" className={cn("gap-1.5", statusBadgeClasses[shipment.status])}>
            <span className={cn("size-1.5 rounded-full bg-current", progressRingClasses[shipment.status])} />
            {t(statusLabelKeys[shipment.status])}
          </Badge>
          <span className="text-muted-foreground">·</span>
          <span className="text-foreground tabular-nums">{t("complete", { progress: shipment.progress })}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-foreground tabular-nums">
            {t("etaLabel", { eta: getEtaLabel(shipment.eta, t), meta: getEtaLabel(shipment.etaMeta, t) })}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-9 after:rounded-sm">
            <AvatarFallback className="rounded-sm">{shipment.customer.initials}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <div className="font-medium text-sm leading-none">{shipment.customer.name}</div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-xs tabular-nums leading-none tracking-tight">{shipment.customer.id}</span>{" "}
              <Copy className="size-3" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <Badge variant="secondary">
            <Star />
            {t(tierLabelKeys[shipment.customer.tier])}
          </Badge>
          <div className="text-muted-foreground text-xs leading-none">{t(shipment.customer.tierLabelKey)}</div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-medium">{t("cargoDetails")}</h2>

          <Button variant="outline" size="sm">
            <ContactIcon data-icon="inline-start" />
            {contactLabel}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-[1.35fr_1fr_1.1fr_1.15fr_1fr]">
          <div className="col-span-2 flex flex-col gap-1 md:col-span-1 md:gap-2">
            <div className="text-muted-foreground text-xs leading-none md:invisible md:text-sm">{t("cargo")}</div>
            <div className="whitespace-nowrap text-sm leading-none">{t(shipment.cargoKey)}</div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-xs leading-none md:text-sm">{t("totalWeight")}</div>
            <div className="text-sm leading-none">{shipment.weight}</div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-xs leading-none md:text-sm">{t("transportMode")}</div>
            <div className="text-sm capitalize leading-none">
              {t(modeLabelKeys[shipment.mode])} · {t(routeTypeLabelKeys[shipment.routeType])}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-xs leading-none md:text-sm">{transportNumberLabel}</div>
            <div className="text-sm leading-none">{shipment.transportNumber}</div>
          </div>

          <div className="flex flex-col gap-2 md:text-right">
            <div className="text-muted-foreground text-xs leading-none md:text-sm">{t("status")}</div>
            <div className="text-sm leading-none">{t("complete", { progress: shipment.progress })}</div>
          </div>
        </div>
      </div>

      <Separator />

      <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
        <AlertTriangleIcon />
        <AlertTitle>{t(shipment.handling.labelKey)}</AlertTitle>
        <AlertDescription className="space-y-2">
          <div className="border-amber-900 text-amber-900 leading-none dark:border-amber-50 dark:text-amber-50">
            {t(shipment.handling.noteKey)}
          </div>

          <Separator className="bg-amber-800 dark:bg-amber-50" />

          <div className="flex flex-wrap gap-2">
            {shipment.handling.tags.map(({ icon: TagIcon, labelKey }) => (
              <Badge
                className="rounded-sm border-amber-200 bg-background/50 text-amber-900 dark:border-amber-900 dark:text-amber-50"
                key={labelKey}
                variant="outline"
              >
                <TagIcon data-icon="inline-start" />
                {t(labelKey)}
              </Badge>
            ))}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function ShipmentDetails({ shipment }: ShipmentDetailsProps) {
  const t = useTranslations("logistics");

  if (!shipment) {
    return (
      <div className="grid h-full min-h-0 grid-rows-[320px_1fr] overflow-hidden lg:grid-rows-[420px_1fr]">
        <div className="min-h-0 overflow-hidden">
          <ShipmentRouteMap shipment={null} />
        </div>
        <div className="min-h-0 overflow-hidden p-4">
          <EmptyShipmentOverview />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 grid-rows-[320px_1fr] overflow-hidden lg:grid-rows-[420px_1fr]">
      <div className="min-h-0 overflow-hidden">
        <ShipmentRouteMap shipment={shipment} />
      </div>
      <div className="min-h-0 overflow-hidden">
        <div className="h-full min-h-0 py-2">
          <Tabs defaultValue="overview" className="h-full gap-0">
            <TabsList
              className="w-full justify-start gap-2 border-b px-4 **:data-[slot=tabs-trigger]:text-xs sm:gap-4 sm:**:data-[slot=tabs-trigger]:text-sm"
              variant="line"
            >
              <TabsTrigger className="flex-none" value="overview">
                {t("tabOverview")}
              </TabsTrigger>
              <TabsTrigger className="flex-none" value="route">
                {t("tabRoute")}
              </TabsTrigger>
              <TabsTrigger className="flex-none" value="cargo">
                {t("tabCargo")}
              </TabsTrigger>
              <TabsTrigger className="flex-none" value="documents">
                {t("tabDocuments")}
              </TabsTrigger>
              <TabsTrigger className="flex-none" value="activity">
                {t("tabActivity")}
              </TabsTrigger>
            </TabsList>
            <TabsContent className="min-h-0 overflow-auto p-4" value="overview">
              <ShipmentOverview shipment={shipment} />
            </TabsContent>
            <TabsContent className="min-h-0 overflow-auto p-4" value="route">
              <ShipmentRouteTab shipment={shipment} />
            </TabsContent>
            <TabsContent className="min-h-0 overflow-auto p-4" value="cargo">
              <ShipmentCargoTab shipment={shipment} />
            </TabsContent>
            <TabsContent className="min-h-0 overflow-auto p-4" value="documents">
              <ShipmentDocumentsTab shipment={shipment} />
            </TabsContent>
            <TabsContent className="min-h-0 overflow-auto p-4" value="activity">
              <ShipmentActivityTab shipment={shipment} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
