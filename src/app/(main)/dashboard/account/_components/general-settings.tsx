"use client";

import { type ChangeEvent, useMemo, useRef, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getInitials } from "@/lib/utils";

const CURRENCIES = ["BRL", "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "MXN"] as const;

const CURRENCY_PRECISIONS = ["0", "2", "3", "4"] as const;

const DATE_STYLES = ["full", "long", "medium", "short"] as const;

export function GeneralSettings() {
  const t = useTranslations("account");
  const locale = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [workspaceName, setWorkspaceName] = useState("Studio Admin");
  const [logo, setLogo] = useState("");
  const [subdomain, setSubdomain] = useState("studio-admin");
  const [customDomain, setCustomDomain] = useState("");
  const [updateTimestamp, setUpdateTimestamp] = useState(true);
  const [markReplied, setMarkReplied] = useState(true);
  const [reopenOnNew, setReopenOnNew] = useState(false);
  const [currency, setCurrency] = useState("BRL");
  const [currencyPrecision, setCurrencyPrecision] = useState("2");
  const [numberFormat, setNumberFormat] = useState("1.234,56");
  const [dateFormat, setDateFormat] = useState("short");
  const [timeFormat, setTimeFormat] = useState("24h");
  const [isDirty, setIsDirty] = useState(false);

  const dateFormatOptions = useMemo(
    () =>
      DATE_STYLES.map((style) => ({
        value: style,
        label: new Intl.DateTimeFormat(locale, { dateStyle: style }).format(new Date("2026-08-17T12:00:00Z")),
      })),
    [locale],
  );

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setIsDirty(true);
      setLogo(URL.createObjectURL(file));
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Workspace Identity */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-base">{t("workspaceIdentity")}</h3>
          <p className="mt-1 text-muted-foreground text-sm">{t("workspaceIdentityDescription")}</p>
        </CardContent>

        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("workspaceLogo")}</FieldLabel>
              <FieldDescription>{t("workspaceLogoDescription")}</FieldDescription>
            </FieldContent>
            <div className="flex items-center gap-2">
              <Avatar className="size-12 rounded-lg">
                <AvatarImage src={logo || undefined} alt={t("workspaceLogo")} />
                <AvatarFallback className="rounded-lg text-sm">{getInitials(workspaceName)}</AvatarFallback>
              </Avatar>
              <Button type="button" onClick={() => fileInputRef.current?.click()} size="sm" variant="outline">
                {t("uploadLogo")}
              </Button>
              <Button
                type="button"
                onClick={() => setLogo("")}
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
              >
                {t("removeLogo")}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
                onChange={handleLogoChange}
              />
            </div>
          </Field>
        </CardContent>

        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("workspaceName")}</FieldLabel>
              <FieldDescription>{t("workspaceNameDescription")}</FieldDescription>
            </FieldContent>
            <Input
              id="workspace-name"
              value={workspaceName}
              onChange={(event) => {
                setIsDirty(true);
                setWorkspaceName(event.target.value);
              }}
              className="w-72"
            />
          </Field>
        </CardContent>

        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("subdomain")}</FieldLabel>
              <FieldDescription>{t("subdomainDescription")}</FieldDescription>
            </FieldContent>
            <Input
              id="workspace-subdomain"
              value={subdomain}
              onChange={(event) => {
                setIsDirty(true);
                setSubdomain(event.target.value);
              }}
              className="w-72 font-mono"
            />
          </Field>
        </CardContent>

        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("customDomain")}</FieldLabel>
              <FieldDescription>{t("customDomainDescription")}</FieldDescription>
            </FieldContent>
            <Input
              id="workspace-custom-domain"
              value={customDomain}
              onChange={(event) => {
                setIsDirty(true);
                setCustomDomain(event.target.value);
              }}
              placeholder="crm.suaempresa.com"
              className="w-72 font-mono"
            />
          </Field>
        </CardContent>

        <CardFooter className="justify-end">
          <Button size="sm" disabled={!isDirty}>
            {t("save")}
          </Button>
        </CardFooter>
      </Card>

      {/* Behavior */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-base">{t("behavior")}</h3>
          <p className="mt-1 text-muted-foreground text-sm">{t("behaviorDescription")}</p>
        </CardContent>

        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("updateTimestampToggle")}</FieldLabel>
              <FieldDescription>{t("updateTimestampToggleDescription")}</FieldDescription>
            </FieldContent>
            <Switch
              checked={updateTimestamp}
              onCheckedChange={(checked) => {
                setIsDirty(true);
                setUpdateTimestamp(checked);
              }}
              aria-label={t("updateTimestampToggle")}
            />
          </Field>
        </CardContent>

        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("markRepliedToggle")}</FieldLabel>
              <FieldDescription>{t("markRepliedToggleDescription")}</FieldDescription>
            </FieldContent>
            <Switch
              checked={markReplied}
              onCheckedChange={(checked) => {
                setIsDirty(true);
                setMarkReplied(checked);
              }}
              aria-label={t("markRepliedToggle")}
            />
          </Field>
        </CardContent>

        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("reopenOnNewToggle")}</FieldLabel>
              <FieldDescription>{t("reopenOnNewToggleDescription")}</FieldDescription>
            </FieldContent>
            <Switch
              checked={reopenOnNew}
              onCheckedChange={(checked) => {
                setIsDirty(true);
                setReopenOnNew(checked);
              }}
              aria-label={t("reopenOnNewToggle")}
            />
          </Field>
        </CardContent>

        <CardFooter className="justify-end">
          <Button size="sm" disabled={!isDirty}>
            {t("save")}
          </Button>
        </CardFooter>
      </Card>

      {/* Defaults */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-base">{t("defaults")}</h3>
          <p className="mt-1 text-muted-foreground text-sm">{t("defaultsDescription")}</p>
        </CardContent>

        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("currency")}</FieldLabel>
              <FieldDescription>{t("currencyDescription")}</FieldDescription>
            </FieldContent>
            <Select
              value={currency}
              onValueChange={(value) => {
                setIsDirty(true);
                setCurrency(value);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>

        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("currencyPrecision")}</FieldLabel>
              <FieldDescription>{t("currencyPrecisionDescription")}</FieldDescription>
            </FieldContent>
            <Select
              value={currencyPrecision}
              onValueChange={(value) => {
                setIsDirty(true);
                setCurrencyPrecision(value);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_PRECISIONS.map((precision) => (
                  <SelectItem key={precision} value={precision}>
                    {precision}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>

        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("numberFormat")}</FieldLabel>
              <FieldDescription>{t("numberFormatDescription")}</FieldDescription>
            </FieldContent>
            <Select
              value={numberFormat}
              onValueChange={(value) => {
                setIsDirty(true);
                setNumberFormat(value);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.234,56">{t("formatNumberDotComma")}</SelectItem>
                <SelectItem value="1,234.56">{t("formatNumberCommaDot")}</SelectItem>
                <SelectItem value="1 234,56">{t("formatNumberSpaceComma")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </CardContent>

        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("dateFormat")}</FieldLabel>
              <FieldDescription>{t("dateFormatDescription")}</FieldDescription>
            </FieldContent>
            <Select
              value={dateFormat}
              onValueChange={(value) => {
                setIsDirty(true);
                setDateFormat(value);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateFormatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>

        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("timeFormat")}</FieldLabel>
              <FieldDescription>{t("timeFormatDescription")}</FieldDescription>
            </FieldContent>
            <Select
              value={timeFormat}
              onValueChange={(value) => {
                setIsDirty(true);
                setTimeFormat(value);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">{t("formatTime12h")}</SelectItem>
                <SelectItem value="24h">{t("formatTime24h")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
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
