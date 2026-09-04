"use client";

import * as React from "react";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

type ThemeSelection = "light" | "dark" | "system";
type Resolved = "light" | "dark";
type Direction = "btt" | "ttb" | "ltr" | "rtl";

function getSystemEffective(): Resolved {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getClipKeyframes(direction: Direction): [string, string] {
  switch (direction) {
    case "ltr":
      return ["inset(0 100% 0 0)", "inset(0 0 0 0)"];
    case "rtl":
      return ["inset(0 0 0 100%)", "inset(0 0 0 0)"];
    case "ttb":
      return ["inset(0 0 100% 0)", "inset(0 0 0 0)"];
    case "btt":
      return ["inset(100% 0 0 0)", "inset(0 0 0 0)"];
    default:
      return ["inset(0 100% 0 0)", "inset(0 0 0 0)"];
  }
}

function flushSync(fn: () => void) {
  fn();
}

interface ThemeTogglerButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  modes?: ThemeSelection[];
  direction?: Direction;
  className?: string;
}

export function ThemeTogglerButton({
  variant = "ghost",
  size = "icon",
  modes = ["light", "dark", "system"],
  direction = "ltr",
  className,
}: ThemeTogglerButtonProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [current, setCurrent] = React.useState<{
    effective: ThemeSelection;
    resolved: Resolved;
  }>({
    effective: (theme as ThemeSelection) || "system",
    resolved: (resolvedTheme as Resolved) || "light",
  });

  React.useEffect(() => {
    setCurrent({
      effective: (theme as ThemeSelection) || "system",
      resolved: (resolvedTheme as Resolved) || "light",
    });
  }, [theme, resolvedTheme]);

  const [fromClip, toClip] = getClipKeyframes(direction);

  const toggleTheme = React.useCallback(
    async (nextTheme: ThemeSelection) => {
      const resolved = nextTheme === "system" ? getSystemEffective() : nextTheme;

      setCurrent({ effective: nextTheme, resolved });

      if (nextTheme === "system" && resolved === resolvedTheme) {
        setTheme(nextTheme);
        return;
      }

      if (!document.startViewTransition) {
        flushSync(() => {
          document.documentElement.classList.toggle("dark", resolved === "dark");
        });
        setTheme(nextTheme);
        return;
      }

      await document.startViewTransition(() => {
        flushSync(() => {
          document.documentElement.classList.toggle("dark", resolved === "dark");
        });
      }).ready;

      document.documentElement
        .animate(
          { clipPath: [fromClip, toClip] },
          {
            duration: 700,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          },
        )
        .finished.finally(() => {
          setTheme(nextTheme);
        });
    },
    [resolvedTheme, fromClip, toClip, setTheme],
  );

  const getNextTheme = (effective: ThemeSelection): ThemeSelection => {
    const i = modes.indexOf(effective);
    if (i === -1) return modes[0];
    return modes[(i + 1) % modes.length];
  };

  const getIcon = (effective: ThemeSelection, resolved: Resolved) => {
    const themeToShow = modes.includes("system") ? effective : resolved;
    if (themeToShow === "system") return <Monitor className="h-5 w-5" />;
    if (themeToShow === "dark") return <Moon className="h-5 w-5" />;
    return <Sun className="h-5 w-5" />;
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => toggleTheme(getNextTheme(current.effective))}
      >
        {getIcon(current.effective, current.resolved)}
      </Button>
      <style>{`::view-transition-old(root), ::view-transition-new(root){animation:none;mix-blend-mode:normal;}`}</style>
    </>
  );
}
