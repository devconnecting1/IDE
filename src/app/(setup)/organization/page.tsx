import { getTranslations } from "next-intl/server";

import { OrganizationForm } from "./_components/organization-form";

export default async function OrganizationPage() {
  const t = await getTranslations("setup");
  const tOrg = await getTranslations("organization");

  const translations = {
    title: tOrg("title"),
    description: tOrg("description"),
    nameLabel: tOrg("nameLabel"),
    namePlaceholder: tOrg("namePlaceholder"),
    nameHelper: tOrg("nameHelper"),
    nameMinLength: tOrg("nameMinLength"),
    nameMaxLength: tOrg("nameMaxLength"),
    typeLabel: tOrg("typeLabel"),
    typeHelper: tOrg("typeHelper"),
    typeRequired: tOrg("typeRequired"),
    types: {
      personal: tOrg("types.personal"),
      educational: tOrg("types.educational"),
      startup: tOrg("types.startup"),
      agency: tOrg("types.agency"),
      company: tOrg("types.company"),
      na: tOrg("types.na"),
    },
    planLabel: tOrg("planLabel"),
    planHelper: tOrg("planHelper"),
    planRequired: tOrg("planRequired"),
    plans: {
      free: tOrg("plans.free"),
      pro: tOrg("plans.pro"),
      team: tOrg("plans.team"),
    },
    learnMore: tOrg("learnMore"),
    cancel: tOrg("cancel"),
    createButton: tOrg("createButton"),
    createdSuccess: "{name}",
  };

  return (
    <div className="w-full max-w-2xl space-y-2">
      <div>
        <h1 className="font-semibold text-xl">{t("newOrganization")}</h1>
        <p className="text-muted-foreground text-sm">{t("newOrganizationDescription")}</p>
      </div>
      <OrganizationForm t={translations} />
    </div>
  );
}
