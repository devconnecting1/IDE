"use client";

import { useLocale, useTranslations } from "next-intl";
import { siBarclays, siBitcoin, siEthereum, siHsbc, siRevolut } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

const walletCards = [
  {
    id: 1,
    bank: "Revolut Premium",
    last4: "4182",
    balance: 12450.6,
    icon: siRevolut,
    iconColor: "fill-foreground",
  },
  {
    id: 2,
    bank: "HSBC Bank",
    last4: "1004",
    balance: 3200.11,
    icon: siHsbc,
    iconColor: "fill-foreground",
  },

  {
    id: 4,
    bank: "Barclays Bank",
    last4: "9912",
    balance: 1450.0,
    icon: siBarclays,
    iconColor: "fill-foreground",
  },
];

const cryptoAssets = [
  {
    id: 1,
    name: "Bitcoin",
    vault: "Binance",
    balance: "0.42 BTC",
    usdValue: 24150.0,
    icon: siBitcoin,
  },
  {
    id: 2,
    name: "Ethereum",
    vault: "MetaMask",
    balance: "4.85 ETH",
    usdValue: 12420.1,
    icon: siEthereum,
  },
];

export function Wallet() {
  const t = useTranslations("finance");
  const locale = useLocale();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">{t("wallet")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {walletCards.map((card) => (
            <div key={card.id} className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm leading-none">
                    {card.bank} • **** {card.last4}
                  </span>
                </div>
                <span className="font-normal text-muted-foreground text-xs">
                  {formatCurrency(card.balance, {}, locale)}
                </span>
              </div>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background">
                <SimpleIcon icon={card.icon} />
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          {cryptoAssets.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm leading-none">
                    {asset.name} • {asset.vault}
                  </span>
                </div>
                <span className="font-normal text-muted-foreground text-xs">
                  {asset.balance} • {formatCurrency(asset.usdValue, {}, locale)}
                </span>
              </div>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background">
                <SimpleIcon icon={asset.icon} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-[10px] text-muted-foreground">
              {t("physicalVault")} <span className="text-foreground">Ledger Nano X</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="font-bold text-[9px] text-green-500 uppercase tracking-widest">{t("airGapped")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
