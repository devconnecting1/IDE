import { addDays, format } from "date-fns";
import type { useTranslations } from "next-intl";

type InvoiceTranslator = ReturnType<typeof useTranslations<"invoice">>;

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceTaxOption {
  id: string;
  name: string;
  labelKey: string;
  rate: number;
}

type InvoiceDiscountType = "fixed" | "percent";

type InvoiceFromDetails = {
  name: string;
  email: string;
  phone: string;
  website: string;
  addressLines: string[];
  taxId: string;
  paymentAccountName: string;
  routingNumber: string;
  issuerName: string;
};

export const INVOICE_PAPER_WIDTH = 816;
export const INVOICE_PAPER_HEIGHT = 1056;
export const INVOICE_PAPER_SCALE = 0.6;

export interface InvoiceToDetails {
  id: string;
  name: string;
  email: string;
  addressLines: string[];
  taxId: string;
}

export interface InvoiceFormValues {
  referenceNumber: string;
  issuedDate: string;
  paymentDueDate: string;
  from: InvoiceFromDetails;
  to: InvoiceToDetails;
  taxId: string;
  discountType: InvoiceDiscountType;
  discountValue: number;
  items: InvoiceLineItem[];
}

const aiyCap: InvoiceToDetails = {
  id: "aiy-cap",
  name: "AIY Cap",
  email: "finance@aiycap.com",
  addressLines: ["One BKC, Bandra Kurla Complex", "Mumbai, Maharashtra 400051"],
  taxId: "GSTIN-27AAICA9102K1Z7",
};

export function getDefaultInvoiceValues(t: InvoiceTranslator): InvoiceFormValues {
  const today = new Date();

  return {
    referenceNumber: "FL-0425",
    issuedDate: format(today, "yyyy-MM-dd"),
    paymentDueDate: format(addDays(today, 14), "yyyy-MM-dd"),
    from: {
      name: "Weblabs Studio",
      email: "hello@weblabs.studio",
      phone: "+1-512-555-0184",
      website: "weblabs.studio",
      addressLines: ["214 Pixel Avenue", "Austin, TX 78701"],
      taxId: "WS-1029384756",
      paymentAccountName: "Mercury Business",
      routingNumber: "084009519",
      issuerName: "Matheus Moraes",
    },
    to: aiyCap,
    taxId: "vat",
    discountType: "fixed",
    discountValue: 40,
    items: [
      {
        id: "hosting",
        description: t("itemCloudHosting"),
        quantity: 1,
        unitPrice: 3500,
      },
      {
        id: "analytics",
        description: t("itemDataAnalytics"),
        quantity: 2,
        unitPrice: 750,
      },
      {
        id: "support",
        description: t("itemSupportRetainer"),
        quantity: 1,
        unitPrice: 400,
      },
    ],
  };
}

export const invoiceTaxOptions: InvoiceTaxOption[] = [
  {
    id: "gst",
    name: "GST",
    labelKey: "invoice.taxGst",
    rate: 18,
  },
  {
    id: "vat",
    name: "VAT",
    labelKey: "invoice.taxVat",
    rate: 12,
  },
  {
    id: "service-tax",
    name: "Service Tax",
    labelKey: "invoice.taxServiceTax",
    rate: 10,
  },
  {
    id: "none",
    name: "No Tax",
    labelKey: "invoice.taxNoTax",
    rate: 0,
  },
];

export const invoiceClients: InvoiceToDetails[] = [
  {
    id: "bright-enterprises",
    name: "Bright Enterprises",
    email: "billing@brightenterprises.com",
    addressLines: ["450 Park Avenue South", "New York, NY 10016", "United States"],
    taxId: "US-EIN-84-2938475",
  },
  aiyCap,
  {
    id: "northline-gmbh",
    name: "Northline GmbH",
    email: "ap@northline.de",
    addressLines: ["Kastanienallee 32", "10435 Berlin", "Germany"],
    taxId: "DE-VAT-219384756",
  },
];

export function getLineAmount(item?: InvoiceLineItem) {
  if (!item) return 0;

  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0;

  return quantity * unitPrice;
}

export function getInvoiceItems(invoice: InvoiceFormValues) {
  return invoice.items;
}

export function getInvoiceSubtotal(invoice: InvoiceFormValues) {
  return getInvoiceItems(invoice).reduce((subtotal, item) => subtotal + getLineAmount(item), 0);
}

export function getInvoiceTaxOption(invoice: InvoiceFormValues) {
  return invoiceTaxOptions.find((taxOption) => taxOption.id === invoice.taxId) ?? invoiceTaxOptions[0];
}

export function getInvoiceTax(invoice: InvoiceFormValues) {
  const taxRate = getInvoiceTaxOption(invoice).rate;

  return Math.max(getInvoiceSubtotal(invoice) - getInvoiceDiscount(invoice), 0) * (taxRate / 100);
}

export function getInvoiceDiscount(invoice: InvoiceFormValues) {
  const subtotal = getInvoiceSubtotal(invoice);
  const discountValue = Number.isFinite(invoice.discountValue) ? invoice.discountValue : 0;
  const discount = invoice.discountType === "percent" ? subtotal * (discountValue / 100) : discountValue;

  return Math.min(Math.max(discount, 0), subtotal);
}

export function getInvoiceTotal(invoice: InvoiceFormValues) {
  return Math.max(getInvoiceSubtotal(invoice) - getInvoiceDiscount(invoice), 0) + getInvoiceTax(invoice);
}
