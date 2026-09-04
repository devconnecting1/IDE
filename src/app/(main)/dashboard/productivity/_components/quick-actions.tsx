import { CheckSquare, FileText, Focus, Orbit, Upload } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

const quickActions = [
  { labelKey: "actionNewNote", icon: FileText },
  { labelKey: "actionNewTask", icon: CheckSquare },
  { labelKey: "actionNewProject", icon: Orbit },
  { labelKey: "actionNewGoal", icon: Focus },
  { labelKey: "actionUpload", icon: Upload },
] as const;

export async function QuickActions() {
  const t = await getTranslations("productivity");

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl tracking-tight">{t("quickActions")}</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {quickActions.map((action) => (
          <Button key={action.labelKey} variant="outline" className="justify-start">
            <action.icon data-icon="inline-start" />
            {t(action.labelKey)}
          </Button>
        ))}
      </div>
    </section>
  );
}
