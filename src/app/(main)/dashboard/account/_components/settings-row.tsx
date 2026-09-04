import type { ReactNode } from "react";

export function SettingsSection({
  title,
  description,
  children,
}: {
  readonly title?: string;
  readonly description?: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      {(title ?? description) && (
        <div className="px-0.5">
          {title && <h3 className="font-medium text-sm">{title}</h3>}
          {description && <p className="mt-0.5 text-muted-foreground text-xs">{description}</p>}
        </div>
      )}
      <div className="flex flex-col divide-y rounded-xl border">{children}</div>
    </div>
  );
}

export function SettingRow({
  title,
  description,
  children,
}: {
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="mt-0.5 text-muted-foreground text-xs">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
