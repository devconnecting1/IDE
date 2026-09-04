"use client";

import { useState } from "react";

import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface DashboardAction {
  readonly id: string;
  label: string;
  route: string;
  newTab: boolean;
  hidden: boolean;
}

const initialActions: DashboardAction[] = [
  { id: "1", label: "Início", route: "/dashboard/default", newTab: false, hidden: false },
  { id: "2", label: "CRM", route: "/dashboard/crm", newTab: false, hidden: false },
  { id: "3", label: "Finance", route: "/dashboard/finance", newTab: false, hidden: true },
  { id: "4", label: "Separador", route: "", newTab: false, hidden: false },
];

export function LayoutSettings() {
  const t = useTranslations("account");
  const [actions, setActions] = useState<DashboardAction[]>(initialActions);
  const [isDirty, setIsDirty] = useState(false);

  function updateAction(id: string, patch: Partial<DashboardAction>) {
    setIsDirty(true);
    setActions((current) => current.map((action) => (action.id === id ? { ...action, ...patch } : action)));
  }

  function addAction() {
    setIsDirty(true);
    setActions((current) => [
      ...current,
      { id: crypto.randomUUID(), label: t("newShortcut"), route: "/dashboard/", newTab: false, hidden: false },
    ]);
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <Card>
        <CardContent>
          <h3 className="font-medium text-base">{t("homeActions")}</h3>
          <p className="mt-1 text-muted-foreground text-sm">{t("homeActionsDescription")}</p>
        </CardContent>
        {actions.map((action) => (
          <CardContent key={action.id}>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel>{action.label || t("actionLabel")}</FieldLabel>
                <FieldDescription className="font-mono text-xs">{action.route || "/"}</FieldDescription>
              </FieldContent>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  id={`action-label-${action.id}`}
                  value={action.label}
                  onChange={(event) => updateAction(action.id, { label: event.target.value })}
                  placeholder={t("actionLabel")}
                  className="w-36"
                />
                <Input
                  id={`action-route-${action.id}`}
                  value={action.route}
                  onChange={(event) => updateAction(action.id, { route: event.target.value })}
                  placeholder={t("actionRoute")}
                  className="w-44 font-mono"
                />
                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={action.newTab}
                    onCheckedChange={(checked) => updateAction(action.id, { newTab: checked })}
                    aria-label={t("openNewTab")}
                  />
                  <span className="text-muted-foreground text-xs">{t("openNewTab")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={action.hidden}
                    onCheckedChange={(checked) => updateAction(action.id, { hidden: checked })}
                    aria-label={t("hiddenToggle")}
                  />
                  <span className="text-muted-foreground text-xs">{t("hiddenToggle")}</span>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={t("removeAction")}
                  onClick={() => {
                    setIsDirty(true);
                    setActions((current) => current.filter((a) => a.id !== action.id));
                  }}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </Field>
          </CardContent>
        ))}
        <CardContent>
          <Button size="sm" variant="outline" onClick={addAction}>
            <Plus aria-hidden="true" />
            {t("addAction")}
          </Button>
        </CardContent>
        <CardFooter className="justify-end">
          <Button size="sm" disabled={!isDirty}>
            {t("save")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
