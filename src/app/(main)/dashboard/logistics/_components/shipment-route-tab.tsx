"use client";

import { Circle, MapPin, Plane, Ship, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { getRouteStops, type RouteStop, type Shipment } from "./shipment-data";

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

const statusLineClasses: Record<RouteStop["status"], string> = {
  completed: "bg-primary",
  current: "bg-gradient-to-b from-primary to-muted-foreground/30",
  upcoming: "bg-muted-foreground/20",
};

function getStopIcon(type: RouteStop["type"]) {
  if (type === "origin" || type === "destination") {
    return MapPin;
  }
  return Circle;
}

function RouteStopItem({ stop, isLast, t }: { stop: RouteStop; isLast: boolean; t: (key: string) => string }) {
  const Icon = getStopIcon(stop.type);

  function getStatus(stopStatus: RouteStop["status"]) {
    if (stopStatus === "completed") {
      return "completed" as const;
    }
    if (stopStatus === "current") {
      return "current" as const;
    }
    return "upcoming" as const;
  }

  const resolvedStatus = getStatus(stop.status);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border-2",
            resolvedStatus === "completed" && "border-primary bg-primary/10",
            resolvedStatus === "current" && "border-primary bg-primary/10",
            resolvedStatus === "upcoming" && "border-muted-foreground/20 bg-muted",
          )}
        >
          <Icon
            className={cn(
              "size-3.5",
              resolvedStatus === "completed" && "text-primary",
              resolvedStatus === "current" && "text-primary",
              resolvedStatus === "upcoming" && "text-muted-foreground/50",
            )}
          />
        </div>
        {!isLast && <div className={cn("min-h-8 w-0.5 flex-1", statusLineClasses[stop.status])} />}
      </div>

      <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className={cn("font-medium text-sm", stop.status === "upcoming" && "text-muted-foreground")}>
                {stop.name}
              </span>
              {stop.status === "current" && (
                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-[10px] text-primary">
                  {t("routeCurrent")}
                </Badge>
              )}
            </div>
            <span className="text-muted-foreground text-xs">{stop.country}</span>
          </div>

          <div className="flex flex-col items-end gap-0.5 text-xs tabular-nums">
            {stop.departure && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span>{t("routeDeparted")}</span>
                <span className="text-foreground">{stop.departure}</span>
              </div>
            )}
            {stop.arrival && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span>{t("routeArrived")}</span>
                <span className="text-foreground">{stop.arrival}</span>
              </div>
            )}
            {!stop.arrival && !stop.departure && <span className="text-muted-foreground">{t("routePending")}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShipmentRouteTab({ shipment }: { shipment: Shipment }) {
  const t = useTranslations("logistics");
  const stops = getRouteStops(shipment);
  const ModeIcon = modeIcons[shipment.mode];

  const completedStops = stops.filter((s) => s.status === "completed").length;
  const currentStop = stops.find((s) => s.status === "current");

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <Card className="gap-2 p-3">
          <CardHeader className="p-0">
            <CardTitle className="font-normal text-muted-foreground text-xs">{t("routeTransportMode")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 p-0">
            <ModeIcon className="size-4 text-muted-foreground" />
            <span className="text-sm">{t(modeLabelKeys[shipment.mode])}</span>
          </CardContent>
        </Card>

        <Card className="gap-2 p-3">
          <CardHeader className="p-0">
            <CardTitle className="font-normal text-muted-foreground text-xs">{t("routeStopsLabel")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <span className="text-sm tabular-nums">
              {completedStops}/{stops.length}
            </span>
          </CardContent>
        </Card>

        <Card className="gap-2 p-3">
          <CardHeader className="p-0">
            <CardTitle className="font-normal text-muted-foreground text-xs">{t("routeCurrentLocation")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <span className="text-sm">{currentStop?.name ?? shipment.origin.display}</span>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex flex-col gap-1">
        <h3 className="mb-2 font-medium text-sm">{t("routeTimeline")}</h3>
        {stops.map((stop, index) => (
          <RouteStopItem
            key={`${stop.name}-${stop.countryCode}`}
            stop={stop}
            isLast={index === stops.length - 1}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}
