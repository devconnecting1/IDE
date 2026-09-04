import type { ChartConfig } from "@/components/ui/chart";

import type { RecentLeadRow } from "./recent-leads-table/schema";

type LabeledChartConfigEntry = ChartConfig[string] & { labelKey?: string };

type LabeledChartConfig = Record<string, LabeledChartConfigEntry>;

export function resolveChartConfig(config: LabeledChartConfig, t: (key: string) => string): ChartConfig {
  return Object.fromEntries(
    Object.entries(config).map(([key, entry]) => [
      key,
      entry.labelKey ? { ...entry, label: t(entry.labelKey) } : entry,
    ]),
  );
}

export const leadsChartData = [
  { date: "1-5", newLeads: 120, disqualified: 40 },
  { date: "6-10", newLeads: 95, disqualified: 30 },
  { date: "11-15", newLeads: 60, disqualified: 22 },
  { date: "16-20", newLeads: 100, disqualified: 35 },
  { date: "21-25", newLeads: 150, disqualified: 70 },
  { date: "26-30", newLeads: 110, disqualified: 60 },
];

export const leadsChartConfig = {
  newLeads: {
    label: "New Leads",
    labelKey: "newLeads",
    color: "var(--chart-1)",
  },
  disqualified: {
    label: "Disqualified",
    labelKey: "disqualified",
    color: "var(--chart-3)",
  },
  background: {
    color: "var(--primary)",
  },
} satisfies LabeledChartConfig;

export const proposalsChartData = [
  { date: "1-5", proposalsSent: 9 },
  { date: "6-10", proposalsSent: 16 },
  { date: "11-15", proposalsSent: 6 },
  { date: "16-20", proposalsSent: 18 },
  { date: "21-25", proposalsSent: 11 },
  { date: "26-30", proposalsSent: 14 },
];

export const proposalsChartConfig = {
  proposalsSent: {
    label: "Proposals Sent",
    labelKey: "proposalsSent",
    color: "var(--chart-1)",
  },
} satisfies LabeledChartConfig;

export const revenueChartData = [
  { date: "2024-07-01", revenue: 6700 },
  { date: "2024-08-01", revenue: 7100 },
  { date: "2024-09-01", revenue: 6850 },
  { date: "2024-10-01", revenue: 7500 },
  { date: "2024-11-01", revenue: 8000 },
  { date: "2024-12-01", revenue: 8300 },
  { date: "2025-01-01", revenue: 7900 },
  { date: "2025-02-01", revenue: 8400 },
  { date: "2025-03-01", revenue: 8950 },
  { date: "2025-04-01", revenue: 9700 },
  { date: "2025-05-01", revenue: 11200 },
  { date: "2025-06-01", revenue: 9500 },
];

export const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    labelKey: "revenue",
    color: "var(--chart-1)",
  },
} satisfies LabeledChartConfig;

export const leadsBySourceChartData = [
  { source: "website", leads: 170, fill: "var(--color-website)" },
  { source: "referral", leads: 105, fill: "var(--color-referral)" },
  { source: "social", leads: 90, fill: "var(--color-social)" },
  { source: "cold", leads: 62, fill: "var(--color-cold)" },
  { source: "other", leads: 48, fill: "var(--color-other)" },
];

export const leadsBySourceChartConfig = {
  leads: {
    label: "Leads",
    labelKey: "leads",
  },
  website: {
    label: "Website",
    labelKey: "sourceWebsite",
    color: "var(--chart-1)",
  },
  referral: {
    label: "Referral",
    labelKey: "sourceReferral",
    color: "var(--chart-2)",
  },
  social: {
    label: "Social Media",
    labelKey: "sourceSocialMedia",
    color: "var(--chart-3)",
  },
  cold: {
    label: "Cold Outreach",
    labelKey: "sourceColdOutreach",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    labelKey: "sourceOther",
    color: "var(--chart-5)",
  },
} satisfies LabeledChartConfig;

export const projectRevenueChartData = [
  { name: "MVP Development", labelKey: "projectMvpDevelopment", actual: 82000, target: 90000 },
  { name: "Consultation", labelKey: "projectConsultation", actual: 48000, target: 65000 },
  { name: "Framer Sites", labelKey: "projectFramerSites", actual: 34000, target: 45000 },
  { name: "DevOps Support", labelKey: "projectDevOpsSupport", actual: 77000, target: 90000 },
  { name: "LLM Training", labelKey: "projectLlmTraining", actual: 68000, target: 80000 },
  { name: "Product Launch", labelKey: "projectProductLaunch", actual: 52000, target: 70000 },
].map((row) => ({
  ...row,
  remaining: Math.max(0, row.target - row.actual),
}));

export const projectRevenueChartConfig = {
  actual: {
    label: "Actual",
    labelKey: "actual",
    color: "var(--chart-1)",
  },
  remaining: {
    label: "Remaining",
    labelKey: "remaining",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--primary-foreground)",
  },
} satisfies LabeledChartConfig;

export const salesPipelineChartData = [
  { stage: "Leads", labelKey: "stageLeads", value: 680, fill: "var(--chart-1)" },
  { stage: "Qualified", labelKey: "stageQualified", value: 480, fill: "var(--chart-2)" },
  { stage: "Proposal Sent", labelKey: "stageProposalSent", value: 210, fill: "var(--chart-3)" },
  { stage: "Negotiation", labelKey: "stageNegotiation", value: 120, fill: "var(--chart-4)" },
  { stage: "Won", labelKey: "stageWon", value: 45, fill: "var(--chart-5)" },
];

