"use client";

import {
  Banknote,
  ChevronRight,
  Droplet,
  History,
  Lightbulb,
  MoreHorizontal,
  QrCode,
  SendHorizontal,
  Smartphone,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

const contacts = [
  { id: 1, initials: "AR" },
  { id: 2, initials: "SC" },
  { id: 3, initials: "MJ" },
  { id: 4, initials: "ED" },
];

const shortcutIcons = [
  QrCode,
  SendHorizontal,
  Banknote,
  History,
  Smartphone,
  Lightbulb,
  Droplet,
  MoreHorizontal,
] as const;

export function QuickActions() {
  const t = useTranslations("finance");

  const shortcuts = [
    { id: 1, label: t("shortcutScanQr"), icon: shortcutIcons[0] },
    { id: 2, label: t("shortcutTransfer"), icon: shortcutIcons[1] },
    { id: 3, label: t("shortcutPayBills"), icon: shortcutIcons[2] },
    { id: 4, label: t("shortcutHistory"), icon: shortcutIcons[3] },
    { id: 5, label: t("shortcutMobile"), icon: shortcutIcons[4] },
    { id: 6, label: t("shortcutElectricity"), icon: shortcutIcons[5] },
    { id: 7, label: t("shortcutWater"), icon: shortcutIcons[6] },
    { id: 8, label: t("shortcutMore"), icon: shortcutIcons[7] },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-normal">{t("quickTransfer")}</CardTitle>
          <CardAction>
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {contacts.map((contact) => (
                  <Avatar key={contact.id} className="size-7 border-2 border-background">
                    <AvatarFallback className="text-[10px]">{contact.initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <ChevronRight className="size-4" />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Field orientation="horizontal">
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>R$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput placeholder={t("quickAmountPlaceholder")} />
              <InputGroupAddon align="inline-end">
                <InputGroupText>BRL</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <Button>{t("send")}</Button>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal">{t("shortcuts")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <div key={shortcut.id} className="flex flex-col items-center gap-2.5">
                  <Button variant="outline" className="size-12 rounded-full">
                    <Icon className="size-5" />
                  </Button>
                  <span className="text-center text-muted-foreground text-xs">{shortcut.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
