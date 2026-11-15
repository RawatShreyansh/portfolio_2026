"use client";

import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import type { ReactElement } from "react";
import { HandwrittenQuote } from "@/components/library/handwritten-quote";
import { Globe, type Marker, type Arc } from "@/components/ui/cobe-globe";
import SignaturePenFooter from "@/components/ui/signature-pen-footer";
import { useResolvedTheme } from "@/lib/hooks/use-resolved-theme";

const GLOBE_MARKERS: Marker[] = [
  { id: "sf", location: [37.7749, -122.4194], label: "San Francisco" },
  { id: "nyc", location: [40.7128, -74.006], label: "New York" },
  { id: "london", location: [51.5074, -0.1278], label: "London" },
  { id: "tokyo", location: [35.6762, 139.6503], label: "Tokyo" },
  { id: "blr", location: [12.9716, 77.5946], label: "Bengaluru" },
  { id: "zurich", location: [47.3769, 8.5417], label: "Zurich" },
];

const GLOBE_ARCS: Arc[] = [
  { id: "arc-blr-sf", from: [12.9716, 77.5946], to: [37.7749, -122.4194], label: "BLR → SFO" },
  { id: "arc-sf-ldn", from: [37.7749, -122.4194], to: [51.5074, -0.1278] },
  { id: "arc-ldn-blr", from: [51.5074, -0.1278], to: [12.9716, 77.5946] },
  { id: "arc-blr-tko", from: [12.9716, 77.5946], to: [35.6762, 139.6503], label: "BLR → TYO" },
  { id: "arc-tko-sf", from: [35.6762, 139.6503], to: [37.7749, -122.4194] },
];

export function Footer(): ReactElement {
  const theme = useResolvedTheme();
  const isDark = theme === "dark";

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer" className="w-full border-t border-foreground/[0.08] bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
        {/* Handwritten quote */}
        <div className="flex flex-col items-center justify-center py-6 sm:py-10">
          <HandwrittenQuote
            quote={"Even when something is important enough\nyou do it even if the odds are not in your favor."}
            attribution="Elon Musk"
            msPerChar={34}
            penTip
            className="max-w-2xl text-2xl leading-relaxed sm:text-[34px] sm:leading-relaxed"
          />
        </div>

        {/* Signature Pen Animation ("Finished") */}
        <div className="flex w-full items-center justify-center py-2 sm:py-4">
          <SignaturePenFooter
            stageOnly
            word="Finished"
            duration={2.6}
            interactive
            theme="auto"
          />
        </div>

        {/* Subtle divider */}
        <div className="my-16 h-px w-full bg-foreground/[0.06] sm:my-20" />

        {/* Main Footer: Globe on the Left, Links on the Right */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Left Column: Interactive 3D Globe */}
          <div className="flex flex-col items-center justify-center lg:col-span-6">
            <div className="relative aspect-square w-full max-w-[380px] sm:max-w-[460px] lg:max-w-[520px] flex items-center justify-center">
              <Globe
                markers={GLOBE_MARKERS}
                arcs={GLOBE_ARCS}
                className="h-full w-full"
                dark={isDark ? 1 : 0}
                baseColor={isDark ? [0.15, 0.18, 0.24] : [0.96, 0.97, 0.99]}
                markerColor={isDark ? [0.38, 0.74, 0.98] : [0.08, 0.45, 0.86]}
                glowColor={isDark ? [0.12, 0.16, 0.24] : [0.90, 0.93, 0.97]}
                arcColor={isDark ? [0.38, 0.74, 0.98] : [0.10, 0.50, 0.90]}
                mapBrightness={isDark ? 2.8 : 8}
                diffuse={isDark ? 1.2 : 1.4}
                markerSize={0.035}
                markerElevation={0.015}
                arcWidth={0.6}
                arcHeight={0.28}
                speed={0.003}
              />
            </div>

            {/* Subtle interactive caption */}
            <div className="mt-4 flex items-center justify-center gap-2.5 font-mono text-[11px] text-foreground/50">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>Available for Global Roles</span>
              </span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/40">Drag to rotate</span>
            </div>
          </div>

          {/* Right Column: All Links & Details */}
          <div className="flex flex-col gap-10 lg:col-span-6 lg:pl-4">
            {/* Identity & Bio header */}
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/50">
                Portfolio 2026
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Shreyansh Rawat
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-foreground/65">
                Data Scientist &amp; AI/ML Engineer. Building intelligent systems, deep
                learning models, neural search architectures, and production-scale machine learning pipelines.
              </p>
            </div>

            {/* Links Columns Grid */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {/* Navigation Links */}
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-xs uppercase tracking-wider text-foreground/50">
                  Navigation
                </span>
                <a
                  href="#home"
                  className="text-sm text-foreground/75 transition-colors hover:text-foreground"
                >
                  Home
                </a>
                <a
                  href="#stack"
                  className="text-sm text-foreground/75 transition-colors hover:text-foreground"
                >
                  My Stack
                </a>
                <a
                  href="#ecosystem"
                  className="text-sm text-foreground/75 transition-colors hover:text-foreground"
                >
                  Ecosystem
                </a>
                <a
                  href="#projects"
                  className="text-sm text-foreground/75 transition-colors hover:text-foreground"
                >
                  Featured Work
                </a>
                <a
                  href="#footer"
                  className="text-sm text-foreground/75 transition-colors hover:text-foreground"
                >
                  Global Presence
                </a>
              </div>

              {/* Connect & Socials */}
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-xs uppercase tracking-wider text-foreground/50">
                  Connect
                </span>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-foreground/75 transition-colors hover:text-foreground"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-foreground/75 transition-colors hover:text-foreground"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-foreground/75 transition-colors hover:text-foreground"
                >
                  <span>X (Twitter)</span>
                  <ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </a>
                <a
                  href="https://huggingface.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-foreground/75 transition-colors hover:text-foreground"
                >
                  <span>Hugging Face</span>
                  <ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </a>
              </div>

              {/* Direct Reach / Status */}
              <div className="col-span-2 flex flex-col gap-2.5 sm:col-span-1">
                <span className="font-mono text-xs uppercase tracking-wider text-foreground/50">
                  Direct Reach
                </span>
                <a
                  href="mailto:contact@shreyanshrawat.dev"
                  className="group inline-flex items-center gap-1.5 text-sm text-foreground/75 transition-colors hover:text-foreground"
                >
                  <Mail className="size-3.5 opacity-60" />
                  <span>Email Me</span>
                </a>
                <div className="mt-2 space-y-1 font-mono text-xs text-foreground/50">
                  <p>IST • UTC+5:30</p>
                  <p>Remote &amp; On-Site</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-foreground/[0.06] pt-8 text-xs text-foreground/50 sm:flex-row">
          <p>© 2026 Shreyansh Rawat. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-1.5 text-foreground/60 transition-colors hover:text-foreground"
          >
            <span>Back to top</span>
            <ArrowUp className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
