"use client";

import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { FolderGit2, Globe, Home, Layers, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/library/theme-toggle";
import { cn } from "@/lib/utils";

interface NavItemConfig {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: "home", label: "Home", href: "#home", icon: <Home className="size-full" /> },
  { id: "stack", label: "Tech Stack", href: "#stack", icon: <Layers className="size-full" /> },
  { id: "ecosystem", label: "Ecosystem", href: "#ecosystem", icon: <Globe className="size-full" /> },
  { id: "projects", label: "Projects", href: "#projects", icon: <FolderGit2 className="size-full" /> },
  { id: "contact", label: "Contact", href: "#contact", icon: <Mail className="size-full" /> },
];

export function FloatingNav(): ReactElement {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const mouseX = useMotionValue<number>(Infinity);

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
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center p-3 sm:p-5 pointer-events-none transition-all duration-300"
    >
      <nav
        aria-label="Main Navigation"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "pointer-events-auto flex items-center gap-1 sm:gap-1.5 rounded-full border px-2.5 py-1.5 transition-all duration-500",
          scrolled
            ? "border-foreground/[0.14] bg-background/85 shadow-lg shadow-foreground/[0.04] backdrop-blur-xl"
            : "border-foreground/[0.08] bg-background/60 shadow-sm backdrop-blur-md",
        )}
      >
        {/* Monogram / Brand Mark */}
        <a
          href="#home"
          aria-label="Shreyansh Rawat — Home"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground/[0.05] font-mono text-xs font-bold tracking-tighter text-foreground transition-all duration-200 hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          SR
        </a>

        <div className="mx-1 h-4 w-px bg-foreground/10 shrink-0" aria-hidden="true" />

        {/* Floating Dock Nav Items with Spring Magnification */}
        <ul className="flex items-center gap-1 sm:gap-1.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <DockItem
                item={item}
                mouseX={mouseX}
                isActive={activeSection === item.id}
              />
            </li>
          ))}
        </ul>

        <div className="mx-1 h-4 w-px bg-foreground/10 shrink-0" aria-hidden="true" />

        {/* Integrated Theme Toggle */}
        <div className="shrink-0 flex items-center justify-center">
          <ThemeToggle className="size-9 rounded-full border-none bg-foreground/[0.05] text-foreground/80 hover:bg-foreground/[0.1] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50" />
        </div>
      </nav>
    </header>
  );
}

interface DockItemProps {
  item: NavItemConfig;
  mouseX: MotionValue<number>;
  isActive: boolean;
}

function DockItem({ item, mouseX, isActive }: DockItemProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Magnification physics: distance from cursor to icon center
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Scale from base (38px) to peak (54px) within 140px proximity radius
  const widthTransform = useTransform(
    distance,
    [-140, 0, 140],
    shouldReduceMotion ? [38, 38, 38] : [38, 54, 38],
  );
  const heightTransform = useTransform(
    distance,
    [-140, 0, 140],
    shouldReduceMotion ? [38, 38, 38] : [38, 54, 38],
  );

  // Icon dimensions scale proportionally
  const widthTransformIcon = useTransform(
    distance,
    [-140, 0, 140],
    shouldReduceMotion ? [18, 18, 18] : [18, 25, 18],
  );
  const heightTransformIcon = useTransform(
    distance,
    [-140, 0, 140],
    shouldReduceMotion ? [18, 18, 18] : [18, 25, 18],
  );

  // Spring physics from floating-dock: mass 0.1, stiffness 150, damping 12
  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <a
      href={item.href}
      aria-label={item.label}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="relative flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full transition-colors duration-200",
          isActive
            ? "bg-foreground/[0.12] text-foreground font-semibold"
            : "bg-foreground/[0.04] text-foreground/70 hover:bg-foreground/[0.08] hover:text-foreground",
        )}
      >
        {/* Animated Tooltip (positioned below top-dock with smooth slide & fade) */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: -6, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -4, x: "-50%" }}
              transition={{ duration: 0.14 }}
              className="pointer-events-none absolute top-full mt-2 left-1/2 z-50 w-max rounded-md border border-foreground/[0.1] bg-background/95 px-2.5 py-1 text-[11px] font-medium tracking-tight text-foreground shadow-md backdrop-blur-md"
              role="tooltip"
            >
              {item.label}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scaled Icon */}
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {item.icon}
        </motion.div>

        {/* Active Section Indicator Dot */}
        {isActive && (
          <motion.span
            layoutId="activeDockDot"
            className="absolute -bottom-1 size-1 rounded-full bg-foreground shadow-xs shadow-foreground/40"
            aria-hidden="true"
          />
        )}
      </motion.div>
    </a>
  );
}
