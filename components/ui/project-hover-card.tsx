"use client";

import type { ReactElement } from "react";
import { ArrowUpRight } from "lucide-react";

export type ProjectVisualType =
  | "vector-search"
  | "agent-swarm"
  | "computer-vision"
  | "stream-pipeline"
  | "inference-cluster";

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  category: string;
  description: string;
  metric: string;
  stack: string[];
  year: string;
  url: string;
  visualType: ProjectVisualType;
  accentColor: string;
}

interface ProjectPreviewGraphicProps {
  type: ProjectVisualType;
  color: string;
}

export function ProjectPreviewGraphic({ type, color }: ProjectPreviewGraphicProps): ReactElement {
  switch (type) {
    case "vector-search":
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full" fill="none">
          {/* Subtle grid background */}
          <defs>
            <pattern id="grid-vs" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.8" />
            </pattern>
            <radialGradient id="grad-vs" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="320" height="180" fill="url(#grid-vs)" />
          <circle cx="160" cy="90" r="70" fill="url(#grad-vs)" />

          {/* Central query point */}
          <circle cx="160" cy="90" r="6" fill={color} />
          <circle cx="160" cy="90" r="14" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" className="animate-spin" style={{ transformOrigin: "160px 90px", animationDuration: "10s" }} />

          {/* Vector connection rays */}
          <line x1="160" y1="90" x2="80" y2="45" stroke={color} strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="4 2" />
          <line x1="160" y1="90" x2="240" y2="50" stroke={color} strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="4 2" />
          <line x1="160" y1="90" x2="100" y2="135" stroke={color} strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="4 2" />
          <line x1="160" y1="90" x2="225" y2="130" stroke={color} strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="4 2" />
          <line x1="160" y1="90" x2="270" y2="90" stroke={color} strokeWidth="1.2" strokeOpacity="0.3" strokeDasharray="4 2" />

          {/* Vector cluster nodes */}
          <circle cx="80" cy="45" r="4.5" fill={color} fillOpacity="0.85" />
          <circle cx="240" cy="50" r="4.5" fill={color} fillOpacity="0.85" />
          <circle cx="100" cy="135" r="4.5" fill={color} fillOpacity="0.85" />
          <circle cx="225" cy="130" r="4.5" fill={color} fillOpacity="0.85" />
          <circle cx="270" cy="90" r="3" fill={color} fillOpacity="0.6" />

          {/* Neighbor points */}
          <circle cx="65" cy="55" r="2.5" fill="currentColor" fillOpacity="0.35" />
          <circle cx="95" cy="35" r="2" fill="currentColor" fillOpacity="0.35" />
          <circle cx="255" cy="40" r="2.5" fill="currentColor" fillOpacity="0.35" />
          <circle cx="115" cy="145" r="2" fill="currentColor" fillOpacity="0.35" />
          <circle cx="215" cy="145" r="2.5" fill="currentColor" fillOpacity="0.35" />

          {/* Cosine similarity metrics HUD */}
          <rect x="180" y="24" width="86" height="20" rx="4" fill="currentColor" fillOpacity="0.08" />
          <text x="223" y="38" textAnchor="middle" fill="currentColor" fontSize="9" fontFamily="monospace" opacity="0.85">cos θ = 0.984</text>
        </svg>
      );

    case "agent-swarm":
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full" fill="none">
          <defs>
            <radialGradient id="grad-as" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="160" cy="90" r="80" fill="url(#grad-as)" />

          {/* Neural orchestrator hub */}
          <polygon points="160,50 195,70 195,110 160,130 125,110 125,70" stroke={color} strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          <circle cx="160" cy="90" r="7" fill={color} />

          {/* Peripheral swarm nodes */}
          <g className="transition-transform duration-700">
            {/* Top Node: Tool Executor */}
            <circle cx="160" cy="28" r="5" fill={color} />
            <line x1="160" y1="50" x2="160" y2="33" stroke={color} strokeWidth="1.2" strokeOpacity="0.6" />

            {/* Left Node: Memory Graph */}
            <circle cx="70" cy="90" r="5" fill={color} />
            <line x1="125" y1="90" x2="75" y2="90" stroke={color} strokeWidth="1.2" strokeOpacity="0.6" />

            {/* Right Node: Reasoning LLM */}
            <circle cx="250" cy="90" r="5" fill={color} />
            <line x1="195" y1="90" x2="245" y2="90" stroke={color} strokeWidth="1.2" strokeOpacity="0.6" />

            {/* Bottom-left: Reflection Agent */}
            <circle cx="100" cy="150" r="4.5" fill={color} />
            <line x1="135" y1="120" x2="103" y2="146" stroke={color} strokeWidth="1.2" strokeOpacity="0.6" />

            {/* Bottom-right: Evaluator */}
            <circle cx="220" cy="150" r="4.5" fill={color} />
            <line x1="185" y1="120" x2="217" y2="146" stroke={color} strokeWidth="1.2" strokeOpacity="0.6" />
          </g>

          {/* Dynamic pulsing signals */}
          <circle cx="160" cy="40" r="2" fill="#fff" />
          <circle cx="100" cy="90" r="2" fill="#fff" />
          <circle cx="220" cy="90" r="2" fill="#fff" />

          {/* HUD tag */}
          <rect x="22" y="18" width="94" height="20" rx="4" fill="currentColor" fillOpacity="0.08" />
          <text x="69" y="32" textAnchor="middle" fill="currentColor" fontSize="9" fontFamily="monospace" opacity="0.85">SWARM · 5 AGENTS</text>
        </svg>
      );

    case "computer-vision":
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full" fill="none">
          <defs>
            <radialGradient id="grad-cv" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="320" height="180" fill="url(#grad-cv)" />

          {/* Camera Frame Viewport Overlay */}
          <path d="M 25 35 L 25 22 L 45 22" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.8" />
          <path d="M 295 35 L 295 22 L 275 22" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.8" />
          <path d="M 25 145 L 25 158 L 45 158" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.8" />
          <path d="M 295 145 L 295 158 L 275 158" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.8" />

          {/* Center Crosshair */}
          <line x1="150" y1="90" x2="170" y2="90" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
          <line x1="160" y1="80" x2="160" y2="100" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />

          {/* Primary Detected Object Bounding Box */}
          <rect x="80" y="42" width="160" height="96" rx="3" stroke={color} strokeWidth="1.8" strokeDasharray="6 3" fill={color} fillOpacity="0.06" />

          {/* Label Tag on Box */}
          <rect x="80" y="27" width="112" height="15" rx="2" fill={color} />
          <text x="85" y="38" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">ROBOT_ACTOR: 99.4%</text>

          {/* Secondary Object Box */}
          <rect x="210" y="75" width="70" height="65" rx="2" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
          <text x="214" y="70" fill="currentColor" opacity="0.6" fontSize="8" fontFamily="monospace">OBSTACLE</text>

          {/* Segmentation Mask Contours */}
          <path d="M 100 80 Q 130 60 160 85 T 220 80 Q 230 115 180 125 T 100 115 Z" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1" />

          {/* FPS Badge */}
          <rect x="236" y="22" width="58" height="18" rx="3" fill="currentColor" fillOpacity="0.08" />
          <text x="265" y="34" textAnchor="middle" fill="currentColor" fontSize="8.5" fontFamily="monospace" opacity="0.85">60.2 FPS</text>
        </svg>
      );

    case "stream-pipeline":
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full" fill="none">
          <defs>
            <radialGradient id="grad-sp" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="160" cy="90" r="75" fill="url(#grad-sp)" />

          {/* Three Pipeline Stream Lanes */}
          <path d="M 30 55 C 100 55, 120 75, 160 75 C 200 75, 230 55, 290 55" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
          <path d="M 30 90 C 90 90, 110 90, 160 90 C 210 90, 230 90, 290 90" stroke={color} strokeWidth="2" strokeOpacity="0.75" />
          <path d="M 30 125 C 100 125, 120 105, 160 105 C 200 105, 230 125, 290 125" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />

          {/* Processing Nodes */}
          {/* Stage 1: Ingest */}
          <rect x="65" y="75" width="28" height="30" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
          <circle cx="79" cy="90" r="3" fill="currentColor" opacity="0.6" />

          {/* Stage 2: Feature Extraction (Main) */}
          <rect x="145" y="70" width="30" height="40" rx="4" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
          <circle cx="160" cy="90" r="4.5" fill={color} />

          {/* Stage 3: Inference Sink */}
          <rect x="225" y="75" width="28" height="30" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
          <circle cx="239" cy="90" r="3" fill="currentColor" opacity="0.6" />

          {/* Packets flowing along lane */}
          <circle cx="115" cy="90" r="3" fill={color} />
          <circle cx="195" cy="90" r="3" fill={color} />
          <circle cx="265" cy="90" r="2.5" fill={color} />

          {/* Flow Rate HUD */}
          <rect x="24" y="20" width="102" height="19" rx="4" fill="currentColor" fillOpacity="0.08" />
          <text x="75" y="33" textAnchor="middle" fill="currentColor" fontSize="8.5" fontFamily="monospace" opacity="0.85">STREAM · 150K EPS</text>
        </svg>
      );

    case "inference-cluster":
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full" fill="none">
          <defs>
            <radialGradient id="grad-ic" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="160" cy="90" r="75" fill="url(#grad-ic)" />

          {/* Distributed GPU Server Cluster Array */}
          <g>
            {/* Server Rack 1 */}
            <rect x="55" y="50" width="56" height="80" rx="4" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
            <line x1="65" y1="65" x2="101" y2="65" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
            <line x1="65" y1="80" x2="101" y2="80" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
            <line x1="65" y1="95" x2="101" y2="95" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
            <line x1="65" y1="110" x2="101" y2="110" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
            <circle cx="98" cy="65" r="1.5" fill="#10b981" />
            <circle cx="98" cy="80" r="1.5" fill="#10b981" />
            <circle cx="98" cy="95" r="1.5" fill="#10b981" />
            <circle cx="98" cy="110" r="1.5" fill="#10b981" />

            {/* Central High-Capacity Accelerator Rack */}
            <rect x="132" y="42" width="56" height="96" rx="4" fill={color} fillOpacity="0.09" stroke={color} strokeWidth="1.5" />
            <line x1="142" y1="60" x2="178" y2="60" stroke={color} strokeOpacity="0.5" strokeWidth="1.5" />
            <line x1="142" y1="78" x2="178" y2="78" stroke={color} strokeOpacity="0.5" strokeWidth="1.5" />
            <line x1="142" y1="96" x2="178" y2="96" stroke={color} strokeOpacity="0.5" strokeWidth="1.5" />
            <line x1="142" y1="114" x2="178" y2="114" stroke={color} strokeOpacity="0.5" strokeWidth="1.5" />
            <circle cx="175" cy="60" r="2" fill={color} />
            <circle cx="175" cy="78" r="2" fill={color} />
            <circle cx="175" cy="96" r="2" fill={color} />
            <circle cx="175" cy="114" r="2" fill={color} />

            {/* Server Rack 3 */}
            <rect x="209" y="50" width="56" height="80" rx="4" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
            <line x1="219" y1="65" x2="255" y2="65" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
            <line x1="219" y1="80" x2="255" y2="80" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
            <line x1="219" y1="95" x2="255" y2="95" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
            <line x1="219" y1="110" x2="255" y2="110" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
            <circle cx="252" cy="65" r="1.5" fill="#10b981" />
            <circle cx="252" cy="80" r="1.5" fill="#10b981" />
            <circle cx="252" cy="95" r="1.5" fill="#10b981" />
            <circle cx="252" cy="110" r="1.5" fill="#10b981" />
          </g>

          {/* Interconnect fabric lines */}
          <path d="M 111 90 L 132 90" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 188 90 L 209 90" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Metric Badge */}
          <rect x="190" y="20" width="105" height="19" rx="4" fill="currentColor" fillOpacity="0.08" />
          <text x="242" y="33" textAnchor="middle" fill="currentColor" fontSize="8.5" fontFamily="monospace" opacity="0.85">TRITON · 3.8x BATCH</text>
        </svg>
      );
  }
}

