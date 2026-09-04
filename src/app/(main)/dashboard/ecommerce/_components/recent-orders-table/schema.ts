export const orderFilters = ["All", "Needs action", "Unfulfilled", "Unpaid", "Returns"] as const;

export const orderFilterLabelKeys = {
  All: "filterAll",
  "Needs action": "filterNeedsAction",
  Unfulfilled: "filterUnfulfilled",
  Unpaid: "filterUnpaid",
  Returns: "filterReturns",
} as const satisfies Record<OrderFilter, string>;

export type OrderFilter = (typeof orderFilters)[number];

export type OrderRow = {
  id: string;
  date: string;
  customer: string;
  payment: "Paid" | "Pending" | "Refunded";
  total: number;
  items: number;
  fulfillment: "Fulfilled" | "Returned" | "Unfulfilled";
};
