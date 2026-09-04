import { addDays, format } from "date-fns";
import { enUS, type Locale, ptBR } from "date-fns/locale";
import { ClipboardCheck, Globe, Orbit, Plus } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const projects = [
  {
    titleKey: "projectQ2Roadmap",
    statusKey: "statusInProgress",
    descriptionKey: "projectQ2RoadmapDesc",
    progress: 68,
    dueDays: 9,
    icon: Orbit,
  },
  {
    titleKey: "projectWebsiteRedesign",
    statusKey: "statusPlanning",
    descriptionKey: "projectWebsiteRedesignDesc",
    progress: 42,
    dueDays: 21,
    icon: Globe,
  },
  {
    titleKey: "projectOnboarding",
    statusKey: "statusPlanning",
    descriptionKey: "projectOnboardingDesc",
    progress: 31,
    dueDays: 18,
    icon: ClipboardCheck,
  },
] as const;

export async function ProjectsSection() {
  const t = await getTranslations("productivity");
  const locale = await getLocale();
  const dateFnsLocales: Record<string, Locale> = { "pt-BR": ptBR, en: enUS };
  const today = new Date();

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl tracking-tight">{t("projects")}</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="active">
            <SelectTrigger className="w-28">
              <SelectValue placeholder={t("filterActive")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="active">{t("filterActive")}</SelectItem>
                <SelectItem value="planning">{t("filterPlanning")}</SelectItem>
                <SelectItem value="completed">{t("filterCompleted")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Plus data-icon="inline-start" />
            {t("newProject")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.titleKey} className="shadow-xs">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <project.icon className="size-4 text-muted-foreground" />
                  <span>{t(project.titleKey)}</span>
                </div>
              </CardTitle>
              <CardAction>
                <Badge variant="outline">{t(project.statusKey)}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <div className="text-sm leading-none">{t(project.descriptionKey)}</div>
                <div className="flex items-center gap-3">
                  <Progress value={project.progress} className="h-2" />
                  <span className="shrink-0 text-sm">{project.progress}%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="py-2.5">
              <span className="text-muted-foreground">
                {t("dueDate", {
                  date: format(addDays(today, project.dueDays), "MMM d", {
                    locale: dateFnsLocales[locale] ?? enUS,
                  }),
                })}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
