import { getTranslations } from "next-intl/server";

import { NewProjectForm } from "../_components/new-project-form";

export default async function NewProjectPage() {
  const t = await getTranslations("projects");

  const translations = {
    titleLabel: t("nameLabel"),
    titlePlaceholder: t("namePlaceholder"),
    titleHelper: t("nameHelper"),
    titleMinLength: t("nameMinLength"),
    titleMaxLength: t("nameMaxLength"),
    regionLabel: t("regionLabel"),
    regionHelper: t("regionHelper"),
    regionValue: t("regionValue"),
    regionSelectPlaceholder: t("regionSelectPlaceholder"),
    regionRecommended: t("regionRecommended"),
    passwordLabel: t("passwordLabel"),
    passwordPlaceholder: t("passwordPlaceholder"),
    passwordHelper: t("passwordHelper"),
    passwordMinLength: t("passwordMinLength"),
    generatePassword: t("generatePassword"),
    securityLabel: t("securityLabel"),
    security: {
      dataApi: t("security.dataApi"),
      dataApiDescription: t("security.dataApiDescription"),
      autoTables: t("security.autoTables"),
      autoTablesDescription: t("security.autoTablesDescription"),
      autoRls: t("security.autoRls"),
      autoRlsDescription: t("security.autoRlsDescription"),
    },
    advancedConfig: t("advancedConfig"),
    advancedConfigDescription: t("advancedConfigDescription"),
    postgresTypeLabel: t("postgresTypeLabel"),
    postgresType: {
      postgres: t("postgresType.postgres"),
      postgresDefault: t("postgresType.postgresDefault"),
      postgresDescription: t("postgresType.postgresDescription"),
      postgresOriole: t("postgresType.postgresOriole"),
      postgresOrioleAlpha: t("postgresType.postgresOrioleAlpha"),
      postgresOrioleDescription: t("postgresType.postgresOrioleDescription"),
    },
    cancel: t("cancel"),
    createButton: t("createButton"),
    createdSuccess: t("createdSuccess"),
  };

  return (
    <div className="w-full max-w-2xl space-y-2">
      <div>
        <h1 className="font-semibold text-xl">{t("newProjectTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("newProjectDescription")}</p>
      </div>
      <NewProjectForm t={translations} />
    </div>
  );
}
