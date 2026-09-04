"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FeatureRow {
  feature: string;
  free: string;
  pro: string;
  team: string;
  enterprise: string;
}

interface FeatureCategory {
  title: string;
  rows: FeatureRow[];
}

interface PricingTranslations {
  back: string;
  title: string;
  subtitle: string;
  billingTitle: string;
  billingDescription: string;
  billingExample: string;
  planTiers: string;
  free: { name: string; price: string; period: string; features: string[]; note: string };
  pro: { name: string; from: string; price: string; period: string; features: { text: string; sub?: string }[] };
  team: { name: string; from: string; price: string; period: string; features: string[] };
  enterprise: { name: string; price: string; features: string[] };
  computeTitle: string;
  computeDescription: string;
  computeTable: { headers: string[]; rows: string[][] };
  computeNote: string;
  diskTitle: string;
  generalPurpose: string;
  highPerformance: string;
  diskFeatures: string[];
  addonsTitle: string;
  addonsTable: { headers: string[]; rows: string[][] };
  featureComparison: string;
  featureCategories: FeatureCategory[];
  faqTitle: string;
  faq: { question: string; answer: string }[];
}

const tocSections = [
  { id: "billing", labelKey: "billingTitle" as const },
  { id: "plans", labelKey: "planTiers" as const },
  { id: "compute", labelKey: "computeTitle" as const },
  { id: "disk", labelKey: "diskTitle" as const },
  { id: "addons", labelKey: "addonsTitle" as const },
  { id: "features", labelKey: "featureComparison" as const },
  { id: "faq", labelKey: "faqTitle" as const },
];

export function PricingPage({ t }: { t: PricingTranslations }) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("billing");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const headings = tocSections.map((s) => document.getElementById(s.id)).filter(Boolean);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    for (const el of headings) {
      if (el) observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="w-full max-w-6xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="size-8" onClick={() => router.back()}>
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Button>
        <div>
          <h1 className="font-semibold text-xl">{t.title}</h1>
          <p className="text-muted-foreground text-sm">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* TOC Sidebar */}
        <nav className="hidden w-48 shrink-0 lg:block">
          <div className="sticky top-8 space-y-1">
            {tocSections.map((section) => (
              <button
                type="button"
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t[section.labelKey] as string}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-10">
          {/* How Billing Works */}
          <section id="billing">
            <h2 className="mb-3 font-semibold text-lg">{t.billingTitle}</h2>
            <p className="mb-3 text-muted-foreground text-sm">{t.billingDescription}</p>
            <p className="text-muted-foreground text-sm">{t.billingExample}</p>
          </section>

          <Separator />

          {/* Plan Tiers */}
          <section id="plans">
            <h2 className="mb-6 font-semibold text-lg">{t.planTiers}</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card className="relative">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="font-semibold text-base text-foreground">{t.free.name}</span>
                    <Badge variant="secondary">Plano atual</Badge>
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold text-2xl text-foreground">{t.free.price}</span>
                    <span className="text-muted-foreground text-sm"> / {t.free.period}</span>
                  </div>
                  <Separator className="mb-4" />
                  <ul className="space-y-2.5">
                    {t.free.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-muted-foreground text-xs">{t.free.note}</p>
                </CardContent>
              </Card>

              <Card className="relative border-primary/50">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="font-semibold text-base text-foreground">{t.pro.name}</span>
                    <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/80">Mais popular</Badge>
                  </div>
                  <div className="mb-4">
                    <span className="text-muted-foreground text-sm">{t.pro.from} </span>
                    <span className="font-semibold text-2xl text-foreground">{t.pro.price}</span>
                    <span className="text-muted-foreground text-sm"> / {t.pro.period}</span>
                  </div>
                  <Separator className="mb-4" />
                  <ul className="space-y-2.5">
                    {t.pro.features.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
                        <div>
                          <span className="text-sm">{feature.text}</span>
                          {feature.sub && <p className="text-muted-foreground text-xs">{feature.sub}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

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
                  <Separator className="mb-4" />
                  <ul className="space-y-2.5">
                    {t.team.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardContent className="p-5">
                  <div className="mb-4">
                    <span className="font-semibold text-base text-foreground">{t.enterprise.name}</span>
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold text-2xl text-foreground">{t.enterprise.price}</span>
                  </div>
                  <Separator className="mb-4" />
                  <ul className="space-y-2.5">
                    {t.enterprise.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Compute Add-Ons */}
          <section id="compute">
            <h2 className="mb-3 font-semibold text-lg">{t.computeTitle}</h2>
            <p className="mb-4 text-muted-foreground text-sm">{t.computeDescription}</p>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {t.computeTable.headers.map((h) => (
                        <TableHead key={h}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {t.computeTable.rows.map((row) => (
                      <TableRow key={row[0]}>
                        {row.map((cell, i) => (
                          <TableCell key={`${row[0]}-${i}`} className={i === 0 ? "font-medium" : ""}>
                            {cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <p className="mt-3 text-muted-foreground text-xs">{t.computeNote}</p>
          </section>

          <Separator />

          {/* Disk Storage */}
          <section id="disk">
            <h2 className="mb-4 font-semibold text-lg">{t.diskTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-5">
                  <h3 className="mb-3 font-medium">{t.generalPurpose}</h3>
                  <ul className="space-y-2">
                    {t.diskFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <h3 className="mb-3 font-medium">{t.highPerformance}</h3>
                  <ul className="space-y-2">
                    {t.diskFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Add-Ons */}
          <section id="addons">
            <h2 className="mb-4 font-semibold text-lg">{t.addonsTitle}</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {t.addonsTable.headers.map((h) => (
                        <TableHead key={h}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {t.addonsTable.rows.map((row) => (
                      <TableRow key={row[0]}>
                        {row.map((cell, i) => (
                          <TableCell key={`${row[0]}-${i}`} className={i === 0 ? "font-medium" : ""}>
                            {cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Full Feature Comparison */}
          <section id="features">
            <h2 className="mb-6 font-semibold text-lg">{t.featureComparison}</h2>
            <div className="space-y-8">
              {t.featureCategories.map((category) => (
                <div key={category.title}>
                  <h3 className="mb-3 font-medium text-base">{category.title}</h3>
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[180px]">Feature</TableHead>
                            <TableHead>Free</TableHead>
                            <TableHead>Pro</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Enterprise</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {category.rows.map((row) => (
                            <TableRow key={row.feature}>
                              <TableCell className="font-medium">{row.feature}</TableCell>
                              <TableCell>{row.free}</TableCell>
                              <TableCell>{row.pro}</TableCell>
                              <TableCell>{row.team}</TableCell>
                              <TableCell>{row.enterprise}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* FAQ */}
          <section id="faq">
            <h2 className="mb-4 font-semibold text-lg">{t.faqTitle}</h2>
            <div className="space-y-4">
              {t.faq.map((item) => (
                <div key={item.question}>
                  <h3 className="mb-1 font-medium text-sm">{item.question}</h3>
                  <p className="text-muted-foreground text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
