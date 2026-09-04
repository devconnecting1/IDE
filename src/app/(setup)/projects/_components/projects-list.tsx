"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { ChevronDown, Grid3X3, LayoutList, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

import { PlanUpgradeSheet } from "./plan-upgrade-sheet";

interface Project {
  id: string;
  name: string;
  status: "active" | "paused" | "restoring";
  region: string;
  createdAt: string;
}

const DEMO_PROJECTS: Project[] = [];

const REGION_LABELS: Record<string, string> = {
  "sa-east-1": "São Paulo",
};

function ProjectIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProjectCard({
  project,
  onDelete,
  deletingId,
  t,
  variant,
}: {
  project: Project;
  onDelete: (id: string) => void;
  deletingId: string | null;
  t: (key: string) => string;
  variant: "list" | "grid";
}) {
  if (variant === "list") {
    return (
      <Card>
        <CardContent className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <ProjectIcon className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{project.name}</h3>
              <div className="flex items-center gap-3 text-muted-foreground text-xs">
                <span>{REGION_LABELS[project.region] || project.region}</span>
                <Badge variant="secondary" className="text-xs">
                  {t(`statusValues.${project.status}`)}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            disabled={deletingId === project.id}
            onClick={() => onDelete(project.id)}
          >
            {deletingId === project.id ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="size-4" aria-hidden="true" />
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col justify-between p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <ProjectIcon className="size-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{project.name}</h3>
            <p className="text-muted-foreground text-xs">{REGION_LABELS[project.region] || project.region}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {t(`statusValues.${project.status}`)}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            disabled={deletingId === project.id}
            onClick={() => onDelete(project.id)}
          >
            {deletingId === project.id ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function UsageRow({ label, value, max, unit }: { label: string; value: number; max: number; unit: string }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const formatValue = (v: number) => {
    if (unit === "GB") return `${v} GB`;
    if (unit === "MB") return `${v} MB`;
    if (unit === "") return v.toLocaleString();
    return `${v} ${unit}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-xs">
          {formatValue(value)} / {formatValue(max)}
        </span>
      </div>
      <Progress value={percentage} className="h-1" />
    </div>
  );
}

export function ProjectsList() {
  const t = useTranslations("projects");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const projects = DEMO_PROJECTS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  async function handleDelete(id: string) {
    setDeletingId(id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success(t("deletedSuccess"));
    setDeletingId(null);
  }

  function renderProjects() {
    if (projects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-muted-foreground/25 border-dashed py-16">
          <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-muted">
            <ProjectIcon className="size-6 text-muted-foreground" />
          </div>
          <h2 className="mb-2 font-medium text-lg">{t("emptyTitle")}</h2>
          <p className="mb-6 text-center text-muted-foreground text-sm">{t("emptyDescription")}</p>
          <Button variant="outline" onClick={() => router.push("/projects/new")}>
            <Plus className="mr-2 size-4" aria-hidden="true" />
            {t("newProject")}
          </Button>
        </div>
      );
    }

    if (viewMode === "list") {
      return (
        <div className="space-y-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
              deletingId={deletingId}
              t={(k) => t(k)}
              variant="list"
            />
          ))}
        </div>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={handleDelete}
            deletingId={deletingId}
            t={(k) => t(k)}
            variant="grid"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl space-y-6">
      <div>
        <h1 className="font-semibold text-xl">{t("title")}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm">
          {t("status")}
          <ChevronDown className="ml-2 size-4" aria-hidden="true" />
        </Button>
        <Button variant="outline" size="sm">
          {t("sortedBy")}
          <ChevronDown className="ml-2 size-4" aria-hidden="true" />
        </Button>
        <div className="flex items-center gap-1 rounded-md border border-input p-0.5">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="size-7"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="size-4" aria-hidden="true" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="size-7"
            onClick={() => setViewMode("list")}
          >
            <LayoutList className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <Button size="sm" onClick={() => router.push("/projects/new")}>
          <Plus className="mr-2 size-4" aria-hidden="true" />
          {t("newProject")}
        </Button>
      </div>

      {renderProjects()}

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">{t("usage.title")}</h3>
              <p className="text-muted-foreground text-xs">{t("usage.subtitle")}</p>
            </div>
            <Button variant="default" size="sm" onClick={() => setUpgradeOpen(true)}>
              {t("usage.upgrade")}
            </Button>
          </div>
          <div className="space-y-4">
            <UsageRow label={t("usage.egress")} value={0} max={5} unit="GB" />
            <UsageRow label={t("usage.databaseSize")} value={0} max={500} unit="MB" />
            <UsageRow label={t("usage.monthlyUsers")} value={0} max={50000} unit="" />
            <UsageRow label={t("usage.fileStorage")} value={0} max={1} unit="GB" />
          </div>
        </CardContent>
      </Card>

      <PlanUpgradeSheet
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        orgName="Test"
        t={{
          title: t("planSheet.title"),
          pricing: t("planSheet.pricing"),
          currentPlan: t("planSheet.currentPlan"),
          mostPopular: t("planSheet.mostPopular"),
          upgradeTo: t("planSheet.upgradeTo"),
          contactUs: t("planSheet.contactUs"),
          free: {
            name: t("planSheet.free.name"),
            price: t("planSheet.free.price"),
            period: t("planSheet.free.period"),
            features: [
              t("planSheet.free.f1"),
              t("planSheet.free.f2"),
              t("planSheet.free.f3"),
              t("planSheet.free.f4"),
              t("planSheet.free.f5"),
              t("planSheet.free.f6"),
              t("planSheet.free.f7"),
            ],
            note: t("planSheet.free.note"),
          },
          pro: {
            name: t("planSheet.pro.name"),
            from: t("planSheet.pro.from"),
            price: t("planSheet.pro.price"),
            period: t("planSheet.pro.period"),
            features: [
              { text: t("planSheet.pro.f1"), sub: t("planSheet.pro.f1sub") },
              { text: t("planSheet.pro.f2"), sub: t("planSheet.pro.f2sub") },
              { text: t("planSheet.pro.f3"), sub: t("planSheet.pro.f3sub") },
              { text: t("planSheet.pro.f4"), sub: t("planSheet.pro.f4sub") },
              { text: t("planSheet.pro.f5"), sub: t("planSheet.pro.f5sub") },
              { text: t("planSheet.pro.f6") },
              { text: t("planSheet.pro.f7") },
              { text: t("planSheet.pro.f8") },
              { text: t("planSheet.pro.f9"), sub: t("planSheet.pro.f9sub") },
            ],
          },
          team: {
            name: t("planSheet.team.name"),
            from: t("planSheet.team.from"),
            price: t("planSheet.team.price"),
            period: t("planSheet.team.period"),
            features: [
              { text: t("planSheet.team.f1") },
              { text: t("planSheet.team.f2") },
              { text: t("planSheet.team.f3") },
              { text: t("planSheet.team.f4") },
              { text: t("planSheet.team.f5") },
              { text: t("planSheet.team.f6") },
              { text: t("planSheet.team.f7") },
            ],
          },
          enterprise: {
            name: t("planSheet.enterprise.name"),
            description: t("planSheet.enterprise.description"),
            features: [
              t("planSheet.enterprise.f1"),
              t("planSheet.enterprise.f2"),
              t("planSheet.enterprise.f3"),
              t("planSheet.enterprise.f4"),
              t("planSheet.enterprise.f5"),
              t("planSheet.enterprise.f6"),
            ],
          },
        }}
      />
    </div>
  );
}
