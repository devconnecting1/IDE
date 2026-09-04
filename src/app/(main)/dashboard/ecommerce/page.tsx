import { format } from "date-fns";
import { enUS, type Locale, ptBR } from "date-fns/locale";
import { Settings2 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { CustomerReviews } from "./_components/customer-reviews";
import { Inventory } from "./_components/inventory";
import { KpiStrip } from "./_components/kpi-strip";
import { RecentOrders } from "./_components/recent-orders";
import { StoreTraffic } from "./_components/store-traffic";
import { TopProducts } from "./_components/top-products";
import { TrafficSources } from "./_components/traffic-sources";

export default async function Page() {
  const t = await getTranslations("ecommerce");
  const locale = await getLocale();
  const dateFnsLocales: Record<string, Locale> = { "pt-BR": ptBR, en: enUS };
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy", {
    locale: dateFnsLocales[locale] ?? enUS,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>

        <div className="flex flex-wrap items-end justify-end gap-2 lg:w-fit">
          <Select defaultValue="this-month">
            <SelectTrigger className="w-34" id="ecommerce-period" size="sm">
              <SelectValue placeholder={t("periodPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="this-month">{t("periodThisMonth")}</SelectItem>
                <SelectItem value="last-month">{t("periodLastMonth")}</SelectItem>
                <SelectItem value="last-30-days">{t("periodLast30Days")}</SelectItem>
                <SelectItem value="year-to-date">{t("periodYearToDate")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select defaultValue="all-channels">
            <SelectTrigger className="w-40" id="ecommerce-channel" size="sm">
              <SelectValue placeholder={t("channelPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-channels">{t("channelAll")}</SelectItem>
                <SelectItem value="online-store">{t("channelOnlineStore")}</SelectItem>
                <SelectItem value="marketplace">{t("channelMarketplace")}</SelectItem>
                <SelectItem value="social">{t("channelSocial")}</SelectItem>
                <SelectItem value="retail">{t("channelRetail")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" />

          <Button aria-label={t("settings")} size="icon-sm" variant="outline">
            <Settings2 />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <KpiStrip />
        <div className="xl:col-span-5">
          <StoreTraffic />
        </div>
        <div className="xl:col-span-7">
          <TrafficSources />
        </div>
        <div className="xl:col-span-4">
          <TopProducts />
        </div>
        <div className="xl:col-span-4">
          <Inventory />
        </div>
        <div className="xl:col-span-4">
          <CustomerReviews />
        </div>
        <div className="xl:col-span-12">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
