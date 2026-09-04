import type React from "react";

import type { useTranslations } from "next-intl";

import { type OrderFilter, orderFilterLabelKeys } from "./schema";

type EcommerceTranslator = ReturnType<typeof useTranslations<"ecommerce">>;

export function formatOrderCount(filter: OrderFilter, count: number, t: EcommerceTranslator) {
  if (filter === "All") {
    return t("orderCount", { count });
  }

  if (filter === "Needs action") {
    return t("ordersNeedAction", { count });
  }

  if (filter === "Returns") {
    return t("returnsCount", { count });
  }

  return t("ordersWithFilter", { count, filter: t(orderFilterLabelKeys[filter]) });
}

export function formatSelectedOrderCount(count: number, t: EcommerceTranslator) {
  return t("selectedOrders", { count });
}

export function preventPaginationNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}