export const salesPipelineChartConfig = {
  value: {
    label: "Leads",
    labelKey: "leads",
    color: "var(--chart-1)",
  },
  stage: {
    label: "Stage",
    labelKey: "stage",
  },
} satisfies LabeledChartConfig;

export const regionSalesData = [
  {
    region: "North America",
    labelKey: "regionNorthAmerica",
    sales: 37800,
    percentage: 31,
    growth: "-3.2%",
    isPositive: false,
  },
  {
    region: "Europe",
    labelKey: "regionEurope",
    sales: 40100,
    percentage: 34,
    growth: "+9.4%",
    isPositive: true,
  },
  {
    region: "Asia Pacific",
    labelKey: "regionAsiaPacific",
    sales: 30950,
    percentage: 26,
    growth: "+12.8%",
    isPositive: true,
  },
  {
    region: "Latin America",
    labelKey: "regionLatinAmerica",
    sales: 12200,
    percentage: 7,
    growth: "-1.7%",
    isPositive: false,
  },
  {
    region: "Middle East & Africa",
    labelKey: "regionMiddleEastAfrica",
    sales: 2450,
    percentage: 2,
    growth: "+6.0%",
    isPositive: true,
  },
];

export const actionItems = [
  {
    id: 1,
    titleKey: "actionKickoffTitle",
    descKey: "actionKickoffDesc",
    due: "Due today",
    dueLabelKey: "dueToday",
    priority: "High",
    priorityLabelKey: "priorityHigh",
    priorityColor: "bg-red-100 text-red-700",
    checked: false,
  },
  {
    id: 2,
    titleKey: "actionDemoTitle",
    descKey: "actionDemoDesc",
    due: "Due tomorrow",
    dueLabelKey: "dueTomorrow",
    priority: "Medium",
    priorityLabelKey: "priorityMedium",
    priorityColor: "bg-yellow-100 text-yellow-700",
    checked: true,
  },
  {
    id: 3,
    titleKey: "actionCaseStudyTitle",
    descKey: "actionCaseStudyDesc",
    due: "Due this week",
    dueLabelKey: "dueThisWeek",
    priority: "Low",
    priorityLabelKey: "priorityLow",
    priorityColor: "bg-green-100 text-green-700",
    checked: false,
  },
];

export const recentLeadsData: RecentLeadRow[] = [
  {
    id: "L-1012",
    name: "Guillermo Rauch",
    company: "Vercel",
    status: "Qualified",
    source: "Website",
    lastActivityValue: 30,
    lastActivityUnit: "minutes",
  },
  {
    id: "L-1018",
    name: "Nizzy",
    company: "Mail0",
    status: "Qualified",
    source: "Website",
    lastActivityValue: 35,
    lastActivityUnit: "minutes",
  },
  {
    id: "L-1005",
    name: "Sahaj",
    company: "Tweakcn",
    status: "Negotiation",
    source: "Website",
    lastActivityValue: 1,
    lastActivityUnit: "hours",
  },
  {
    id: "L-1001",
    name: "Shadcn",
    company: "Shadcn/ui",
    status: "Qualified",
    source: "Website",
    lastActivityValue: 2,
    lastActivityUnit: "hours",
  },
  {
    id: "L-1003",
    name: "Sam Altman",
    company: "OpenAI",
    status: "Proposal Sent",
    source: "Social Media",
    lastActivityValue: 4,
    lastActivityUnit: "hours",
  },
  {
    id: "L-1008",
    name: "Michael Andreuzza",
    company: "Lexington Themes",
    status: "Contacted",
    source: "Social Media",
    lastActivityValue: 5,
    lastActivityUnit: "hours",
  },
  {
    id: "L-1016",
    name: "Skyleen",
    company: "Animate UI",
    status: "Proposal Sent",
    source: "Referral",
    lastActivityValue: 7,
    lastActivityUnit: "hours",
  },
  {
    id: "L-1007",
    name: "Matheus Moraes",
    company: "Weblabs Studio",
    status: "Won",
    source: "Website",
    lastActivityValue: 6,
    lastActivityUnit: "hours",
  },
  {
    id: "L-1011",
    name: "Sebastian Rindom",
    company: "Medusa",
    status: "Proposal Sent",
    source: "Referral",
    lastActivityValue: 10,
    lastActivityUnit: "hours",
  },
  {
    id: "L-1014",
    name: "Fred K. Schott",
    company: "Astro",
    status: "Contacted",
    source: "Social Media",
    lastActivityValue: 12,
    lastActivityUnit: "hours",
  },
  {
    id: "L-1010",
    name: "Peer Richelsen",
    company: "Cal.com",
    status: "New",
    source: "Other",
    lastActivityValue: 8,
    lastActivityUnit: "hours",
  },
  {
    id: "L-1002",
    name: "Ana Paula",
    company: "BE",
    status: "Contacted",
    source: "Referral",
    lastActivityValue: 1,
    lastActivityUnit: "days",
  },
  {
    id: "L-1015",
    name: "Toby",
    company: "Shadcn UI Kit ",
    status: "Negotiation",
    source: "Other",
    lastActivityValue: 2,
    lastActivityUnit: "days",
  },
  {
    id: "L-1006",
    name: "David Haz",
    company: "React Bits",
    status: "Qualified",
    source: "Referral",
    lastActivityValue: 2,
    lastActivityUnit: "days",
  },
  {
    id: "L-1004",
    name: "Erşad",
    company: "Align UI",
    status: "New",
    source: "Cold Outreach",
    lastActivityValue: 3,
    lastActivityUnit: "days",
  },
];
