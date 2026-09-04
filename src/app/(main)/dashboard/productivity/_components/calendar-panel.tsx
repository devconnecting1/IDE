"use client";

import * as React from "react";

import { startOfMonth, startOfToday } from "date-fns";
import { enUS, type Locale, ptBR } from "date-fns/locale";
import { useLocale } from "next-intl";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

const dateFnsLocales: Record<string, Locale> = { "pt-BR": ptBR, en: enUS };

export function CalendarPanel() {
  const locale = useLocale();
  const today = startOfToday();
  const [date, setDate] = React.useState<Date | undefined>(today);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => startOfMonth(today));

  return (
    <Card className="w-full" size="sm">
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          fixedWeeks
          locale={dateFnsLocales[locale] ?? enUS}
          className="w-full p-0"
        />
      </CardContent>
    </Card>
  );
}
