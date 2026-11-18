"use client";

import type { CSSProperties, ReactElement } from "react";
import { TechLogo } from "@/components/sections/stack-logos";
import ParticleSphereAnimation from "@/components/ui/orbiting-circles-02-utils/particalsphear";

interface OrbitItem {
  id: string;
  label: string;
  angle: number;
}

interface OrbitRing {
  size: string;
  duration: number;
  icons: OrbitItem[];
}

const KEYFRAMES = `
@keyframes orbit-cw {
  from { transform: rotate(var(--start-angle)) }
  to   { transform: rotate(calc(var(--start-angle) + 360deg)) }
}
@keyframes orbit-ccw {
  from { transform: rotate(var(--start-angle)) }
  to   { transform: rotate(calc(var(--start-angle) - 360deg)) }
}
@keyframes counter-cw {
  from { transform: rotate(var(--counter-offset, 0deg)) }
  to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)) }
}
@keyframes counter-ccw {
  from { transform: rotate(var(--counter-offset, 0deg)) }
  to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)) }
}
@media (prefers-reduced-motion: reduce) {
  * {
    animation-play-state: paused !important;
  }
}
`;

const ORBITS: OrbitRing[] = [
  {
    size: "w-110 h-110 md:w-180 md:h-180",
    duration: 18,
    icons: [
      { id: "python", label: "Python", angle: -90 },
      { id: "pytorch", label: "PyTorch", angle: 0 },
      { id: "claude", label: "Claude", angle: 90 },
      { id: "cuda", label: "CUDA", angle: 180 },
    ],
  },
  {
    size: "w-150 h-150 md:w-220 md:h-220",
    duration: 24,
    icons: [
      { id: "gemini", label: "Gemini", angle: -120 },
      { id: "chatgpt", label: "ChatGPT", angle: -60 },
      { id: "tensorflow", label: "TensorFlow", angle: 0 },
      { id: "typescript", label: "TypeScript", angle: 60 },
      { id: "react", label: "React", angle: 120 },
      { id: "langchain", label: "LangChain", angle: 180 },
    ],
  },
  {
    size: "w-180 h-180 md:w-265 md:h-265",
    duration: 30,
    icons: [
      { id: "nextjs", label: "Next.js", angle: -135 },
      { id: "postgres", label: "PostgreSQL", angle: -90 },
      { id: "databricks", label: "Databricks", angle: -45 },
      { id: "docker", label: "Docker", angle: 0 },
      { id: "kubernetes", label: "Kubernetes", angle: 45 },
      { id: "huggingface", label: "Hugging Face", angle: 90 },
      { id: "fastapi", label: "FastAPI", angle: 135 },
      { id: "aws", label: "AWS", angle: 180 },
    ],
  },
];

export default function OrbitingCirclesGlobe(): ReactElement {
  return (
    <div className="relative flex h-110 w-full justify-center overflow-hidden md:h-160">
      <style href="orbiting-circles-02" precedence="default">
        {KEYFRAMES}
      </style>

      {/* Center particle globe */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 aspect-square w-75 -translate-x-1/2 translate-y-1/2 md:w-145">
        <ParticleSphereAnimation />
      </div>

      {/* Orbiting rings */}
      {ORBITS.map((orbit, index) => {
        const isCW = index % 2 === 0;
        const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
        const counterAnim = isCW ? "counter-cw" : "counter-ccw";

        return (
          <div
            key={index}
            className={`pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-border ${orbit.size}`}
          >
            {orbit.icons.map((iconData) => (
              <div
                key={iconData.id}
                className="absolute top-0 left-1/2 flex h-1/2 -translate-x-1/2 origin-bottom flex-col items-center justify-start"
                style={
                  {
                    "--start-angle": `${iconData.angle}deg`,
                    animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                  } as CSSProperties
                }
              >
                <div
                  title={iconData.label}
                  className="pointer-events-auto relative z-10 -translate-y-1/2 rounded-full border border-border bg-background p-3 shadow-xs transition-transform duration-300 hover:scale-110 sm:p-3.5"
                  style={
                    {
                      "--counter-offset": `${-iconData.angle}deg`,
                      animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                    } as CSSProperties
                  }
                >
                  <TechLogo
                    id={iconData.id}
                    colored
                    className="size-6 sm:size-6 md:size-7"
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

