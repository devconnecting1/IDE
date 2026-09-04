"use client";

import { Banknote, FilePlus2, Plus, Wallet as WalletIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const optionIcons = { bank: Banknote, crypto: WalletIcon, manual: FilePlus2 } as const;

export function AddAccountCard() {
  const t = useTranslations("finance");
  const options = [
    { id: "bank", label: t("addAccountConnectBank"), icon: "bank" as const },
    { id: "crypto", label: t("addAccountCryptoWallet"), icon: "crypto" as const },
    { id: "manual", label: t("addAccountManual"), icon: "manual" as const },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">{t("addAccountTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-muted-foreground text-sm">{t("addAccountDescription")}</p>
        <div className="grid grid-cols-3 gap-2.5">
          {options.map((option) => {
            const Icon = optionIcons[option.icon];
            return (
              <div key={option.id} className="flex flex-col items-center gap-2">
                <Button variant="outline" className="size-12 rounded-full" aria-label={option.label}>
                  <Icon aria-hidden="true" className="size-5" />
                </Button>
                <span className="text-center text-muted-foreground text-xs">{option.label}</span>
              </div>
            );
          })}
        </div>
        <Button variant="outline" className="mt-auto justify-center">
          <Plus data-icon="inline-start" />
          {t("addAccountNew")}
        </Button>
      </CardContent>
    </Card>
  );
}
