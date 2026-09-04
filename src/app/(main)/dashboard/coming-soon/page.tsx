import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("shell");

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-2 text-center">
      <h1 className="font-semibold text-2xl">{t("comingSoonTitle")}</h1>
      <p className="text-muted-foreground">{t("comingSoonDescription")}</p>
    </div>
  );
}
