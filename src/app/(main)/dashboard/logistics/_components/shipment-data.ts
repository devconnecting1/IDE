import {
  AlertTriangleIcon,
  ArrowUp,
  Ban,
  CheckCircle2,
  Droplets,
  Flame,
  Forklift,
  type LucideIcon,
  PackageCheck,
  PenLine,
  ShieldCheck,
  Snowflake,
  Star,
  Thermometer,
  Truck,
} from "lucide-react";

export type ShipmentStatus =
  | "Scheduled"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Delayed"
  | "On Hold"
  | "Customs Hold";

export const statusLabelKeys: Record<ShipmentStatus, string> = {
  Scheduled: "statusScheduled",
  "In Transit": "statusInTransit",
  "Out for Delivery": "statusOutForDelivery",
  Delivered: "statusDelivered",
  Delayed: "statusDelayed",
  "On Hold": "statusOnHold",
  "Customs Hold": "statusCustomsHold",
};

type TransportMode = "land" | "air" | "sea";

type RouteType = "road" | "flight" | "ship";

export type CustomerTier = "Priority" | "Standard" | "Non-priority";

export const tierLabelKeys: Record<CustomerTier, string> = {
  Priority: "tierPriority",
  Standard: "tierStandard",
  "Non-priority": "tierNonPriority",
};

const etaLabelKeys: Record<string, string> = {
  today: "etaToday",
  tomorrow: "etaTomorrow",
  tonight: "etaTonight",
  monday: "etaMonday",
  tuesday: "etaTuesday",
  wednesday: "etaWednesday",
  thursday: "etaThursday",
  friday: "etaFriday",
  nextWeek: "etaNextWeek",
  deliveredYesterday: "etaDeliveredYesterday",
  departingToday: "etaDepartingToday",
  deliveredToday: "etaDeliveredToday",
  departing: "etaDeparting",
  pending: "etaPending",
  customs: "etaCustoms",
  security: "etaSecurity",
  awaitingRelease: "etaAwaitingRelease",
  warehouse: "etaWarehouse",
};

export function getEtaLabel(value: string, t: (key: string) => string): string {
  const labelKey = etaLabelKeys[value];

  return labelKey ? t(labelKey) : value;
}

export type GeoCoordinate = [longitude: number, latitude: number];

type ShipmentLocation = {
  coordinates: GeoCoordinate;
  display: string;
  country: string;
  countryCode: string;
};

type ShipmentCustomer = {
  name: string;
  initials: string;
  id: string;
  tier: CustomerTier;
  tierLabelKey: string;
};

type HandlingTag = {
  labelKey: string;
  icon: LucideIcon;
};

type ShipmentHandling = {
  labelKey: string;
  noteKey: string;
  note: string;
  tags: HandlingTag[];
};

export type Shipment = {
  id: string;
  customer: ShipmentCustomer;
  origin: ShipmentLocation;
  destination: ShipmentLocation;
  cargo: string;
  cargoKey: string;
  handling: ShipmentHandling;
  weight: string;
  eta: string;
  etaMeta: string;
  status: ShipmentStatus;
  progress: number;
  mode: TransportMode;
  routeType: RouteType;
  transportNumber: string;
};

export type RouteStopStatus = "completed" | "current" | "upcoming";

export type RouteStopType = "origin" | "transit" | "destination";

export type RouteStop = {
  name: string;
  country: string;
  countryCode: string;
  arrival: string | null;
  departure: string | null;
  status: RouteStopStatus;
  type: RouteStopType;
};

const transitHubs: Record<string, { name: string; country: string; countryCode: string }[]> = {
  ID: [
    { name: "Jakarta Port", country: "Indonesia", countryCode: "ID" },
    { name: "Surabaya Terminal", country: "Indonesia", countryCode: "ID" },
  ],
  SG: [
    { name: "PSA Singapore", country: "Singapore", countryCode: "SG" },
    { name: "Tuas Port", country: "Singapore", countryCode: "SG" },
  ],
  MY: [
    { name: "Port Klang", country: "Malaysia", countryCode: "MY" },
    { name: "Johor Port", country: "Malaysia", countryCode: "MY" },
  ],
  TH: [
    { name: "Laem Chabang Port", country: "Thailand", countryCode: "TH" },
    { name: "Bangkok Terminal", country: "Thailand", countryCode: "TH" },
  ],
  VN: [
    { name: "Hai Phong Port", country: "Vietnam", countryCode: "VN" },
    { name: "Ho Chi Minh City Port", country: "Vietnam", countryCode: "VN" },
  ],
  PH: [{ name: "Manila Port", country: "Philippines", countryCode: "PH" }],
  IN: [
    { name: "JNPT Mumbai", country: "India", countryCode: "IN" },
    { name: "Chennai Port", country: "India", countryCode: "IN" },
  ],
  LK: [{ name: "Colombo Port", country: "Sri Lanka", countryCode: "LK" }],
  CN: [
    { name: "Shanghai Port", country: "China", countryCode: "CN" },
    { name: "Shenzhen Port", country: "China", countryCode: "CN" },
  ],
  JP: [
    { name: "Tokyo Port", country: "Japan", countryCode: "JP" },
    { name: "Osaka Port", country: "Japan", countryCode: "JP" },
  ],
  KR: [{ name: "Busan Port", country: "South Korea", countryCode: "KR" }],
  DE: [{ name: "Port of Hamburg", country: "Germany", countryCode: "DE" }],
  NL: [{ name: "Port of Rotterdam", country: "Netherlands", countryCode: "NL" }],
  GB: [{ name: "Port of Felixstowe", country: "United Kingdom", countryCode: "GB" }],
  AE: [{ name: "Jebel Ali Port", country: "UAE", countryCode: "AE" }],
  SA: [{ name: "Jeddah Port", country: "Saudi Arabia", countryCode: "SA" }],
};

