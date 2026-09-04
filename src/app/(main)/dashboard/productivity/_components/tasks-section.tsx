"use client";

import * as React from "react";

import { format, parse } from "date-fns";
import { enUS, type Locale, ptBR } from "date-fns/locale";
import { Calendar1, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Task = {
  titleKey: string;
  tagKey: string;
  time: string;
  checked: boolean;
};

const tasks: Task[] = [
  { titleKey: "taskQ2Roadmap", tagKey: "tagWork", time: "10:00", checked: false },
  { titleKey: "taskDesignSystemUpdates", tagKey: "tagDesign", time: "11:30", checked: true },
  { titleKey: "taskImportantEmails", tagKey: "tagAdmin", time: "14:00", checked: false },
  { titleKey: "taskCreatorContent", tagKey: "tagContent", time: "16:30", checked: false },
  { titleKey: "taskWeeklySyncNotes", tagKey: "tagPlanning", time: "18:00", checked: false },
];

const dateFnsLocales: Record<string, Locale> = { "pt-BR": ptBR, en: enUS };
const timeFormats: Record<string, string> = { "pt-BR": "HH:mm", en: "h:mm a" };

export function TasksSection() {
  const t = useTranslations("productivity");
  const locale = useLocale();
  const dateFnsLocale = dateFnsLocales[locale] ?? enUS;
  const timeFormat = timeFormats[locale] ?? "h:mm a";
  const [items, setItems] = React.useState(tasks);

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl tracking-tight">{t("tasks")}</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-30">
              <SelectValue placeholder={t("rangeToday")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today">{t("rangeToday")}</SelectItem>
                <SelectItem value="tomorrow">{t("rangeTomorrow")}</SelectItem>
                <SelectItem value="this-week">{t("rangeThisWeek")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button>
            <Plus data-icon="inline-start" />
            {t("newTask")}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background shadow-xs">
        <div className="divide-y">
          {items.map((task) => (
            <div key={task.titleKey} className="flex items-center gap-2 p-4">
              <Checkbox
                checked={task.checked}
                aria-label={t(task.titleKey)}
                onCheckedChange={(checked) => {
                  setItems((current) =>
                    current.map((item) =>
                      item.titleKey === task.titleKey ? { ...item, checked: checked === true } : item,
                    ),
                  );
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                    <span className="truncate text-sm">{t(task.titleKey)}</span>
                    <Badge variant="outline" className="px-3 py-1 font-normal">
                      {t(task.tagKey)}
                    </Badge>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-muted-foreground text-sm">
                    <span>{format(parse(task.time, "HH:mm", new Date()), timeFormat, { locale: dateFnsLocale })}</span>
                    <Calendar1 className="size-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
