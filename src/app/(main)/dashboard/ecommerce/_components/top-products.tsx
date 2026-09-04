import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

const categories = [
  {
    categoryKey: "categoryApparel",
    share: 44,
    color: "var(--chart-3)",
  },
  {
    categoryKey: "categoryAccessories",
    share: 32,
    color: "var(--chart-2)",
  },
  {
    categoryKey: "categoryHome",
    share: 24,
    color: "var(--chart-1)",
  },
] as const;

const products = [
  {
    name: "Linen Overshirt",
    categoryKey: "categoryApparel",
    share: "31%",
    sales: 14820,
  },
  {
    name: "Everyday Tote",
    categoryKey: "categoryAccessories",
    share: "24%",
    sales: 11460,
  },
  {
    name: "Ceramic Planter",
    categoryKey: "categoryHome",
    share: "18%",
    sales: 8930,
  },
] as const;

export async function TopProducts() {
  const t = await getTranslations("ecommerce");
  const locale = await getLocale();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">{t("topProducts")}</CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          {t("ofSales", { percent: "73%" })}
        </CardDescription>
        <CardAction>
          <ArrowUpRight className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div aria-label={t("salesByCategory")} className="flex h-2 gap-1 overflow-hidden bg-muted" role="img">
            {categories.map((category) => (
              <div
                aria-hidden="true"
                key={category.categoryKey}
                className="rounded-md"
                style={{
                  backgroundColor: category.color,
                  width: `${category.share}%`,
                }}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <div className="flex items-center gap-1" key={category.categoryKey}>
                <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-muted-foreground text-xs">{t(category.categoryKey)}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-3">
          <div className="text-muted-foreground text-xs">{t("productsHeader")}</div>
          <div className="text-muted-foreground text-xs">{t("shareHeader")}</div>
          <div className="text-muted-foreground text-xs">{t("salesHeader")}</div>

          {products.map((product) => (
            <div className="contents text-sm" key={product.name}>
              <div className="min-w-0">
                <div className="truncate font-medium">{product.name}</div>
                <div className="text-muted-foreground text-xs">{t(product.categoryKey)}</div>
              </div>
              <div className="self-center text-muted-foreground tabular-nums">{product.share}</div>
              <div className="self-center font-medium tabular-nums">
                {formatCurrency(product.sales, { noDecimals: true }, locale)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
