"use client";

import { Check, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface PlanTranslations {
  title: string;
  pricing: string;
  currentPlan: string;
  mostPopular: string;
  upgradeTo: string;
  contactUs: string;
  free: {
    name: string;
    price: string;
    period: string;
    features: string[];
    note: string;
  };
  pro: {
    name: string;
    from: string;
    price: string;
    period: string;
    features: { text: string; sub?: string }[];
  };
  team: {
    name: string;
    from: string;
    price: string;
    period: string;
    features: { text: string; sub?: string }[];
  };
  enterprise: {
    name: string;
    description: string;
    features: string[];
  };
}

interface PlanUpgradeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgName: string;
  t: PlanTranslations;
}

function CheckIcon() {
  return (
    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
      <Check className="size-3 text-primary" aria-hidden="true" />
    </div>
  );
}

export function PlanUpgradeSheet({ open, onOpenChange, orgName, t }: PlanUpgradeSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="!max-sm:!w-full sm:!w-[80vw] sm:!max-w-none !max-sm:inset-0 !max-sm:h-full w-full !max-sm:rounded-none !max-sm:border-0"
      >
        <SheetHeader className="flex-row items-center justify-between border-b px-6 py-4 pr-14">
          <SheetTitle>
            {t.title} {orgName}
          </SheetTitle>
          <Button variant="outline" size="sm" asChild>
            <a href="/pricing">
              <ExternalLink className="mr-2 size-4" aria-hidden="true" />
              {t.pricing}
            </a>
          </Button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Plans Grid */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {/* Free Plan */}
            <Card className="relative">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <span className="font-semibold text-base text-foreground">{t.free.name}</span>
                  <Badge variant="secondary">{t.currentPlan}</Badge>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-2xl text-foreground">{t.free.price}</span>
                  <span className="text-muted-foreground text-sm"> / {t.free.period}</span>
                </div>
                <Button variant="outline" className="mb-5 w-full" disabled>
                  {t.currentPlan}
                </Button>
                <Separator className="mb-5" />
                <ul className="space-y-3">
                  {t.free.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckIcon />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-muted-foreground text-xs">{t.free.note}</p>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-primary/50">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <span className="font-semibold text-base text-foreground">{t.pro.name}</span>
                  <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/80">{t.mostPopular}</Badge>
                </div>
                <div className="mb-4">
                  <span className="text-muted-foreground text-sm">{t.pro.from} </span>
                  <span className="font-semibold text-2xl text-foreground">{t.pro.price}</span>
                  <span className="text-muted-foreground text-sm"> / {t.pro.period}</span>
                </div>
                <Button className="mb-5 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {t.upgradeTo} {t.pro.name}
                </Button>
                <Separator className="mb-5" />
                <ul className="space-y-3">
                  {t.pro.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-2">
                      <CheckIcon />
                      <div>
                        <span className="text-sm">{feature.text}</span>
                        {feature.sub && <p className="text-muted-foreground text-xs">{feature.sub}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Team Plan */}
            <Card className="relative">
              <CardContent className="p-5">
                <div className="mb-4">
                  <span className="font-semibold text-base text-foreground">{t.team.name}</span>
                </div>
                <div className="mb-4">
                  <span className="text-muted-foreground text-sm">{t.team.from} </span>
                  <span className="font-semibold text-2xl text-foreground">{t.team.price}</span>
                  <span className="text-muted-foreground text-sm"> / {t.team.period}</span>
                </div>
                <Button variant="outline" className="mb-5 w-full">
                  {t.upgradeTo} {t.team.name}
                </Button>
                <Separator className="mb-5" />
                <ul className="space-y-3">
                  {t.team.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-2">
                      <CheckIcon />
                      <div>
                        <span className="text-sm">{feature.text}</span>
                        {feature.sub && <p className="text-muted-foreground text-xs">{feature.sub}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Enterprise Section */}
          <Card className="border-muted-foreground/20">
            <CardContent className="p-5">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className="font-semibold text-base text-foreground">{t.enterprise.name}</span>
                  <p className="mt-1 max-w-xs text-muted-foreground text-sm">{t.enterprise.description}</p>
                  <Button variant="outline" className="mt-4">
                    {t.contactUs}
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {t.enterprise.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <CheckIcon />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
