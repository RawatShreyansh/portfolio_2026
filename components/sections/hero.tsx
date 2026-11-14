"use client";

import { ThemeToggle } from "@/components/library/theme-toggle";
import { WeatherSky } from "@/components/library/weather-sky";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <WeatherSky defaultScene="aurora" interactive={false} />

      <ThemeToggle className="fixed right-6 top-6 z-50" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-foreground/60">
          Data Scientist · AI/ML Engineer
        </p>
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
          Shreyansh Rawat
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
          Designing intelligent systems from research to production — deep
          learning, generative AI, and scalable ML infrastructure.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-7 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-foreground/20 bg-background/50 px-7 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-foreground/10"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}

