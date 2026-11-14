"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => {
    media.removeEventListener("change", callback);
  };
}

function getSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Lightweight shim for `useReducedMotion` from `motion/react` using React's
 * `useSyncExternalStore` for flicker-free subscription and strict ESLint compliance.
 */
export function useReducedMotion(): boolean | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
