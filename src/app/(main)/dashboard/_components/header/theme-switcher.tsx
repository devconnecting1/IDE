"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  type Resolved,
  type ThemeSelection,
  ThemeToggler,
} from "@/components/animate-ui/primitives/effects/theme-toggler";
import { Button } from "@/components/ui/button";

const THEME_CYCLE = ["light", "dark", "system"] as const;

export function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <ThemeToggler theme={theme as ThemeSelection} resolvedTheme={resolvedTheme as Resolved} setTheme={setTheme}>
      {({ effective, resolved, toggleTheme }) => {
        const getIcon = () => {
          if (effective === "system") return <Monitor />;
          return resolved === "dark" ? <Moon /> : <Sun />;
        };

        return (
          <Button
            size="icon"
            aria-label="Theme"
            onClick={() => {
              const currentIndex = THEME_CYCLE.indexOf(effective);
              toggleTheme(THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length]);
            }}
          >
            {getIcon()}
          </Button>
        );
      }}
    </ThemeToggler>
  );
}
