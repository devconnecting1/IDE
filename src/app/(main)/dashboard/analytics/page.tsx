import { getTranslations } from "next-intl/server";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AcquisitionCampaigns } from "./_components/acquisition-campaigns";
import { AcquisitionChannelBreakdown } from "./_components/acquisition-channel-breakdown";
import { AcquisitionChannelPerformance } from "./_components/acquisition-channel-performance";
import { AcquisitionKpiStrip } from "./_components/acquisition-kpi-strip";
import { AcquisitionLandingPages } from "./_components/acquisition-landing-pages";
import { AnalyticsKpiStrip } from "./_components/analytics-kpi-strip";
import { AnalyticsToolbar } from "./_components/analytics-toolbar";
import { AudienceCountries } from "./_components/audience-countries";
import { AudienceDemographics } from "./_components/audience-demographics";
import { AudienceDevices } from "./_components/audience-devices";
import { AudienceGender } from "./_components/audience-gender";
import { AudienceNewVsReturning } from "./_components/audience-new-vs-returning";
import { ConversionsByChannel } from "./_components/conversions-by-channel";
import { ConversionsFunnel } from "./_components/conversions-funnel";
import { ConversionsKpiStrip } from "./_components/conversions-kpi-strip";
import { ConversionsRevenueOverTime } from "./_components/conversions-revenue-over-time";
import { ConversionsTopGoals } from "./_components/conversions-top-goals";
import { EngagementContent } from "./_components/engagement-content";
import { EngagementKpiStrip } from "./_components/engagement-kpi-strip";
import { EngagementPageViews } from "./_components/engagement-page-views";
import { EngagementSessionDepth } from "./_components/engagement-session-depth";
import { EngagementTopEvents } from "./_components/engagement-top-events";
import { RealtimeVisitors } from "./_components/realtime-visitors";
import { TopPages } from "./_components/top-pages";
import { TopTrafficSources } from "./_components/top-traffic-sources";
import { TrafficQuality } from "./_components/traffic-quality";

// Import this stylesheet in any page or component that renders country flag classes.
import "@/styles/flag-icons/flags.css";

export default async function Page() {
  const t = await getTranslations("analytics");

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">{t("greeting", { name: "Aiy" })}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="scrollbar-thin min-w-0 overflow-x-auto [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1">
            <TabsList className="gap-1">
              <TabsTrigger value="overview">{t("tabOverview")}</TabsTrigger>
              <TabsTrigger value="audience">{t("tabAudience")}</TabsTrigger>
              <TabsTrigger value="acquisition">{t("tabAcquisition")}</TabsTrigger>
              <TabsTrigger value="engagement">{t("tabEngagement")}</TabsTrigger>
              <TabsTrigger value="conversions">{t("tabConversions")}</TabsTrigger>
            </TabsList>
          </div>

          <AnalyticsToolbar />
        </div>

        <TabsContent value="overview" className="flex flex-col gap-4">
          <AnalyticsKpiStrip />

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TrafficQuality />
            </div>
            <div className="xl:col-span-5">
              <RealtimeVisitors />
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TopPages />
            </div>
            <div className="xl:col-span-5 xl:col-start-8">
              <TopTrafficSources />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <AudienceDemographics />
            </div>
            <div className="xl:col-span-5">
              <AudienceDevices />
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <AudienceNewVsReturning />
            </div>
            <div className="xl:col-span-5">
              <AudienceGender />
            </div>
          </div>

          <AudienceCountries />
        </TabsContent>

        <TabsContent value="acquisition" className="flex flex-col gap-4">
          <AcquisitionKpiStrip />

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <AcquisitionChannelPerformance />
            </div>
            <div className="xl:col-span-5">
              <AcquisitionChannelBreakdown />
            </div>
          </div>

          <AcquisitionLandingPages />

          <AcquisitionCampaigns />
        </TabsContent>

        <TabsContent value="engagement" className="flex flex-col gap-4">
          <EngagementKpiStrip />

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <EngagementPageViews />
            </div>
            <div className="xl:col-span-5">
              <EngagementSessionDepth />
            </div>
          </div>

          <EngagementContent />

          <EngagementTopEvents />
        </TabsContent>

        <TabsContent value="conversions" className="flex flex-col gap-4">
          <ConversionsKpiStrip />

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <ConversionsFunnel />
            </div>
            <div className="xl:col-span-5">
              <ConversionsRevenueOverTime />
            </div>
          </div>

          <ConversionsByChannel />

          <ConversionsTopGoals />
        </TabsContent>
      </Tabs>
    </div>
  );
}
