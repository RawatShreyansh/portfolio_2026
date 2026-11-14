"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, type ReactElement } from "react";
import { GLASS } from "@/lib/glass";
import { useResolvedTheme } from "@/lib/hooks/use-resolved-theme";
import { switchThemeWithReveal } from "@/lib/theme-transition";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

// The new theme spreads from the button as a circle with a soft edge, through the View Transitions API.
// React hoists and de-duplicates this, so the component needs no stylesheet.
const REVEAL = `
@property --theme-reveal { syntax: "<length>"; inherits: false; initial-value: 0px; }
@keyframes theme-reveal { from { --theme-reveal: 0px; } to { --theme-reveal: var(--theme-reveal-end, 150vmax); } }
html.theme-reveal::view-transition-old(root), html.theme-reveal::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
html.theme-reveal::view-transition-new(root) {
  animation: theme-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  mask-image: radial-gradient(circle at var(--theme-reveal-x, 50%) var(--theme-reveal-y, 0%), #000 calc(var(--theme-reveal) * 0.65), transparent var(--theme-reveal));
}
`;

const STORAGE_KEY = "theme";

export interface ThemeToggleProps {
  /** The current theme, when your app owns it (next-themes, for one). Leave unset to let the button own it. */
  theme?: Theme;
  /**
   * Called with the theme to switch to. When `theme` is unset, the button also switches it itself: it
   * toggles the `dark` class on <html> and remembers the choice in localStorage.
   */
  onThemeChange?: (theme: Theme) => void;
  className?: string;
}

/** A round glass button that flips between light and dark mode, the new theme spreading from it as a circle. */
export function ThemeToggle({
  theme,
  onThemeChange,
  className,
}: ThemeToggleProps): ReactElement {
  const resolved = useResolvedTheme();

  useEffect(() => {
    if (theme) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        document.documentElement.classList.toggle("dark", saved === "dark");
      }
    } catch {
      // Private windows can refuse storage; the switch still works for this visit.
    }
  }, [theme]);

  const current = theme ?? resolved;

  const apply = (next: Theme): void => {
    onThemeChange?.(next);
    if (theme) return;
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private windows can refuse storage; the switch still works for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={(event) => {
        const next = current === "dark" ? "light" : "dark";
        switchThemeWithReveal(event.currentTarget, next, () => apply(next));
      }}
      className={cn(
        GLASS,
        "inline-flex size-13 shrink-0 cursor-pointer items-center justify-center rounded-full border text-foreground/80 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <style href="poulo-theme-toggle" precedence="default">
        {REVEAL}
      </style>
      <Sun aria-hidden className="hidden size-4 dark:block" />
      <Moon aria-hidden className="size-4 dark:hidden" />
      <span className="sr-only">Switch between light and dark mode</span>
    </button>
  );
}

