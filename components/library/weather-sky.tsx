"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import { Aurora } from "@/components/library/aurora";
import { LightRays } from "@/components/library/light-rays";
import { Precipitation } from "@/components/library/precipitation";
import { useResolvedTheme } from "@/lib/hooks/use-resolved-theme";
import { cn } from "@/lib/utils";

/** The scenes, in their usual order: the aurora, rain, snow, a clear sky with a few clouds, then sunlight. */
export const WEATHER_SCENES = ["aurora", "rain", "snow", "clouds", "sun"] as const;
export type WeatherScene = (typeof WEATHER_SCENES)[number];

const TICK_MS = 250;

// The drifting clouds and the sun's slow breath. They run only while their scene shows, and not at all
// with reduced motion. React hoists and de-duplicates this, so the component needs no stylesheet.
const KEYFRAMES = `
.weather-cloud { scale: var(--cloud-scale, 1); animation: weather-cloud-drift linear infinite; animation-play-state: paused; }
[data-scene="clouds"] .weather-cloud, [data-scene="sun"] .weather-cloud { animation-play-state: running; }
@keyframes weather-cloud-drift { from { translate: -25vw 0; } to { translate: 110vw 0; } }
.weather-sun { animation: weather-sun-breathe 8s ease-in-out infinite alternate; animation-play-state: paused; }
[data-scene="sun"] .weather-sun { animation-play-state: running; }
@keyframes weather-sun-breathe { from { scale: 0.94; opacity: 0.85; } to { scale: 1.04; opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .weather-cloud, .weather-sun { animation: none; } }
`;

/** One soft cloud: overlapping blurred puffs, drifting slowly across. */
function Cloud({
  top,
  scale,
  duration,
  delay,
}: {
  top: string;
  scale: number;
  duration: number;
  delay: number;
}): ReactElement {
  const style = {
    top,
    "--cloud-scale": scale,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  } as CSSProperties;
  return (
    <div aria-hidden className="weather-cloud absolute left-0 h-24 w-72" style={style}>
      <span className="absolute left-6 top-8 h-14 w-40 rounded-full bg-white/90 blur-md dark:bg-slate-400/10 dark:blur-lg" />
      <span className="absolute left-20 top-2 h-20 w-28 rounded-full bg-white/95 blur-md dark:bg-slate-300/10 dark:blur-lg" />
      <span className="absolute left-36 top-7 h-14 w-28 rounded-full bg-white/90 blur-md dark:bg-slate-400/10 dark:blur-lg" />
    </div>
  );
}

const CLOUDS = [
  { top: "8%", scale: 1.1, duration: 70, delay: -10 },
  { top: "22%", scale: 0.8, duration: 90, delay: -45 },
  { top: "4%", scale: 0.7, duration: 110, delay: -80 },
  { top: "30%", scale: 1, duration: 80, delay: -30 },
  { top: "14%", scale: 0.6, duration: 120, delay: -60 },
];

// Soft warm golden sunlight by day; soft silver-blue moonbeam by night.
const SUN_RAYS = {
  colors: ["#f7ca63", "#ffe9bd"],
  intensity: 1.35,
  spread: 0.78,
  density: 12,
  speed: 2.3,
  reach: 0.78,
  dust: 0.45,
  strength: 0.58,
} as const;
const MOON_RAYS = {
  colors: ["#cbd5f5", "#e8ecfa"],
  intensity: 1.05,
  spread: 0.48,
  density: 6,
  speed: 1.5,
  reach: 0.75,
  dust: 0.4,
  strength: 0.52,
} as const;

export interface WeatherSkyProps {
  /** The scenes to cycle through, in order. */
  scenes?: readonly WeatherScene[];
  /** Shows this scene and stops the cycle. Leave it unset to let the sky cycle. */
  scene?: WeatherScene;
  /** The scene it starts on when uncontrolled. */
  defaultScene?: WeatherScene;
  /** Called whenever the scene changes, from the cycle or from a click. */
  onSceneChange?: (scene: WeatherScene) => void;
  /** How long each scene holds, in milliseconds. */
  sceneDuration?: number;
  /** How long one scene takes to fade into the next. */
  fadeDuration?: number;
  /**
   * Pointing at the sky holds the scene; a click or tap on it (anywhere but a
   * link, button or field) moves on to the next.
   */
  interactive?: boolean;
  className?: string;
}