const hubTimes: Record<number, { arrival: string; departure: string }> = {
  0: { arrival: "06:00 AM", departure: "08:30 AM" },
  1: { arrival: "02:15 PM", departure: "04:00 PM" },
  2: { arrival: "11:00 AM", departure: "01:30 PM" },
  3: { arrival: "07:45 AM", departure: "09:00 AM" },
};

export function getRouteStops(shipment: Shipment): RouteStop[] {
  const stops: RouteStop[] = [];

  stops.push({
    name: shipment.origin.display,
    country: shipment.origin.country,
    countryCode: shipment.origin.countryCode,
    arrival: null,
    departure: "06:00 AM",
    status: "completed",
    type: "origin",
  });

  const hubs = transitHubs[shipment.origin.countryCode] ?? [];
  const maxStops = Math.min(hubs.length, 2);
  const progressRatio = shipment.progress / 100;

  for (let i = 0; i < maxStops; i++) {
    const hubStopThreshold = (i + 1) / (maxStops + 1);
    const isCompleted = progressRatio > hubStopThreshold + 0.1;
    const isCurrent = !isCompleted && progressRatio > hubStopThreshold - 0.15;
    const times = hubTimes[i] ?? hubTimes[0];

    let hubStatus: RouteStopStatus = "upcoming";
    if (isCompleted) {
      hubStatus = "completed";
    } else if (isCurrent) {
      hubStatus = "current";
    }

    stops.push({
      ...hubs[i],
      arrival: isCompleted || isCurrent ? times.arrival : null,
      departure: isCompleted ? times.departure : null,
      status: hubStatus,
      type: "transit",
    });
  }

  const destCompleted = shipment.status === "Delivered" || shipment.progress >= 95;
  const destCurrent = !destCompleted && shipment.progress >= 80;

  let destStatus: RouteStopStatus = "upcoming";
  if (destCompleted) {
    destStatus = "completed";
  } else if (destCurrent) {
    destStatus = "current";
  }

  stops.push({
    name: shipment.destination.display,
    country: shipment.destination.country,
    countryCode: shipment.destination.countryCode,
    arrival: destCompleted || destCurrent ? "04:30 PM" : null,
    departure: null,
    status: destStatus,
    type: "destination",
  });

  return stops;
}

export type DocumentStatus = "uploaded" | "pending" | "expired" | "required";

export type DocumentCategory = "customs" | "transport" | "insurance" | "commercial" | "compliance";

export type ShipmentDocument = {
  id: string;
  nameKey: string;
  category: DocumentCategory;
  status: DocumentStatus;
  uploadedAt: string | null;
  expiryDate: string | null;
  fileFormat: string;
  size: string;
};

export type ActivityType =
  | "status_change"
  | "location_update"
  | "document_upload"
  | "handling_alert"
  | "customs_clearance"
  | "delivery_update"
  | "departure"
  | "arrival";

export type ShipmentActivity = {
  id: string;
  type: ActivityType;
  titleKey: string;
  titleParams?: Record<string, string>;
  descKey: string;
  descParams?: Record<string, string>;
  timestamp: string;
  locationKey: string | null;
  location?: string;
};

const documentTemplates: Record<
  Shipment["mode"],
  { nameKey: string; category: DocumentCategory; fileFormat: string }[]
> = {
  air: [
    { nameKey: "docNameAirWaybill", category: "transport", fileFormat: "PDF" },
    { nameKey: "docNameCommercialInvoice", category: "commercial", fileFormat: "PDF" },
    { nameKey: "docNamePackingList", category: "commercial", fileFormat: "PDF" },
    { nameKey: "docNameExportDeclaration", category: "customs", fileFormat: "XML" },
    { nameKey: "docNameCertificateOfOrigin", category: "customs", fileFormat: "PDF" },
    { nameKey: "docNameCargoInsurance", category: "insurance", fileFormat: "PDF" },
    { nameKey: "docNameDangerousGoods", category: "compliance", fileFormat: "PDF" },
    { nameKey: "docNameImportLicense", category: "customs", fileFormat: "PDF" },
  ],
  land: [
    { nameKey: "docNameBillOfLading", category: "transport", fileFormat: "PDF" },
    { nameKey: "docNameCommercialInvoice", category: "commercial", fileFormat: "PDF" },
    { nameKey: "docNamePackingList", category: "commercial", fileFormat: "PDF" },
    { nameKey: "docNameCMRConsignment", category: "transport", fileFormat: "PDF" },
    { nameKey: "docNameExportDeclaration", category: "customs", fileFormat: "XML" },
    { nameKey: "docNameCertificateOfOrigin", category: "customs", fileFormat: "PDF" },
    { nameKey: "docNameCargoInsurance", category: "insurance", fileFormat: "PDF" },
    { nameKey: "docNameVehicleInspection", category: "compliance", fileFormat: "PDF" },
  ],
  sea: [
    { nameKey: "docNameBillOfLading", category: "transport", fileFormat: "PDF" },
    { nameKey: "docNameCommercialInvoice", category: "commercial", fileFormat: "PDF" },
    { nameKey: "docNamePackingList", category: "commercial", fileFormat: "PDF" },
    { nameKey: "docNameSeaWaybill", category: "transport", fileFormat: "PDF" },
    { nameKey: "docNameExportDeclaration", category: "customs", fileFormat: "XML" },
    { nameKey: "docNameCertificateOfOrigin", category: "customs", fileFormat: "PDF" },
    { nameKey: "docNameCargoInsurance", category: "insurance", fileFormat: "PDF" },
    { nameKey: "docNameFumigation", category: "compliance", fileFormat: "PDF" },
  ],
};

