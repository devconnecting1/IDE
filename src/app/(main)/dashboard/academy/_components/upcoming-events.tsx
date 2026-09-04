import { addDays, format } from "date-fns";
import { enUS, type Locale, ptBR } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const upcomingEvents = [
  {
    dayOffset: 6,
    titleKey: "eventTitleScienceExhibition",
    startHour: 8,
    startMinute: 30,
    endHour: 12,
    endMinute: 30,
    typeKey: "eventOnCampus",
  },
  {
    dayOffset: 9,
    titleKey: "eventTitleParentsEvening",
    startHour: 14,
    startMinute: 0,
    endHour: 17,
    endMinute: 0,
    typeKey: "eventMeeting",
  },
  {
    dayOffset: 12,
    titleKey: "eventTitleInterHouseSportsDay",
    startHour: 9,
    startMinute: 0,
    endHour: 16,
    endMinute: 0,
    typeKey: "eventSports",
  },
  {
    dayOffset: 15,
    titleKey: "eventTitleGrade11MockExam",
    startHour: 9,
    startMinute: 0,
    endHour: 12,
    endMinute: 0,
    typeKey: "eventExam",
  },
  {
    dayOffset: 18,
    titleKey: "eventTitleDepartmentPlanning",
    startHour: 15,
    startMinute: 30,
    endHour: 16,
    endMinute: 30,
    typeKey: "eventMeeting",
  },
];

export async function UpcomingEvents() {
  const t = await getTranslations("academy");
  const locale = await getLocale();
  const dateFnsLocales: Record<string, Locale> = { "pt-BR": ptBR, en: enUS };
  const timeFormats: Record<string, string> = { "pt-BR": "HH:mm", en: "h:mm a" };
  const timePattern = timeFormats[locale] ?? "h:mm a";
  const today = new Date();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t("upcomingEvents")}</CardTitle>
        <CardAction className="flex items-center gap-1 text-muted-foreground text-xs">
          {t("viewCalendar")} <ArrowRight className="size-4" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {upcomingEvents.map((event) => {
          const eventDate = addDays(today, event.dayOffset);
          const startTime = new Date(2020, 0, 1, event.startHour, event.startMinute);
          const endTime = new Date(2020, 0, 1, event.endHour, event.endMinute);
          const formatTime = (time: Date) => format(time, timePattern, { locale: dateFnsLocales[locale] ?? enUS });
          const timeLabel = `${formatTime(startTime)} - ${formatTime(endTime)}`;

          return (
            <div key={event.titleKey} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="size-11 shrink-0 overflow-hidden rounded-sm border">
                  <div className="grid h-1/3 place-items-center border-b bg-muted font-medium text-[10px] uppercase leading-none">
                    {format(eventDate, "MMM", { locale: dateFnsLocales[locale] ?? enUS })}
                  </div>
                  <div className="grid h-2/3 place-items-center text-lg leading-none">{format(eventDate, "d")}</div>
                </div>

                <div className="flex min-w-0 flex-col gap-1">
                  <div className="truncate font-medium text-sm leading-none">{t(event.titleKey)}</div>
                  <div className="text-muted-foreground text-xs leading-none">{timeLabel}</div>
                </div>
              </div>
              <Badge variant="outline" className="shrink-0 rounded-md px-2.5 py-1 font-medium text-[10px]">
                {t(event.typeKey)}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
