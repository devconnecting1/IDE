import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const cookieStore = await cookies();
  cookieStore.set("demo-auth", "1", { path: "/", maxAge: 60 * 60 * 24 * 30 });
  redirect("/dashboard/chat");
}