const categoryLabelKeys: Record<DocumentCategory, string> = {
  customs: "docCategoryCustoms",
  transport: "docCategoryTransport",
  insurance: "docCategoryInsurance",
  commercial: "docCategoryCommercial",
  compliance: "docCategoryCompliance",
};

const statusLabelKeysDocs: Record<DocumentStatus, string> = {
  uploaded: "docStatusUploaded",
  pending: "docStatusPending",
  expired: "docStatusExpired",
  required: "docStatusRequired",
};

export { categoryLabelKeys, statusLabelKeysDocs };

export function getDocuments(shipment: Shipment): ShipmentDocument[] {
  const templates = documentTemplates[shipment.mode];
  const progressRatio = shipment.progress / 100;

  return templates.map((tpl, i) => {
    const docThreshold = (i + 1) / templates.length;
    const isUploaded = progressRatio > docThreshold + 0.05;
    const isPending = !isUploaded && progressRatio > docThreshold - 0.15;
    const isExpired = !isUploaded && !isPending && i === templates.length - 1 && shipment.progress < 30;

    let status: DocumentStatus = "required";
    if (isUploaded) {
      status = "uploaded";
    } else if (isPending) {
      status = "pending";
    } else if (isExpired) {
      status = "expired";
    }

    return {
      id: `${shipment.id}-DOC-${String(i + 1).padStart(2, "0")}`,
      nameKey: tpl.nameKey,
      category: tpl.category,
      status,
      uploadedAt: isUploaded ? "2026-08-28" : null,
      expiryDate: status !== "expired" ? "2027-02-15" : "2026-06-01",
      fileFormat: tpl.fileFormat,
      size: isUploaded ? `${Math.floor(Math.random() * 400 + 50)} KB` : "",
    };
  });
}

const customerAccounts = {
  techCorp: {
    name: "TechCorp",
    initials: "TC",
    id: "SDA-1001-2401-01",
    tier: "Priority",
    tierLabelKey: "tierTopVolume",
  },
  regionalRoadExpress: {
    name: "Regional Road Express",
    initials: "RR",
    id: "SDA-1002-2402-02",
    tier: "Priority",
    tierLabelKey: "tierTopVolume",
  },
  sendWell: {
    name: "SendWell B.V.",
    initials: "SW",
    id: "SDA-1003-2403-03",
    tier: "Priority",
    tierLabelKey: "tierTopVolume",
  },
  sourceDay: {
    name: "SourceDay",
    initials: "SD",
    id: "SDA-1004-2404-04",
    tier: "Standard",
    tierLabelKey: "tierRecurring",
  },
  shippingEasy: {
    name: "ShippingEasy",
    initials: "SE",
    id: "SDA-1005-2405-05",
    tier: "Standard",
    tierLabelKey: "tierRecurring",
  },
  freightView: {
    name: "FreightView",
    initials: "FV",
    id: "SDA-1006-2406-06",
    tier: "Priority",
    tierLabelKey: "tierTopVolume",
  },
  logisticsPlus: {
    name: "Logistics Plus",
    initials: "LP",
    id: "SDA-1007-2407-07",
    tier: "Standard",
    tierLabelKey: "tierManaged",
  },
  transvirtual: {
    name: "Transvirtual",
    initials: "TV",
    id: "SDA-1008-2408-08",
    tier: "Standard",
    tierLabelKey: "tierManaged",
  },
  skyTrack: {
    name: "SkyTrack",
    initials: "ST",
    id: "SDA-1009-2409-09",
    tier: "Non-priority",
    tierLabelKey: "tierOccasional",
  },
  maersk: {
    name: "Maersk",
    initials: "MK",
    id: "SDA-1010-2410-10",
    tier: "Priority",
    tierLabelKey: "tierTopVolume",
  },
  flexport: {
    name: "Flexport",
    initials: "FX",
    id: "SDA-1011-2411-11",
    tier: "Priority",
    tierLabelKey: "tierTopVolume",
  },
  piedPiper: {
    name: "Pied Piper",
    initials: "PP",
    id: "SDA-1012-2412-12",
    tier: "Non-priority",
    tierLabelKey: "tierOccasional",
  },
} satisfies Record<string, ShipmentCustomer>;

