import { NextResponse } from "next/server";

const REPO_API = "https://api.github.com/repos/anomalyco/models.dev/contents/labs?ref=dev";

interface LabEntry {
  name: string;
  path: string;
  url: string;
}

interface LabTomlContent {
  description?: string;
}

async function fetchLabDescriptions(): Promise<Record<string, string>> {
  const res = await fetch(REPO_API, {
    headers: { Accept: "application/vnd.github.v3+json" },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return {};
  }

  const entries: LabEntry[] = await res.json();
  const results: Record<string, string> = {};

  const labEntries = entries.filter((e) => e.name.endsWith("/lab.toml") || e.path.endsWith("/lab.toml"));

  await Promise.all(
    labEntries.map(async (entry) => {
      try {
        const labId = entry.path.replace("labs/", "").replace("/lab.toml", "");
        const rawRes = await fetch(entry.url, {
          headers: { Accept: "application/vnd.github.v3.raw" },
          next: { revalidate: 86400 },
        });
        if (!rawRes.ok) return;
        const text = await rawRes.text();
        const descMatch = text.match(/^description\s*=\s*"(.+?)"/m);
        if (descMatch?.[1]) {
          results[labId] = descMatch[1];
        }
      } catch {
        /* skip */
      }
    }),
  );

  return results;
}

export async function GET() {
  const data = await fetchLabDescriptions();
  return NextResponse.json(data);
}
