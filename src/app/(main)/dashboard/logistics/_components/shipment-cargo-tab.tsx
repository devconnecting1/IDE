"use client";

import { AlertTriangleIcon, Box, Scale, ShieldCheck, Tag } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { Shipment } from "./shipment-data";

const handlingSeverity: Record<string, "default" | "warn" | "critical"> = {
  handlingFragileElectronics: "warn",
  handlingHeavyMachinery: "default",
  handlingTemperatureControlled: "critical",
  handlingStandardFreight: "default",
  handlingSensitiveMedicalEquipment: "critical",
  handlingHeavyBulkCargo: "default",
  handlingIndustrialParts: "default",
  handlingHighValueFragileCargo: "critical",
  handlingFoodGrade: "critical",
  handlingPerishableGoods: "critical",
  handlingHighValueCargo: "warn",
  handlingMoistureSensitiveCargo: "warn",
  handlingStandardPalletizedFreight: "default",
  handlingFragileBulkyGoods: "warn",
  handlingHighValuePrecisionCargo: "warn",
  handlingHazardousMaterialsReview: "critical",
};

const severityClasses = {
  default: "border-muted bg-muted/50",
  warn: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950",
  critical: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950",
};

const severityTextClasses = {
  default: "text-muted-foreground",
  warn: "text-amber-900 dark:text-amber-50",
  critical: "text-red-900 dark:text-red-50",
};

const severityBadgeClasses = {
  default: "border-muted bg-muted/50 text-muted-foreground",
  warn: "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900 dark:text-amber-200",
  critical: "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-200",
};

export function ShipmentCargoTab({ shipment }: { shipment: Shipment }) {
  const t = useTranslations("logistics");
  const severity = handlingSeverity[shipment.handling.labelKey] ?? "default";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <Card className="gap-2 p-3">
          <CardHeader className="p-0">
            <CardTitle className="font-normal text-muted-foreground text-xs">{t("cargoType")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 p-0">
            <Box className="size-4 text-muted-foreground" />
            <span className="text-sm">{t(shipment.cargoKey)}</span>
          </CardContent>
        </Card>

        <Card className="gap-2 p-3">
          <CardHeader className="p-0">
            <CardTitle className="font-normal text-muted-foreground text-xs">{t("totalWeight")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 p-0">
            <Scale className="size-4 text-muted-foreground" />
            <span className="text-sm tabular-nums">{shipment.weight}</span>
          </CardContent>
        </Card>

        <Card className="gap-2 p-3">
          <CardHeader className="p-0">
            <CardTitle className="font-normal text-muted-foreground text-xs">{t("cargoHandlingLevel")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Badge variant="outline" className={cn("gap-1.5", severityBadgeClasses[severity])}>
              <ShieldCheck className="size-3" />
              {t(shipment.handling.labelKey)}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Alert className={cn("gap-3", severityClasses[severity])}>
        <AlertTriangleIcon className={cn("size-4", severityTextClasses[severity])} />
        <div className="flex flex-col gap-2">
          <AlertTitle className={cn("text-sm", severityTextClasses[severity])}>
            {t(shipment.handling.labelKey)}
          </AlertTitle>
          <AlertDescription className={cn("text-xs leading-relaxed", severityTextClasses[severity])}>
            {t(shipment.handling.noteKey)}
          </AlertDescription>
        </div>
      </Alert>

      <Separator />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Tag className="size-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">{t("cargoHandlingTags")}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {shipment.handling.tags.map(({ icon: TagIcon, labelKey }) => (
            <Badge key={labelKey} variant="outline" className="gap-1.5">
              <TagIcon data-icon="inline-start" />
              {t(labelKey)}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">{t("cargoRequirements")}</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            {t("cargoOrigin")}: <span className="text-foreground">{shipment.origin.display}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            {t("cargoDestination")}: <span className="text-foreground">{shipment.destination.display}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