export const shipments: Shipment[] = [
  {
    id: "SDA-01-2401",
    customer: customerAccounts.techCorp,
    origin: {
      display: "CGK Airport",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [106.6429036, -6.1238696],
    },
    destination: {
      display: "SIN Airport",
      country: "Singapore",
      countryCode: "SG",
      coordinates: [103.9949824, 1.3510921],
    },
    cargoKey: "cargoConsumerElectronics",
    cargo: "Consumer Electronics",
    handling: {
      labelKey: "handlingFragileElectronics",
      noteKey: "notePackageSealedHandoff",
      note: "Keep package sealed until handoff.",
      tags: [
        { labelKey: "tagDoNotStack", icon: Ban },
        { labelKey: "tagKeepUpright", icon: ArrowUp },
        { labelKey: "tagSignatureRequired", icon: PenLine },
      ],
    },
    weight: "2,450 kg",
    eta: "08:45 AM",
    etaMeta: "today",
    status: "In Transit",
    progress: 65,
    mode: "air",
    routeType: "flight",
    transportNumber: "GA-884",
  },
  {
    id: "SDA-02-2402",
    customer: customerAccounts.regionalRoadExpress,
    origin: {
      display: "Surabaya",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [112.7377674, -7.2462836],
    },
    destination: {
      display: "Semarang",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [110.4229104, -6.9903988],
    },
    cargoKey: "cargoIndustrialMachinery",
    cargo: "Industrial Machinery",
    handling: {
      labelKey: "handlingHeavyMachinery",
      noteKey: "noteSecureMachineryPallet",
      note: "Secure machinery to pallet base before road dispatch.",
      tags: [
        { labelKey: "tagForkliftOnly", icon: Forklift },
        { labelKey: "tagSecureLoad", icon: ShieldCheck },
        { labelKey: "tagDoNotTip", icon: Ban },
      ],
    },
    weight: "8,120 kg",
    eta: "11:20 AM",
    etaMeta: "tomorrow",
    status: "Delayed",
    progress: 42,
    mode: "land",
    routeType: "road",
    transportNumber: "B 9042 KX",
  },
  {
    id: "SDA-03-2403",
    customer: customerAccounts.sendWell,
    origin: {
      display: "Tanjung Priok Port",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [106.8805674, -6.1045642],
    },
    destination: {
      display: "Port of Singapore",
      country: "Singapore",
      countryCode: "SG",
      coordinates: [103.7566, 1.2788],
    },
    cargoKey: "cargoFrozenSeafood",
    cargo: "Frozen Seafood",
    handling: {
      labelKey: "handlingTemperatureControlled",
      noteKey: "noteFrozenChain",
      note: "Maintain frozen chain at or below -18°C until port handoff.",
      tags: [
        { labelKey: "tagTemperatureLog", icon: Thermometer },
        { labelKey: "tagKeepFrozen", icon: Snowflake },
        { labelKey: "tagSealIntact", icon: ShieldCheck },
      ],
    },
    weight: "19,800 kg",
    eta: "09:15 PM",
    etaMeta: "deliveredYesterday",
    status: "Delivered",
    progress: 100,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV SEA-318",
  },
  {
    id: "SDA-04-2404",
    customer: customerAccounts.maersk,
    origin: {
      display: "KUL Airport",
      country: "Malaysia",
      countryCode: "MY",
      coordinates: [101.7063995, 2.7431274],
    },
    destination: {
      display: "BKK Airport",
      country: "Thailand",
      countryCode: "TH",
      coordinates: [100.7485803, 13.6818767],
    },
    cargoKey: "cargoPharmaceuticalKits",
    cargo: "Pharmaceutical Kits",
    handling: {
      labelKey: "handlingTemperatureControlled",
      noteKey: "noteControlledTemp",
      note: "Maintain controlled temperature and verify hold clearance before release.",
      tags: [
        { labelKey: "tagTemperatureLog", icon: Thermometer },
        { labelKey: "tagKeepUpright", icon: ArrowUp },
        { labelKey: "tagSignatureRequired", icon: PenLine },
      ],
    },
    weight: "540 kg",
    eta: "06:10 PM",
    etaMeta: "today",
    status: "On Hold",
    progress: 28,
    mode: "air",
    routeType: "flight",
    transportNumber: "MH-728",
  },
  {
    id: "SDA-05-2405",
    customer: customerAccounts.sourceDay,
    origin: {
      display: "Bandung",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [107.6070833, -6.9218457],
    },
    destination: {
      display: "Yogyakarta",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [110.3672845, -7.7953473],
    },
    cargoKey: "cargoTextiles",
    cargo: "Textiles",
    handling: {
      labelKey: "handlingStandardFreight",
      noteKey: "noteCartonsDrySunlight",
      note: "Keep cartons dry and away from direct sunlight.",
      tags: [
        { labelKey: "tagKeepDry", icon: Droplets },
        { labelKey: "tagDoNotCrush", icon: Ban },
        { labelKey: "tagStandardHandoff", icon: PackageCheck },
      ],
    },
    weight: "1,380 kg",
    eta: "09:30 AM",
    etaMeta: "friday",
    status: "Scheduled",
    progress: 12,
    mode: "land",
    routeType: "road",
    transportNumber: "D 1284 YA",
  },
  {
    id: "SDA-06-2406",
    customer: customerAccounts.logisticsPlus,
    origin: {
      display: "Port Klang",
      country: "Malaysia",
      countryCode: "MY",
      coordinates: [101.3913589, 2.9996963],
    },
    destination: {
      display: "Laem Chabang Port",
      country: "Thailand",
      countryCode: "TH",
      coordinates: [100.8994177, 13.0734119],
    },
    cargoKey: "cargoConstructionMaterials",
    cargo: "Construction Materials",
    handling: {
      labelKey: "handlingHeavyBulkCargo",
      noteKey: "noteHeavyLiftEquipment",
      note: "Load with heavy-lift equipment and secure against shifting.",
      tags: [
        { labelKey: "tagHeavyLift", icon: Forklift },
        { labelKey: "tagSecureLoad", icon: ShieldCheck },
        { labelKey: "tagDoNotStack", icon: Ban },
      ],
    },
    weight: "27,400 kg",
    eta: "03:40 PM",
    etaMeta: "departingToday",
    status: "Scheduled",
    progress: 18,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV LC-204",
  },
  {
    id: "SDA-07-2407",
    customer: customerAccounts.flexport,
    origin: {
      display: "HKG Airport",
      country: "Hong Kong",
      countryCode: "HK",
      coordinates: [113.9172999, 22.3125986],
    },
    destination: {
      display: "MNL Airport",
      country: "Philippines",
      countryCode: "PH",
      coordinates: [121.0219223, 14.5122467],
    },
    cargoKey: "cargoMedicalDevices",
    cargo: "Medical Devices",
    handling: {
      labelKey: "handlingSensitiveMedicalEquipment",
      noteKey: "noteMedicalDevicesSealed",
      note: "Keep medical devices sealed until customs inspection is complete.",
      tags: [
        { labelKey: "tagSealIntact", icon: ShieldCheck },
        { labelKey: "tagKeepUpright", icon: ArrowUp },
        { labelKey: "tagSignatureRequired", icon: PenLine },
      ],
    },
    weight: "860 kg",
    eta: "pending",
    etaMeta: "customs",
    status: "Customs Hold",
    progress: 33,
    mode: "air",
    routeType: "flight",
    transportNumber: "CX-901",
  },
  {
    id: "SDA-08-2408",
    customer: customerAccounts.shippingEasy,
    origin: {
      display: "Jakarta",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [106.827168, -6.1754049],
    },
    destination: {
      display: "Bandung",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [107.6070833, -6.9218457],
    },
    cargoKey: "cargoRetailApparel",
    cargo: "Retail Apparel",
    handling: {
      labelKey: "handlingStandardFreight",
      noteKey: "noteCartonsDryCallReceiver",
      note: "Keep cartons dry and call receiver before final delivery.",
      tags: [
        { labelKey: "tagKeepDry", icon: Droplets },
        { labelKey: "tagCallBeforeDelivery", icon: Truck },
        { labelKey: "tagStandardHandoff", icon: PackageCheck },
      ],
    },
    weight: "620 kg",
    eta: "02:15 PM",
    etaMeta: "today",
    status: "Out for Delivery",
    progress: 88,
    mode: "land",
    routeType: "road",
    transportNumber: "B 7712 JKT",
  },
  {
    id: "SDA-09-2409",
    customer: customerAccounts.freightView,
    origin: {
      display: "Shanghai Port",
      country: "China",
      countryCode: "CN",
      coordinates: [121.4872194, 31.2219444],
    },
    destination: {
      display: "Busan Port",
      country: "South Korea",
      countryCode: "KR",
      coordinates: [129.0492086, 35.1177052],
    },
    cargoKey: "cargoAutoParts",
    cargo: "Auto Parts",
    handling: {
      labelKey: "handlingIndustrialParts",
      noteKey: "noteSecurePalletsMoisture",
      note: "Secure pallets and protect machined surfaces from moisture.",
      tags: [
        { labelKey: "tagSecureLoad", icon: ShieldCheck },
        { labelKey: "tagKeepDry", icon: Droplets },
        { labelKey: "tagForkliftOnly", icon: Forklift },
      ],
    },
    weight: "12,200 kg",
    eta: "05:50 PM",
    etaMeta: "wednesday",
    status: "In Transit",
    progress: 54,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV BUSAN-54",
  },
  {
    id: "SDA-10-2410",
    customer: customerAccounts.techCorp,
    origin: {
      display: "NRT Airport",
      country: "Japan",
      countryCode: "JP",
      coordinates: [140.3933101, 35.7758714],
    },
    destination: {
      display: "ICN Airport",
      country: "South Korea",
      countryCode: "KR",
      coordinates: [126.4417093, 37.4634593],
    },
    cargoKey: "cargoSemiconductorWafers",
    cargo: "Semiconductor Wafers",
    handling: {
      labelKey: "handlingHighValueFragileCargo",
      noteKey: "noteWafersSealed",
      note: "Keep wafers sealed in shock-protected packaging until signed handoff.",
      tags: [
        { labelKey: "tagDoNotStack", icon: Ban },
        { labelKey: "tagKeepUpright", icon: ArrowUp },
        { labelKey: "tagSignatureRequired", icon: PenLine },
      ],
    },
    weight: "320 kg",
    eta: "08:30 PM",
    etaMeta: "deliveredYesterday",
    status: "Delivered",
    progress: 100,
    mode: "air",
    routeType: "flight",
    transportNumber: "KE-704",
  },
  {
    id: "SDA-11-2411",
    customer: customerAccounts.sourceDay,
    origin: {
      display: "Kuala Lumpur",
      country: "Malaysia",
      countryCode: "MY",
      coordinates: [101.6942371, 3.1516964],
    },
    destination: {
      display: "Penang",
      country: "Malaysia",
      countryCode: "MY",
      coordinates: [100.3287352, 5.4141619],
    },
    cargoKey: "cargoFoodIngredients",
    cargo: "Food Ingredients",
    handling: {
      labelKey: "handlingFoodGrade",
      noteKey: "noteFoodGradeSeals",
      note: "Keep food-grade seals intact and avoid cross-contamination.",
      tags: [
        { labelKey: "tagFoodGrade", icon: PackageCheck },
        { labelKey: "tagSealIntact", icon: ShieldCheck },
        { labelKey: "tagKeepDry", icon: Droplets },
      ],
    },
    weight: "3,950 kg",
    eta: "01:05 PM",
    etaMeta: "today",
    status: "In Transit",
    progress: 71,
    mode: "land",
    routeType: "road",
    transportNumber: "WQH 2184",
  },
  {
    id: "SDA-12-2412",
    customer: customerAccounts.transvirtual,
    origin: {
      display: "Cebu Port",
      country: "Philippines",
      countryCode: "PH",
      coordinates: [123.9174564, 10.3054355],
    },
    destination: {
      display: "Davao Port",
      country: "Philippines",
      countryCode: "PH",
      coordinates: [125.6627111, 7.1265272],
    },
    cargoKey: "cargoAgriculturalProduce",
    cargo: "Agricultural Produce",
    handling: {
      labelKey: "handlingPerishableGoods",
      noteKey: "noteVentilationProduce",
      note: "Prioritize ventilation and inspect produce condition at port handoff.",
      tags: [
        { labelKey: "tagPerishable", icon: Thermometer },
        { labelKey: "tagVentilatedHold", icon: PackageCheck },
        { labelKey: "tagInspectOnArrival", icon: CheckCircle2 },
      ],
    },
    weight: "6,700 kg",
    eta: "09:40 AM",
    etaMeta: "friday",
    status: "Delayed",
    progress: 39,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV DAVAO-12",
  },
  {
    id: "SDA-13-2413",
    customer: customerAccounts.flexport,
    origin: {
      display: "SIN Airport",
      country: "Singapore",
      countryCode: "SG",
      coordinates: [103.9949824, 1.3510921],
    },
    destination: {
      display: "DPS Airport",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [115.1673704, -8.746515],
    },
    cargoKey: "cargoLuxuryRetailGoods",
    cargo: "Luxury Retail Goods",
    handling: {
      labelKey: "handlingHighValueCargo",
      noteKey: "noteCartonsSealedAuthorized",
      note: "Keep cartons sealed; release only to authorized receiving contact.",
      tags: [
        { labelKey: "tagHighValue", icon: Star },
        { labelKey: "tagDoNotStack", icon: Ban },
        { labelKey: "tagSignatureRequired", icon: PenLine },
      ],
    },
    weight: "210 kg",
    eta: "07:15 AM",
    etaMeta: "monday",
    status: "Scheduled",
    progress: 9,
    mode: "air",
    routeType: "flight",
    transportNumber: "SQ-938",
  },
  {
    id: "SDA-14-2414",
    customer: customerAccounts.sendWell,
    origin: {
      display: "Port of Manila",
      country: "Philippines",
      countryCode: "PH",
      coordinates: [120.9522815, 14.6038906],
    },
    destination: {
      display: "Tanjung Priok Port",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [106.8805674, -6.1045642],
    },
    cargoKey: "cargoPaperRolls",
    cargo: "Paper Rolls",
    handling: {
      labelKey: "handlingMoistureSensitiveCargo",
      noteKey: "noteRollsDryEdgeImpact",
      note: "Keep rolls dry and avoid edge impact during unloading.",
      tags: [
        { labelKey: "tagKeepDry", icon: Droplets },
        { labelKey: "tagDoNotTip", icon: Ban },
        { labelKey: "tagForkliftOnly", icon: Forklift },
      ],
    },
    weight: "15,900 kg",
    eta: "awaitingRelease",
    etaMeta: "warehouse",
    status: "On Hold",
    progress: 25,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV PRI-77",
  },
  {
    id: "SDA-15-2415",
    customer: customerAccounts.skyTrack,
    origin: {
      display: "Medan",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [98.6741623, 3.5894617],
    },
    destination: {
      display: "Pekanbaru",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [101.4515727, 0.5262455],
    },
    cargoKey: "cargoBeverageStock",
    cargo: "Beverage Stock",
    handling: {
      labelKey: "handlingStandardPalletizedFreight",
      noteKey: "notePalletsUpright",
      note: "Keep pallets upright and prevent carton crush during road transfer.",
      tags: [
        { labelKey: "tagKeepUpright", icon: ArrowUp },
        { labelKey: "tagDoNotStack", icon: Ban },
        { labelKey: "tagStandardHandoff", icon: PackageCheck },
      ],
    },
    weight: "4,500 kg",
    eta: "03:30 PM",
    etaMeta: "today",
    status: "Scheduled",
    progress: 16,
    mode: "land",
    routeType: "road",
    transportNumber: "BK 4520 RA",
  },
  {
    id: "SDA-16-2416",
    customer: customerAccounts.regionalRoadExpress,
    origin: {
      display: "BOM Airport",
      country: "India",
      countryCode: "IN",
      coordinates: [72.8638223, 19.0901376],
    },
    destination: {
      display: "DEL Airport",
      country: "India",
      countryCode: "IN",
      coordinates: [77.0847985, 28.5553942],
    },
    cargoKey: "cargoAutoComponents",
    cargo: "Auto Components",
    handling: {
      labelKey: "handlingIndustrialParts",
      noteKey: "noteSecureCratesStraps",
      note: "Secure crates and inspect pallet straps before final handoff.",
      tags: [
        { labelKey: "tagSecureLoad", icon: ShieldCheck },
        { labelKey: "tagForkliftOnly", icon: Forklift },
        { labelKey: "tagInspectOnArrival", icon: CheckCircle2 },
      ],
    },
    weight: "780 kg",
    eta: "04:10 PM",
    etaMeta: "today",
    status: "Out for Delivery",
    progress: 84,
    mode: "air",
    routeType: "flight",
    transportNumber: "AI-864",
  },
  {
    id: "SDA-17-2417",
    customer: customerAccounts.logisticsPlus,
    origin: {
      display: "Rotterdam Port",
      country: "Netherlands",
      countryCode: "NL",
      coordinates: [4.4298268, 51.904333],
    },
    destination: {
      display: "Hamburg Port",
      country: "Germany",
      countryCode: "DE",
      coordinates: [9.9118353, 53.5279971],
    },
    cargoKey: "cargoPackagingMaterials",
    cargo: "Packaging Materials",
    handling: {
      labelKey: "handlingStandardFreight",
      noteKey: "notePalletsDryCount",
      note: "Keep pallets dry and verify pallet count at discharge.",
      tags: [
        { labelKey: "tagKeepDry", icon: Droplets },
        { labelKey: "tagCountOnArrival", icon: CheckCircle2 },
        { labelKey: "tagStandardHandoff", icon: PackageCheck },
      ],
    },
    weight: "21,300 kg",
    eta: "nextWeek",
    etaMeta: "tuesday",
    status: "In Transit",
    progress: 62,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV HAM-902",
  },
  {
    id: "SDA-18-2418",
    customer: customerAccounts.transvirtual,
    origin: {
      display: "Ho Chi Minh City",
      country: "Vietnam",
      countryCode: "VN",
      coordinates: [106.7166008, 10.7737261],
    },
    destination: {
      display: "Da Nang",
      country: "Vietnam",
      countryCode: "VN",
      coordinates: [108.212, 16.068],
    },
    cargoKey: "cargoHouseholdAppliances",
    cargo: "Household Appliances",
    handling: {
      labelKey: "handlingFragileBulkyGoods",
      noteKey: "noteTwoPersonHandling",
      note: "Use two-person handling and keep appliances upright until delivery.",
      tags: [
        { labelKey: "tagKeepUpright", icon: ArrowUp },
        { labelKey: "tagDoNotStack", icon: Ban },
        { labelKey: "tagTwoPersonLift", icon: Truck },
      ],
    },
    weight: "2,060 kg",
    eta: "11:40 AM",
    etaMeta: "deliveredToday",
    status: "Delivered",
    progress: 100,
    mode: "land",
    routeType: "road",
    transportNumber: "51C-208.44",
  },
  {
    id: "SDA-19-2419",
    customer: customerAccounts.maersk,
    origin: {
      display: "DXB Airport",
      country: "United Arab Emirates",
      countryCode: "AE",
      coordinates: [55.3666519, 25.2515424],
    },
    destination: {
      display: "JED Airport",
      country: "Saudi Arabia",
      countryCode: "SA",
      coordinates: [39.1634852, 21.6839754],
    },
    cargoKey: "cargoTemperatureControlled",
    cargo: "Temperature Controlled Goods",
    handling: {
      labelKey: "handlingTemperatureControlled",
      noteKey: "noteTempRangeEscalate",
      note: "Maintain temperature range and escalate delay exceptions immediately.",
      tags: [
        { labelKey: "tagTemperatureLog", icon: Thermometer },
        { labelKey: "tagKeepUpright", icon: ArrowUp },
        { labelKey: "tagEscalateDelay", icon: AlertTriangleIcon },
      ],
    },
    weight: "1,120 kg",
    eta: "10:50 PM",
    etaMeta: "tonight",
    status: "Delayed",
    progress: 47,
    mode: "air",
    routeType: "flight",
    transportNumber: "SV-591",
  },
  {
    id: "SDA-20-2420",
    customer: customerAccounts.freightView,
    origin: {
      display: "Nhava Sheva Port",
      country: "India",
      countryCode: "IN",
      coordinates: [72.952661, 18.9470339],
    },
    destination: {
      display: "Colombo Port",
      country: "Sri Lanka",
      countryCode: "LK",
      coordinates: [79.8564409, 6.9646289],
    },
    cargoKey: "cargoSteelCoils",
    cargo: "Steel Coils",
    handling: {
      labelKey: "handlingHeavyBulkCargo",
      noteKey: "noteCoilCradles",
      note: "Use coil cradles and confirm lashings before release.",
      tags: [
        { labelKey: "tagHeavyLift", icon: Forklift },
        { labelKey: "tagSecureLoad", icon: ShieldCheck },
        { labelKey: "tagDoNotTip", icon: Ban },
      ],
    },
    weight: "31,800 kg",
    eta: "06:00 AM",
    etaMeta: "thursday",
    status: "Scheduled",
    progress: 14,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV COL-620",
  },
  {
    id: "SDA-21-2421",
    customer: customerAccounts.piedPiper,
    origin: {
      display: "Chiang Mai",
      country: "Thailand",
      countryCode: "TH",
      coordinates: [98.9858802, 18.7882778],
    },
    destination: {
      display: "Bangkok",
      country: "Thailand",
      countryCode: "TH",
      coordinates: [100.4935089, 13.7524938],
    },
    cargoKey: "cargoFurniture",
    cargo: "Furniture",
    handling: {
      labelKey: "handlingFragileBulkyGoods",
      noteKey: "noteBlanketWrap",
      note: "Use blanket wrap and avoid stacking on finished surfaces.",
      tags: [
        { labelKey: "tagDoNotStack", icon: Ban },
        { labelKey: "tagKeepDry", icon: Droplets },
        { labelKey: "tagTwoPersonLift", icon: Truck },
      ],
    },
    weight: "5,240 kg",
    eta: "08:20 AM",
    etaMeta: "tomorrow",
    status: "In Transit",
    progress: 58,
    mode: "land",
    routeType: "road",
    transportNumber: "กท 8842",
  },
  {
    id: "SDA-22-2422",
    customer: customerAccounts.techCorp,
    origin: {
      display: "KIX Airport",
      country: "Japan",
      countryCode: "JP",
      coordinates: [135.222523, 34.4342045],
    },
    destination: {
      display: "TPE Airport",
      country: "Taiwan",
      countryCode: "TW",
      coordinates: [121.2345977, 25.0793174],
    },
    cargoKey: "cargoPrecisionTools",
    cargo: "Precision Tools",
    handling: {
      labelKey: "handlingHighValuePrecisionCargo",
      noteKey: "noteLockedCaseSealed",
      note: "Keep locked case sealed pending security clearance.",
      tags: [
        { labelKey: "tagSecurityHold", icon: ShieldCheck },
        { labelKey: "tagSealIntact", icon: ShieldCheck },
        { labelKey: "tagSignatureRequired", icon: PenLine },
      ],
    },
    weight: "430 kg",
    eta: "pending",
    etaMeta: "security",
    status: "On Hold",
    progress: 29,
    mode: "air",
    routeType: "flight",
    transportNumber: "BR-129",
  },
  {
    id: "SDA-23-2423",
    customer: customerAccounts.maersk,
    origin: {
      display: "Port of Singapore",
      country: "Singapore",
      countryCode: "SG",
      coordinates: [103.7566, 1.2788],
    },
    destination: {
      display: "Port Klang",
      country: "Malaysia",
      countryCode: "MY",
      coordinates: [101.3913589, 2.9996963],
    },
    cargoKey: "cargoChemicals",
    cargo: "Chemicals",
    handling: {
      labelKey: "handlingHazardousMaterialsReview",
      noteKey: "noteHazardousMaterials",
      note: "Hold pending hazardous materials review and port clearance.",
      tags: [
        { labelKey: "tagHazmatReview", icon: Flame },
        { labelKey: "tagKeepUpright", icon: ArrowUp },
        { labelKey: "tagRestrictedHandling", icon: ShieldCheck },
      ],
    },
    weight: "18,600 kg",
    eta: "departing",
    etaMeta: "02:50 PM",
    status: "Scheduled",
    progress: 19,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV PKG-315",
  },
  {
    id: "SDA-24-2424",
    customer: customerAccounts.shippingEasy,
    origin: {
      display: "Bandar Lampung",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [105.2643742, -5.4460713],
    },
    destination: {
      display: "Jakarta",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [106.827168, -6.1754049],
    },
    cargoKey: "cargoFreshProduce",
    cargo: "Fresh Produce",
    handling: {
      labelKey: "handlingPerishableGoods",
      noteKey: "noteSameDayHandoffProduce",
      note: "Prioritize same-day handoff and keep produce ventilated.",
      tags: [
        { labelKey: "tagPerishable", icon: Thermometer },
        { labelKey: "tagVentilatedHold", icon: PackageCheck },
        { labelKey: "tagInspectOnArrival", icon: CheckCircle2 },
      ],
    },
    weight: "970 kg",
    eta: "06:20 PM",
    etaMeta: "deliveredToday",
    status: "Delivered",
    progress: 100,
    mode: "land",
    routeType: "road",
    transportNumber: "BE 1745 YU",
  },
];

