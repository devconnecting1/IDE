import { Ellipsis, FileDown, FileUp, RefreshCw, Share2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export async function AnalyticsToolbar() {
  const t = await getTranslations("analytics");

  return (
    <div className="flex items-center gap-2">
      <Select defaultValue="last-4-weeks">
        <SelectTrigger className="w-34">
          <SelectValue placeholder={t("rangePlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="last-7-days">{t("rangeLast7Days")}</SelectItem>
            <SelectItem value="last-4-weeks">{t("rangeLast4Weeks")}</SelectItem>
            <SelectItem value="last-3-months">{t("rangeLast3Months")}</SelectItem>
            <SelectItem value="year-to-date">{t("rangeYearToDate")}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" aria-label={t("moreActions")}>
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t("actionsLabel")}</DropdownMenuLabel>
            <DropdownMenuItem>
              <FileDown />
              {t("exportReport")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileUp />
              {t("importData")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 />
              {t("shareDashboard")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <RefreshCw />
              {t("refreshMetrics")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
