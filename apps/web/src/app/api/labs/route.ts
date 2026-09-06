import { NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";
const REPO = "anomalyco/models.dev";
const BRANCH = "dev";

async function fetchLabDescriptions(): Promise<Record<string, string>> {
  const treeRes = await fetch(`${GITHUB_API}/repos/${REPO}/git/trees/${BRANCH}?recursive=1`, {
    next: { revalidate: 86400 },
  });

  if (!treeRes.ok) {
    return {};
  }

  const tree = await treeRes.json();
  const labPaths: string[] = tree.tree
    .filter((t: { path: string; type: string }) => t.path.startsWith("labs/") && t.path.endsWith("/lab.toml"))
    .map((t: { path: string }) => t.path);

  const descriptions: Record<string, string> = {};

  const results = await Promise.allSettled(
    labPaths.map(async (path) => {
      const res = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
        next: { revalidate: 86400 },
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.content) return null;
      const content = atob(data.content);
      const match = content.match(/description\s*=\s*"([^"]+)"/);
      if (!match) return null;
      const labId = path.split("/")[1];
      return { id: labId, description: match[1] };
    }),
  );

  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      descriptions[result.value.id] = result.value.description;
    }
  }

  return descriptions;
}

const cache: { data: Record<string, string>; timestamp: number } = { data: {}, timestamp: 0 };
const CACHE_TTL = 3600_000;

export async function GET() {
  const now = Date.now();
  if (now - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  const descriptions = await fetchLabDescriptions();
  cache.data = descriptions;
  cache.timestamp = now;

  return NextResponse.json(descriptions);
}
