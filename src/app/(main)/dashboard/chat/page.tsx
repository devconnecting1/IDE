import { getLocale } from "next-intl/server";

export default async function Page() {
  return (
    <iframe
      key={await getLocale()}
      src="/chat"
      title="Chat"
      className="mx-auto h-full w-full max-w-5xl rounded-lg border bg-background shadow-sm"
    />
  );
}
