"use client";

import { AlertTriangleIcon, CheckCircle2, Clock, Download, FileText, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import {
  categoryLabelKeys,
  getDocuments,
  type Shipment,
  type ShipmentDocument,
  statusLabelKeysDocs,
} from "./shipment-data";

const statusIcons: Record<ShipmentDocument["status"], typeof CheckCircle2> = {
  uploaded: CheckCircle2,
  pending: Clock,
  expired: XCircle,
  required: AlertTriangleIcon,
};

const statusBadgeClasses: Record<ShipmentDocument["status"], string> = {
  uploaded: "border-green-600/20 bg-green-600/10 text-green-600",
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  expired: "border-destructive/20 bg-destructive/10 text-destructive",
  required: "border-muted bg-muted/50 text-muted-foreground",
};

function DocumentRow({ doc, t }: { doc: ShipmentDocument; t: (key: string) => string }) {
  const StatusIcon = statusIcons[doc.status];

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <FileText className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium text-sm">{t(doc.nameKey)}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <span>{t(categoryLabelKeys[doc.category])}</span>
          <span>·</span>
          <span>{doc.fileFormat}</span>
          {doc.size && (
            <>
              <span>·</span>
              <span>{doc.size}</span>
            </>
          )}
        </div>
      </div>

      <Badge variant="outline" className={cn("shrink-0 gap-1.5", statusBadgeClasses[doc.status])}>
        <StatusIcon className="size-3" />
        {t(statusLabelKeysDocs[doc.status])}
      </Badge>

      {doc.status === "uploaded" && (
        <Button variant="ghost" size="icon-sm" className="shrink-0">
          <Download className="size-4" />
        </Button>
      )}
    </div>
  );
}

export function ShipmentDocumentsTab({ shipment }: { shipment: Shipment }) {
  const t = useTranslations("logistics");
  const documents = getDocuments(shipment);

  const uploaded = documents.filter((d) => d.status === "uploaded").length;
  const pending = documents.filter((d) => d.status === "pending").length;
  const required = documents.filter((d) => d.status === "required").length;
  const expired = documents.filter((d) => d.status === "expired").length;

  const categories = [...new Set(documents.map((d) => d.category))];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-3">
        <Card className="gap-2 p-3">
          <CardHeader className="p-0">
            <CardTitle className="font-normal text-muted-foreground text-xs">{t("docTotal")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <span className="text-sm tabular-nums">{documents.length}</span>
          </CardContent>
        </Card>

        <Card className="gap-2 p-3">
          <CardHeader className="p-0">
            <CardTitle className="font-normal text-green-600 text-xs">{t("docUploaded")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <span className="text-sm tabular-nums">{uploaded}</span>
          </CardContent>
        </Card>

        <Card className="gap-2 p-3">
          <CardHeader className="p-0">
            <CardTitle className="font-normal text-amber-600 text-xs dark:text-amber-400">{t("docPending")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <span className="text-sm tabular-nums">{pending + required}</span>
          </CardContent>
        </Card>

        {expired > 0 && (
          <Card className="gap-2 p-3">
            <CardHeader className="p-0">
              <CardTitle className="font-normal text-destructive text-xs">{t("docExpired")}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <span className="text-sm tabular-nums">{expired}</span>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      {categories.map((category) => {
        const categoryDocs = documents.filter((d) => d.category === category);
        return (
          <div key={category} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm">{t(categoryLabelKeys[category])}</h3>
              <Badge variant="secondary" className="text-[10px] tabular-nums">
                {categoryDocs.length}
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              {categoryDocs.map((doc) => (
                <DocumentRow key={doc.id} doc={doc} t={t} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
