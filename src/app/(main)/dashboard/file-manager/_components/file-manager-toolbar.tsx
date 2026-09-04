import { ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { fileKindLabelKeys } from "./data";

export async function FileManagerToolbar() {
  const t = await getTranslations("fileManager");

  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
      <InputGroup className="md:max-w-lg">
        <InputGroupInput placeholder={t("searchPlaceholder")} aria-label={t("searchAria")} />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <div className="flex flex-1 flex-wrap items-center gap-2 xl:justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal data-icon="inline-start" />
              {t("filterSort")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t("show")}</DropdownMenuLabel>
              <DropdownMenuRadioGroup value="all">
                <DropdownMenuRadioItem value="all">{t("allFiles")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="starred">{t("starred")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="shared">{t("shared")}</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <SlidersHorizontal />
                  {t("fileType")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent sideOffset={8}>
                  <DropdownMenuGroup>
                    <DropdownMenuRadioGroup value="all">
                      <DropdownMenuRadioItem value="all">{t("allTypes")}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="archive">{t(fileKindLabelKeys.archive)}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="design">{t(fileKindLabelKeys.design)}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="document">{t(fileKindLabelKeys.document)}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="pdf">{t(fileKindLabelKeys.pdf)}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="spreadsheet">
                        {t(fileKindLabelKeys.spreadsheet)}
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ArrowUpDown />
                  {t("sortBy")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent sideOffset={8}>
                  <DropdownMenuGroup>
                    <DropdownMenuRadioGroup value="modified">
                      <DropdownMenuRadioItem value="modified">{t("lastModified")}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name">{t("name")}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="size">{t("fileSize")}</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
