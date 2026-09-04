"use client";

import { useState } from "react";

import { Calendar, Code2, CreditCard, Hash, type LucideIcon, Mail, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface Integration {
  readonly id: string;
  readonly nameKey: string;
  readonly descriptionKey: string;
  readonly icon: LucideIcon;
  readonly connected: boolean;
}

const integrations: readonly Integration[] = [
  { id: "email", nameKey: "appEmail", descriptionKey: "appEmailDescription", icon: Mail, connected: true },
  { id: "calendar", nameKey: "appCalendar", descriptionKey: "appCalendarDescription", icon: Calendar, connected: true },
  { id: "slack", nameKey: "appSlack", descriptionKey: "appSlackDescription", icon: Hash, connected: false },
  { id: "github", nameKey: "appGithub", descriptionKey: "appGithubDescription", icon: Code2, connected: false },
  { id: "stripe", nameKey: "appStripe", descriptionKey: "appStripeDescription", icon: CreditCard, connected: false },
];

interface ApiKey {
  readonly id: string;
  readonly name: string;
  readonly value: string;
  readonly createdAt: string;
}

const initialKeys: readonly ApiKey[] = [
  { id: "1", name: "Produção", value: "sk_live_••••••••••••4f2a", createdAt: "12 ago 2026" },
  { id: "2", name: "Teste", value: "sk_test_••••••••••••9b1c", createdAt: "3 jul 2026" },
];

export function AppsSettings() {
  const t = useTranslations("account");
  const [connectedApps, setConnectedApps] = useState<Set<string>>(
    new Set(integrations.filter((app) => app.connected).map((app) => app.id)),
  );
  const [keys, setKeys] = useState<ApiKey[]>([...initialKeys]);
  const [newKeyName, setNewKeyName] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  function toggleApp(id: string) {
    setIsDirty(true);
    setConnectedApps((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleCreateKey() {
    const name = newKeyName.trim();
    if (!name) {
      return;
    }
    setIsDirty(true);
    setKeys((current) => [
      {
        id: crypto.randomUUID(),
        name,
        value: `sk_live_••••••••••••${Math.random().toString(36).slice(2, 6)}`,
        createdAt: "hoje",
      },
      ...current,
    ]);
    setNewKeyName("");
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Integrations */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-base">{t("integrations")}</h3>
          <p className="mt-1 text-muted-foreground text-sm">{t("integrationsDescription")}</p>
        </CardContent>
        {integrations.map((app) => {
          const Icon = app.icon;
          const isConnected = connectedApps.has(app.id);
          return (
            <CardContent key={app.id}>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel>{t(app.nameKey)}</FieldLabel>
                  <FieldDescription>{t(app.descriptionKey)}</FieldDescription>
                </FieldContent>
                <div className="flex items-center gap-2">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <Badge className={cn(isConnected && "border-green-600 text-green-600")} variant="outline">
                    {isConnected ? t("connected") : t("notConnected")}
                  </Badge>
                  <Switch
                    checked={isConnected}
                    onCheckedChange={() => toggleApp(app.id)}
                    aria-label={t(app.nameKey)}
                  />
                </div>
              </Field>
            </CardContent>
          );
        })}
      </Card>

      {/* API Keys */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-base">{t("apiKeys")}</h3>
          <p className="mt-1 text-muted-foreground text-sm">{t("apiKeysDescription")}</p>
        </CardContent>
        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("keyName")}</FieldLabel>
              <FieldDescription>{t("inviteLinkHint")}</FieldDescription>
            </FieldContent>
            <div className="flex items-center gap-2">
              <Input
                id="api-key-name"
                value={newKeyName}
                onChange={(event) => setNewKeyName(event.target.value)}
                placeholder={t("keyNamePlaceholder")}
                className="w-56"
              />
              <Button size="sm" onClick={handleCreateKey}>
                <Plus aria-hidden="true" />
                {t("createKey")}
              </Button>
            </div>
          </Field>
        </CardContent>
        {keys.map((key) => (
          <CardContent key={key.id}>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel className="font-mono">{key.value}</FieldLabel>
                <FieldDescription>
                  {key.name} · {key.createdAt}
                </FieldDescription>
              </FieldContent>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => navigator.clipboard?.writeText(key.value)}>
                  {t("copyKey")}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    setIsDirty(true);
                    setKeys((current) => current.filter((k) => k.id !== key.id));
                  }}
                >
                  <Trash2 aria-hidden="true" />
                  {t("revokeKey")}
                </Button>
              </div>
            </Field>
          </CardContent>
        ))}
      </Card>
    </div>
  );
}