export function getActivities(shipment: Shipment, locale?: string): ShipmentActivity[] {
  const activities: ShipmentActivity[] = [];
  const progressRatio = shipment.progress / 100;
  const now = new Date();

  function hoursAgo(h: number) {
    const d = new Date(now);
    d.setHours(d.getHours() - h);
    return d.toLocaleString(locale ?? "en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  }

  activities.push({
    id: `${shipment.id}-ACT-01`,
    type: "status_change",
    titleKey: "actTitleShipmentCreated",
    descKey: "actDescShipmentCreated",
    descParams: { id: shipment.id, customer: shipment.customer.name },
    timestamp: hoursAgo(48),
    locationKey: null,
    location: shipment.origin.display,
  });

  if (progressRatio > 0.1) {
    activities.push({
      id: `${shipment.id}-ACT-02`,
      type: "document_upload",
      titleKey: "actTitleDocumentsSubmitted",
      descKey: "actDescDocumentsSubmitted",
      timestamp: hoursAgo(44),
      locationKey: null,
    });
  }

  if (progressRatio > 0.2) {
    activities.push({
      id: `${shipment.id}-ACT-03`,
      type: "customs_clearance",
      titleKey: "actTitleExportCustomsCleared",
      descKey: "actDescExportCustomsCleared",
      timestamp: hoursAgo(40),
      locationKey: null,
      location: shipment.origin.display,
    });
  }

  if (progressRatio > 0.3) {
    activities.push({
      id: `${shipment.id}-ACT-04`,
      type: "departure",
      titleKey: "actTitleDepartedOrigin",
      descKey: "actDescDepartedOrigin",
      descParams: { origin: shipment.origin.display, transport: shipment.transportNumber },
      timestamp: hoursAgo(36),
      locationKey: null,
      location: shipment.origin.display,
    });
  }

  if (progressRatio > 0.5) {
    activities.push({
      id: `${shipment.id}-ACT-05`,
      type: "location_update",
      titleKey: "actTitleInTransit",
      descKey: "actDescInTransit",
      timestamp: hoursAgo(24),
      locationKey: "actLocationEnRoute",
    });
  }

  if (progressRatio > 0.7 && shipment.handling.tags.length > 0) {
    activities.push({
      id: `${shipment.id}-ACT-06`,
      type: "handling_alert",
      titleKey: "actTitleHandlingVerified",
      descKey: "actDescHandlingVerified",
      timestamp: hoursAgo(18),
      locationKey: "actLocationTransitHub",
    });
  }

  if (progressRatio > 0.85) {
    activities.push({
      id: `${shipment.id}-ACT-07`,
      type: "arrival",
      titleKey: "actTitleArrivedDestination",
      descKey: "actDescArrivedDestination",
      descParams: { destination: shipment.destination.display },
      timestamp: hoursAgo(6),
      locationKey: null,
      location: shipment.destination.display,
    });
  }

  if (shipment.status === "Delivered") {
    activities.push({
      id: `${shipment.id}-ACT-08`,
      type: "delivery_update",
      titleKey: "actTitleDelivered",
      descKey: "actDescDelivered",
      timestamp: hoursAgo(2),
      locationKey: null,
      location: shipment.destination.display,
    });
  }

  if (shipment.status === "Delayed") {
    activities.push({
      id: `${shipment.id}-ACT-DELAY`,
      type: "delivery_update",
      titleKey: "actTitleDelayReported",
      descKey: "actDescDelayReported",
      timestamp: hoursAgo(12),
      locationKey: "actLocationEnRoute",
    });
  }

  if (shipment.status === "On Hold" || shipment.status === "Customs Hold") {
    activities.push({
      id: `${shipment.id}-ACT-HOLD`,
      type: "customs_clearance",
      titleKey: "actTitleCustomsHold",
      descKey: "actDescCustomsHold",
      timestamp: hoursAgo(8),
      locationKey: "actLocationCustomsOffice",
    });
  }

  return activities;
}