/**
 * A sky that cycles through five kinds of weather, each holding for a while before fading into the next:
 * a mono aurora; rain that gathers into a rippling puddle; snow that piles into a drift; a clear light-blue
 * sky with drifting clouds; and sunlight with golden rays (a moonbeam in dark mode). Fill a positioned
 * container with it and put content over it. Only the scene on screen does any work; with reduced
 * motion it stays on its first scene, still.
 *
 * The root carries `data-scene`, so other parts of the page can follow the weather in CSS, e.g.
 * `main:has([data-scene="sun"]) { … }`.
 */
export function WeatherSky({
  scenes = WEATHER_SCENES,
  scene: controlled,
  defaultScene,
  onSceneChange,
  sceneDuration = 10_000,
  fadeDuration = 2500,
  interactive = true,
  className,
}: WeatherSkyProps): ReactElement {
  const [own, setOwn] = useState<WeatherScene>(defaultScene ?? scenes[0] ?? "aurora");
  const scene = controlled ?? own;
  const rootRef = useRef<HTMLDivElement>(null);
  const changeRef = useRef(onSceneChange);
  const sceneRef = useRef(scene);

  useEffect(() => {
    changeRef.current = onSceneChange;
    sceneRef.current = scene;
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    let onScreen = true;
    let hovered = false;
    let elapsed = 0;
    const next = (): void => {
      elapsed = 0;
      const index = scenes.indexOf(sceneRef.current);
      const following = scenes[(index + 1) % scenes.length] ?? scenes[0];
      if (!following) return;
      if (controlled === undefined) setOwn(following);
      changeRef.current?.(following);
    };
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
    });
    visibility.observe(root);
    // The scene's time runs only while the sky is on screen, the tab is visible and nobody is pointing
    // at it, so a visitor who stops to look, or comes back later, carries on from where they were.
    const timer =
      controlled === undefined
        ? window.setInterval(() => {
          if (!onScreen || hovered || document.visibilityState !== "visible") return;
          elapsed += TICK_MS;
          if (elapsed >= sceneDuration) next();
        }, TICK_MS)
        : 0;

    // The sky sits behind other content, so the pointer is followed on the window.
    const inSky = (event: PointerEvent): boolean => {
      const box = root.getBoundingClientRect();
      return (
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom
      );
    };
    const onMove = (event: PointerEvent): void => {
      if (event.pointerType === "touch") return;
      hovered = inSky(event);
    };
    const onDown = (event: PointerEvent): void => {
      if (!inSky(event)) return;
      // Links, buttons and fields keep their own clicks.
      if (
        event.target instanceof Element &&
        event.target.closest("a, button, input, textarea, select, [role='button'], nav")
      )
        return;
      next();
    };
    if (interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
    }
    return () => {
      window.clearInterval(timer);
      visibility.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [scenes, controlled, sceneDuration, interactive]);

  // The WebGL layers fade through their own opacity, which their blending needs, eased towards each
  // scene's values over the fade.
  const stormy = scene === "rain" || scene === "snow";
  const auroraTarget = scene === "aurora" || stormy ? 1 : 0;
  const dimTarget = stormy ? 1 : 0;
  const raysTarget = scene === "sun" ? 1 : 0;
  const [levels, setLevels] = useState({
    aurora: auroraTarget,
    dim: dimTarget,
    rays: raysTarget,
  });
  const levelsRef = useRef(levels);
  useEffect(() => {
    const step = 50 / Math.max(50, fadeDuration);
    const toward = (value: number, target: number): number =>
      Math.abs(target - value) <= step ? target : value + Math.sign(target - value) * step;
    const timer = window.setInterval(() => {
      const current = levelsRef.current;
      const next = {
        aurora: toward(current.aurora, auroraTarget),
        dim: toward(current.dim, dimTarget),
        rays: toward(current.rays, raysTarget),
      };
      levelsRef.current = next;
      setLevels(next);
      if (next.aurora === auroraTarget && next.dim === dimTarget && next.rays === raysTarget)
        window.clearInterval(timer);
    }, 50);
    return () => window.clearInterval(timer);
  }, [auroraTarget, dimTarget, raysTarget, fadeDuration]);

  // The rays load the first time the sun comes out.
  const [sunSeen, setSunSeen] = useState(scene === "sun");
  if (scene === "sun" && !sunSeen) {
    setSunSeen(true);
  }

  const night = useResolvedTheme() === "dark";
  const { strength, ...rays } = night ? MOON_RAYS : SUN_RAYS;

  const layer = (shown: boolean): string =>
    cn(
      "pointer-events-none absolute inset-0 transition-opacity ease-in-out",
      shown ? "opacity-100" : "opacity-0",
    );
  // The sky and sun melt into the page at the bottom instead of ending on an edge.
  const melt = "[mask-image:linear-gradient(to_bottom,#000_55%,transparent)]";
  const fade = { transitionDuration: `${fadeDuration}ms` };
  const clear = scene === "clouds" || scene === "sun";

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-scene={scene}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <style href="poulo-weather-sky" precedence="default">
        {KEYFRAMES}
      </style>

      {/* 1. The aurora. Rain and snow keep it, dimmed, as the overcast sky they fall from. */}
      <div className="absolute inset-x-0 top-0 h-[600px] max-h-full">
        <Aurora
          colorStops={night ? ["#0c4a6e", "#0284c7", "#0f766e"] : ["#38bdf8", "#0284c7", "#14b8a6"]}
          brightness={0.75 * (1 - levels.dim * 0.5)}
          opacity={(night ? 0.55 : 0.45) * levels.aurora}
          paused={levels.aurora === 0}
        />
      </div>

      {/* 2. Rain and snow fall to the bottom edge and gather there. */}
      <div className={layer(scene === "rain")} style={fade}>
        <Precipitation kind="rain" active={scene === "rain"} dark={night} />
      </div>
      <div className={layer(scene === "snow")} style={fade}>
        <Precipitation kind="snow" active={scene === "snow"} dark={night} />
      </div>

      {/* 3. A clear, very light blue sky with a few clouds; it stays under the sun. */}
      <div className={cn(melt, layer(clear))} style={fade}>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(224_240_253),rgb(239_247_254/0.7)_45%,transparent)] dark:bg-[linear-gradient(to_bottom,rgb(30_41_59/0.55),rgb(23_32_48/0.3)_45%,transparent)]" />
        <div
          className={cn("absolute inset-0 transition-opacity", scene === "sun" ? "opacity-40" : "opacity-100")}
          style={fade}
        >
          {CLOUDS.map((cloud) => (
            <Cloud key={cloud.top + cloud.duration} {...cloud} />
          ))}
        </div>
      </div>

      {/* 4. Soft sun glow (or subtle cool moon glow at night) at the top right, breathing slowly, under the rays. */}
      <div className={cn(melt, layer(scene === "sun"))} style={fade}>
        <div className="opacity-80 dark:hidden">
          <div className="weather-sun absolute right-[-300px] top-[-320px] size-[820px] rounded-full bg-[radial-gradient(circle,rgb(255_244_204)_0%,rgb(255_229_160/0.65)_30%,rgb(255_222_150/0.22)_55%,transparent_72%)] blur-3xl" />
          <div className="absolute right-[-80px] top-[-140px] size-[360px] rounded-full bg-[radial-gradient(circle,rgb(255_252_235)_0%,rgb(255_240_190/0.55)_45%,transparent_70%)] blur-2xl" />
        </div>
        <div className="hidden dark:block">
          <div className="weather-sun absolute right-[-260px] top-[-280px] size-[720px] rounded-full bg-[radial-gradient(circle,rgb(224_231_255/0.16)_0%,rgb(199_210_254/0.08)_35%,transparent_70%)] blur-3xl" />
          <div className="absolute right-[-70px] top-[-120px] size-[300px] rounded-full bg-[radial-gradient(circle,rgb(238_242_255/0.18)_0%,rgb(224_231_255/0.06)_50%,transparent_72%)] blur-2xl" />
        </div>
      </div>

      {/* 5. Rays from the top right with dust floating in them, fading softly into the UI. */}
      {sunSeen && (
        <div className={cn("pointer-events-none absolute inset-0", melt)}>
          <LightRays
            {...rays}
            origin="top-right"
            opacity={levels.rays * strength}
            paused={levels.rays === 0}
            fadeToBottom
          />
        </div>
      )}
    </div>
  );
}
