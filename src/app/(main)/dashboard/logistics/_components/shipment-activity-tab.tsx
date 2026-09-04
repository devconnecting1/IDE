"use client";

import {
  ArrowRight,
  Bell,
  type CheckCircle2,
  FileText,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { getActivities, type Shipment, type ShipmentActivity } from "./shipment-data";

const activityIcons: Record<ShipmentActivity["type"], typeof CheckCircle2> = {
  status_change: Tag,
  location_update: MapPin,
  document_upload: FileText,
  handling_alert: Bell,
  customs_clearance: ShieldCheck,
  delivery_update: PackageCheck,
  departure: ArrowRight,
  arrival: Truck,
};

const activityIconBg: Record<ShipmentActivity["type"], string> = {
  status_change: "bg-primary/10",
  location_update: "bg-primary/10",
  document_upload: "bg-primary/10",
  handling_alert: "bg-primary/10",
  customs_clearance: "bg-primary/10",
  delivery_update: "bg-primary/10",
  departure: "bg-primary/10",
  arrival: "bg-primary/10",
};

const activityIconBorder: Record<ShipmentActivity["type"], string> = {
  status_change: "border-primary/20",
  location_update: "border-primary/20",
  document_upload: "border-primary/20",
  handling_alert: "border-primary/20",
  customs_clearance: "border-primary/20",
  delivery_update: "border-primary/20",
  departure: "border-primary/20",
  arrival: "border-primary/20",
};

function ActivityItem({
  activity,
  isLast,
  t,
}: {
  activity: ShipmentActivity;
  isLast: boolean;
  t: (key: string, params?: Record<string, string>) => string;
}) {
  const Icon = activityIcons[activity.type];

  const title = activity.titleParams ? t(activity.titleKey, activity.titleParams) : t(activity.titleKey);

  const description = activity.descParams ? t(activity.descKey, activity.descParams) : t(activity.descKey);

  const locationText = activity.locationKey ? t(activity.locationKey) : (activity.location ?? null);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border-2",
            activityIconBg[activity.type],
            activityIconBorder[activity.type],
          )}
        >
          <Icon className="size-3.5 text-primary" />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-border" />}
      </div>

      <div className={cn("flex-1 pb-5", isLast && "pb-0")}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm">{title}</span>
            <span className="text-muted-foreground text-xs leading-relaxed">{description}</span>
          </div>
          <span className="shrink-0 text-muted-foreground text-xs tabular-nums">{activity.timestamp}</span>
        </div>
        {locationText && (
          <div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
            <MapPin className="size-3" />
            {locationText}
          </div>
        )}
      </div>
    </div>
  );
}

export function ShipmentActivityTab({ shipment }: { shipment: Shipment }) {
  const t = useTranslations("logistics");
  const locale = useLocale();
  const activities = getActivities(shipment, locale);

  const statusChanges = activities.filter((a) => a.type === "status_change").length;
  const alerts = activities.filter((a) => a.type === "handling_alert" || a.type === "customs_clearance").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <Card className="gap-2 p-3">
          <CardHeader className="p-0">
            <CardTitle className="font-normal text-muted-foreground text-xs">{t("activityTotal")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <span className="text-sm tabular-nums">{activities.length}</span>
          </CardContent>
        </Card>

        <Card className="gap-2 p-3">
          <CardHeader className="p-0">
            <CardTitle className="font-normal text-muted-foreground text-xs">{t("activityStatusChanges")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <span className="text-sm tabular-nums">{statusChanges}</span>
          </CardContent>
        </Card>

        <Card className="gap-2 p-3">
          <CardHeader className="p-0">
            <CardTitle className="font-normal text-muted-foreground text-xs">{t("activityAlerts")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <span className="text-sm tabular-nums">{alerts}</span>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex flex-col gap-1">
        <h3 className="mb-2 font-medium text-sm">{t("activityTimeline")}</h3>
        {activities.map((activity, index) => (
          <ActivityItem key={activity.id} activity={activity} isLast={index === activities.length - 1} t={t} />
        ))}
      </div>
    </div>
  );
}