interface ProjectHoverPreviewCardProps {
  project: ProjectItem | null;
  position: { x: number; y: number };
  visible: boolean;
}

export function ProjectHoverPreviewCard({
  project,
  position,
  visible,
}: ProjectHoverPreviewCardProps): ReactElement | null {
  if (!project) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-50 hidden transition-[opacity,transform] duration-200 ease-out md:block"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: visible ? 1 : 0,
        transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.94})`,
      }}
    >
      <div className="relative w-[340px] overflow-hidden rounded-xl border border-foreground/15 bg-background/95 p-3.5 shadow-2xl backdrop-blur-xl transition-colors duration-300">
        {/* Visual Preview Window */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-foreground/10 bg-foreground/[0.03]">
          <ProjectPreviewGraphic type={project.visualType} color={project.accentColor} />

          {/* Live Metric Tag */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-tight text-foreground/80 shadow-sm backdrop-blur-md">
            <span
              className="inline-block size-1.5 rounded-full"
              style={{ backgroundColor: project.accentColor }}
            />
            <span>{project.metric}</span>
          </div>
        </div>

        {/* Card Metadata info */}
        <div className="mt-3 space-y-1 px-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/50">
              {project.category}
            </span>
            <span className="font-mono text-[11px] text-foreground/40">{project.year}</span>
          </div>
          <h4 className="text-base font-semibold tracking-tight text-foreground">
            {project.title}
          </h4>
          <p className="line-clamp-2 text-xs leading-relaxed text-foreground/65">
            {project.description}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-1">
            {project.stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded border border-foreground/10 bg-foreground/[0.03] px-2 py-0.5 font-mono text-[10px] text-foreground/60"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-2.5 flex items-center gap-1 border-t border-foreground/[0.08] pt-2 font-mono text-[11px] font-medium text-foreground/75">
            <span>Explore Case &amp; Code</span>
            <ArrowUpRight className="size-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

