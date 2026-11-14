import { flushSync } from "react-dom";

const REVEAL_CLASS = "theme-reveal";
// Share of the circle that is fully opaque; must match the mask stop in globals.css.
const SOLID_SHARE = 0.65;
const CLASS_WAIT_MS = 120;

/**
 * Switches theme with a circle that spreads from `origin`, using the View
 * Transitions API. Falls back to an instant switch where the API is missing or
 * the user prefers reduced motion.
 */
export function switchThemeWithReveal(
  origin: Element,
  nextTheme: string,
  applyTheme: () => void,
): void {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || typeof document.startViewTransition !== "function") {
    applyTheme();
    return;
  }

  const rect = origin.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const farthest = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  root.style.setProperty("--theme-reveal-x", `${x}px`);
  root.style.setProperty("--theme-reveal-y", `${y}px`);
  // Overshoot so the solid part of the circle, not its faded edge, reaches the far corner.
  root.style.setProperty(
    "--theme-reveal-end",
    `${Math.ceil(farthest / SOLID_SHARE)}px`,
  );
  root.classList.add(REVEAL_CLASS);

  const hasTargetTheme = (): boolean =>
    nextTheme === "light"
      ? !root.classList.contains("dark")
      : root.classList.contains(nextTheme);

  const transition = document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        flushSync(applyTheme);
        if (hasTargetTheme()) {
          resolve();
          return;
        }
        // The theme class can land a tick after the state change; wait for it so the new snapshot is the new theme.
        const observer = new MutationObserver(() => {
          if (!hasTargetTheme()) return;
          observer.disconnect();
          resolve();
        });
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        window.setTimeout(() => {
          observer.disconnect();
          resolve();
        }, CLASS_WAIT_MS);
      }),
  );

  void transition.finished.finally(() => {
    root.classList.remove(REVEAL_CLASS);
    root.style.removeProperty("--theme-reveal-x");
    root.style.removeProperty("--theme-reveal-y");
    root.style.removeProperty("--theme-reveal-end");
  });
}

