import { getLocale } from "next-intl/server";

export default async function Page() {
  return (
    <iframe
      key={await getLocale()}
      src="/chat"
      title="Chat"
      className="mx-auto min-h-0 w-full max-w-5xl flex-1 rounded-lg border bg-background shadow-sm"
    />
  );
}
