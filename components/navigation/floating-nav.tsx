"use client";

import { useEffect, useState, type ReactElement } from "react";
import { ThemeToggle } from "@/components/library/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Stack", href: "#stack" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function FloatingNav(): ReactElement {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Track active sections via IntersectionObserver
    const sections = NAV_ITEMS.map((item) => document.querySelector(item.href)).filter(
      Boolean,
    ) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -50% 0px",
        threshold: 0.1,
      },
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      role="banner"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none transition-all duration-300"
    >
      <nav
        aria-label="Main Navigation"
        className={cn(
          "pointer-events-auto flex items-center gap-1 sm:gap-2 rounded-full border p-1.5 transition-all duration-500",
          scrolled
            ? "border-foreground/[0.12] bg-background/85 shadow-lg shadow-foreground/[0.03] backdrop-blur-xl"
            : "border-foreground/[0.08] bg-background/60 backdrop-blur-md",
        )}
      >
        {/* Monogram / Brand mark */}
        <a
          href="#home"
          aria-label="Shreyansh Rawat — Home"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground/[0.05] font-mono text-xs font-bold tracking-tighter text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          SR
        </a>

        <div className="mx-1 h-4 w-px bg-foreground/10" aria-hidden="true" />

        {/* Section Links */}
        <ul className="flex items-center gap-0.5 sm:gap-1">
          {NAV_ITEMS.map((item) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "relative inline-flex h-8 items-center justify-center rounded-full px-2.5 sm:px-3 text-xs font-medium tracking-tight transition-all duration-300",
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-foreground/65 hover:text-foreground hover:bg-foreground/[0.04]",
                  )}
                >
                  {/* Subtle active background pill */}
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-full bg-foreground/[0.08]"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mx-1 h-4 w-px bg-foreground/10" aria-hidden="true" />

        {/* Integrated Theme Toggle */}
        <div className="shrink-0">
          <ThemeToggle className="size-8.5 rounded-full border-none bg-foreground/[0.05] text-foreground/80 hover:bg-foreground/[0.1] hover:text-foreground" />
        </div>
      </nav>
    </header>
  );
}

