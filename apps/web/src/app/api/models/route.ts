import { type NextRequest, NextResponse } from "next/server";

const MODELS_API = "https://models.dev/api.json";

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get("provider");

  const res = await fetch(MODELS_API, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 502 });
  }

  const data: Record<string, { name: string; models: Record<string, unknown> }> = await res.json();

  if (provider) {
    const providers = provider.split(",");
    const filtered: Record<string, { name: string; models: Record<string, unknown> }> = {};
    for (const p of providers) {
      if (data[p]) {
        filtered[p] = data[p];
      }
    }
    return NextResponse.json(filtered);
  }

  return NextResponse.json(data);
}
