import { getLocale } from "next-intl/server";

export default async function Page() {
  return (
    <iframe
      key={await getLocale()}
      src="/mail"
      title="Email"
      className="min-h-0 flex-1 rounded-lg border bg-background"
    />
  );
}
