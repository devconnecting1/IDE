import { File, FileArchive, FileChartColumn, FileImage, FileText } from "lucide-react";

export type FileKind = "document" | "spreadsheet" | "design" | "pdf" | "archive";
export type FileManagerView = "grid" | "list";

export const fileIcons = {
  archive: FileArchive,
  design: FileImage,
  document: FileText,
  pdf: File,
  spreadsheet: FileChartColumn,
} satisfies Record<FileKind, typeof File>;

export const fileKindLabelKeys: Record<FileKind, string> = {
  archive: "kindArchive",
  design: "kindDesign",
  document: "kindDocument",
  pdf: "kindPdf",
  spreadsheet: "kindSpreadsheet",
};

export const updatedAtLabelKeys: Record<string, string> = {
  twelveMinutesAgo: "timeTwelveMinutesAgo",
  yesterday: "timeYesterday",
  jul29: "timeJul29",
  jul27: "timeJul27",
  jul25: "timeJul25",
  jul22: "timeJul22",
};

export const modifiedAtLabelKeys: Record<string, string> = {
  fiveMinutesAgo: "timeFiveMinutesAgo",
  twoHoursAgo: "timeTwoHoursAgo",
  yesterday: "timeYesterday",
  jul29Full: "timeJul29Full",
  jul28Full: "timeJul28Full",
  jul26Full: "timeJul26Full",
  jul24Full: "timeJul24Full",
  jul23Full: "timeJul23Full",
  jul21Full: "timeJul21Full",
  jul19Full: "timeJul19Full",
  jul17Full: "timeJul17Full",
};

export interface FileManagerFolder {
  id: string;
  name: string;
  nameKey: string;
  fileCount: number;
  size: string;
  updatedAt: string;
}

export interface FileManagerFile {
  id: string;
  name: string;
  nameKey: string;
  kind: FileKind;
  size: string;
  owner: string;
  ownerInitials: string;
  modifiedAt: string;
  shared: boolean;
  starred: boolean;
}

export const folders: FileManagerFolder[] = [
  {
    id: "brand-assets",
    nameKey: "nameBrandAssets",
    name: "Brand assets",
    fileCount: 24,
    size: "1.8 GB",
    updatedAt: "twelveMinutesAgo",
  },
  {
    id: "product-design",
    nameKey: "nameProductDesign",
    name: "Product design",
    fileCount: 38,
    size: "4.6 GB",
    updatedAt: "yesterday",
  },
  {
    id: "legal-documents",
    nameKey: "nameLegalDocuments",
    name: "Legal documents",
    fileCount: 16,
    size: "840 MB",
    updatedAt: "jul29",
  },
  {
    id: "research",
    nameKey: "nameResearch",
    name: "Research",
    fileCount: 11,
    size: "620 MB",
    updatedAt: "jul27",
  },
  {
    id: "marketing",
    nameKey: "nameMarketing",
    name: "Marketing",
    fileCount: 29,
    size: "2.3 GB",
    updatedAt: "jul25",
  },
  {
    id: "team-resources",
    nameKey: "nameTeamResources",
    name: "Team resources",
    fileCount: 18,
    size: "1.2 GB",
    updatedAt: "jul22",
  },
];

export const files: FileManagerFile[] = [
  {
    id: "product-roadmap",
    nameKey: "nameProductRoadmap2027",
    name: "Product roadmap 2027.pdf",
    kind: "pdf",
    size: "8.4 MB",
    owner: "Matheus Moraes",
    ownerInitials: "AK",
    modifiedAt: "fiveMinutesAgo",
    shared: true,
    starred: true,
  },
  {
    id: "design-system",
    nameKey: "nameDesignSystemFoundations",
    name: "Design system foundations.fig",
    kind: "design",
    size: "24.1 MB",
    owner: "Aiy",
    ownerInitials: "AY",
    modifiedAt: "twoHoursAgo",
    shared: true,
    starred: false,
  },
  {
    id: "campaign-performance",
    nameKey: "nameCampaignPerformance",
    name: "Campaign performance.xlsx",
    kind: "spreadsheet",
    size: "2.7 MB",
    owner: "Ana Paula",
    ownerInitials: "AM",
    modifiedAt: "yesterday",
    shared: false,
    starred: false,
  },
  {
    id: "research-notes",
    nameKey: "nameCustomerResearchNotes",
    name: "Customer research notes.docx",
    kind: "document",
    size: "1.2 MB",
    owner: "Aiy",
    ownerInitials: "AY",
    modifiedAt: "jul29Full",
    shared: true,
    starred: true,
  },
  {
    id: "release-assets",
    nameKey: "nameReleaseAssets",
    name: "Release assets.zip",
    kind: "archive",
    size: "186 MB",
    owner: "Matheus Moraes",
    ownerInitials: "AK",
    modifiedAt: "jul28Full",
    shared: false,
    starred: false,
  },
  {
    id: "handoff-checklist",
    nameKey: "nameHandoffChecklist",
    name: "Handoff checklist.pdf",
    kind: "pdf",
    size: "940 KB",
    owner: "Ana Paula",
    ownerInitials: "AM",
    modifiedAt: "jul26Full",
    shared: true,
    starred: false,
  },
  {
    id: "quarterly-budget",
    nameKey: "nameQuarterlyBudgetForecast",
    name: "Quarterly budget forecast.xlsx",
    kind: "spreadsheet",
    size: "3.8 MB",
    owner: "Matheus Moraes",
    ownerInitials: "AK",
    modifiedAt: "jul24Full",
    shared: true,
    starred: false,
  },
  {
    id: "mobile-app-prototype",
    nameKey: "nameMobileAppPrototype",
    name: "Mobile app prototype.fig",
    kind: "design",
    size: "18.6 MB",
    owner: "Ana Paula",
    ownerInitials: "AM",
    modifiedAt: "jul23Full",
    shared: true,
    starred: true,
  },
  {
    id: "partnership-agreement",
    nameKey: "namePartnershipAgreement",
    name: "Partnership agreement.docx",
    kind: "document",
    size: "620 KB",
    owner: "Ana Paula",
    ownerInitials: "AM",
    modifiedAt: "jul21Full",
    shared: false,
    starred: false,
  },
  {
    id: "product-launch-brief",
    nameKey: "nameProductLaunchBrief",
    name: "Product launch brief.pdf",
    kind: "pdf",
    size: "4.2 MB",
    owner: "Matheus Moraes",
    ownerInitials: "AK",
    modifiedAt: "jul19Full",
    shared: true,
    starred: false,
  },
  {
    id: "brand-exports",
    nameKey: "nameBrandExports",
    name: "Brand exports.zip",
    kind: "archive",
    size: "72 MB",
    owner: "Matheus Moraes",
    ownerInitials: "AK",
    modifiedAt: "jul17Full",
    shared: false,
    starred: false,
  },
];
