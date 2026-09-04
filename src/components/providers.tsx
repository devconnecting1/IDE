"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "next-themes";

import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={PREFERENCE_DEFAULTS.theme_mode}
      enableSystem
      disableTransitionOnChange
      storageKey="theme_mode"
      themes={["light", "dark", "system"]}
    >
      <PreferencesStoreProvider initialValues={PREFERENCE_DEFAULTS}>{children}</PreferencesStoreProvider>
    </ThemeProvider>
  );
}
