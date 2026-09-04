import { getTranslations } from "next-intl/server";

import { tasks } from "./_components/data";
import { Tasks } from "./_components/tasks";

export default async function Page() {
  const t = await getTranslations();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl tracking-tight">{t("tasks.welcomeBack")}</h2>
        <p className="text-muted-foreground">{t("tasks.welcomeDescription")}</p>
      </div>
      <Tasks data={tasks} />
    </div>
  );
}
