"use client";

import { useSyncExternalStore } from "react";

export type ResolvedTheme = "light" | "dark";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): ResolvedTheme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): ResolvedTheme {
  return "light";
}

/** Tracks the `.dark` class on <html>, so canvas effects follow the app theme. */
export function useResolvedTheme(): ResolvedTheme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

