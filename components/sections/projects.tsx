"use client";

import type { ReactElement } from "react";
import { useCallback, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FRAME_CLASS, FrameRule } from "@/components/library/frame-rule";
import {
  ProjectHoverPreviewCard,
  ProjectPreviewGraphic,
  type ProjectItem,
} from "@/components/ui/project-hover-card";

const PROJECTS: ProjectItem[] = [
  {
    id: "aura-vector-engine",
    index: "01",
    title: "Aura Vector Engine",
    category: "High-Performance Neural Retrieval",
    description:
      "Distributed vector similarity search engine indexing multi-million embedding dimensions with sub-8ms P99 latency.",
    metric: "8ms P99 · 10M+ Vectors",
    stack: ["PyTorch", "Qdrant", "FastAPI", "CUDA", "Docker"],
    year: "2026",
    url: "https://github.com/RawatShreyansh",
    visualType: "vector-search",
    accentColor: "#38bdf8", // Sky blue
  },
  {
    id: "omniagent-swarm",
    index: "02",
    title: "OmniAgent Swarm",
    category: "Agentic AI & Swarm Orchestration",
    description:
      "Autonomous multi-agent runtime coordinating LLMs, tool synthesis, dynamic memory graphs, and self-correcting workflows.",
    metric: "Tool Synthesis · Memory Graph",
    stack: ["LangGraph", "Python", "Next.js", "FastAPI", "Redis"],
    year: "2026",
    url: "https://github.com/RawatShreyansh",
    visualType: "agent-swarm",
    accentColor: "#a855f7", // Violet-purple
  },
  {
    id: "khoros-vision",
    index: "03",
    title: "Khoros Vision Perception",
    category: "Real-Time Multimodal Vision",
    description:
      "Zero-shot object detection and spatial depth segmentation pipeline accelerated with TensorRT for edge robotics.",
    metric: "60 FPS @ 4K · TensorRT Accelerated",
    stack: ["TensorRT", "PyTorch", "OpenCV", "CUDA", "C++"],
    year: "2025",
    url: "https://github.com/RawatShreyansh",
    visualType: "computer-vision",
    accentColor: "#10b981", // Emerald
  },
  {
    id: "chronos-stream",
    index: "04",
    title: "Chronos Distributed Stream",
    category: "Production Feature Store & MLOps",
    description:
      "Streaming feature engineering engine processing high-throughput inference events with real-time drift detection.",
    metric: "150K req/sec · Zero-Drift Pipeline",
    stack: ["Apache Kafka", "Ray", "Python", "Prometheus", "Docker"],
    year: "2025",
    url: "https://github.com/RawatShreyansh",
    visualType: "stream-pipeline",
    accentColor: "#f59e0b", // Amber
  },
  {
    id: "neuromesh-serving",
    index: "05",
    title: "NeuroMesh Model Serving",
    category: "Distributed Deep Learning Inference",
    description:
      "Scalable LLM and generative diffusion cluster with dynamic tensor batching, Triton backend, and speculative decoding.",
    metric: "3.8x Throughput · Speculative Decoding",
    stack: ["Triton", "vLLM", "Kubernetes", "PyTorch", "NVIDIA H100"],
    year: "2024",
    url: "https://github.com/RawatShreyansh",
    visualType: "inference-cluster",
    accentColor: "#ec4899", // Pink
  },
];

export function ProjectsSection(): ReactElement {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [previewPos, setPreviewPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [previewVisible, setPreviewVisible] = useState(false);
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Offset card slightly to the right & down from cursor to avoid covering the text
    const offsetX = 180;
    const offsetY = -40;

    // Boundary check so the hover card stays within viewport bounds
    const screenW = typeof window !== "undefined" ? window.innerWidth : 1200;
    const screenH = typeof window !== "undefined" ? window.innerHeight : 800;

    const x = Math.min(screenW - 190, Math.max(190, e.clientX + offsetX));
    const y = Math.min(screenH - 180, Math.max(150, e.clientY + offsetY));

    setPreviewPos({ x, y });
  }, []);

  const handleRowMouseEnter = useCallback((project: ProjectItem) => {
    setActiveProject(project);
    setPreviewVisible(true);
  }, []);

  const handleRowMouseLeave = useCallback(() => {
    setPreviewVisible(false);
  }, []);

  const toggleMobilePreview = useCallback((id: string) => {
    setExpandedMobileId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section id="projects" className="overflow-x-clip" onMouseMove={handleMouseMove}>
      <div className={FRAME_CLASS}>
        <FrameRule />

        <div className="px-6 py-20 sm:px-12 sm:py-28">
          {/* Section Header */}
          <div className="mx-auto mb-14 max-w-2xl text-center sm:mb-20">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/60">
              Selected Work
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured AI &amp; Machine Learning Systems
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground/65 sm:text-base">
              Autonomous agents, high-throughput feature pipelines, neural vector search, and
              distributed GPU inference engines built for production scale.
            </p>
          </div>

          {/* Project Stacking Rows */}
          <div
            ref={containerRef}
            className="mx-auto max-w-[1040px] divide-y divide-foreground/[0.08] border-y border-foreground/[0.08]"
          >
            {PROJECTS.map((project) => (
              <div key={project.id} className="group relative">
                {/* Desktop and Tablet Clickable Row */}
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => handleRowMouseEnter(project)}
                  onMouseLeave={handleRowMouseLeave}
                  onFocus={() => handleRowMouseEnter(project)}
                  onBlur={handleRowMouseLeave}
                  className="flex flex-col gap-4 py-7 transition-colors duration-300 hover:bg-foreground/[0.025] sm:py-8 md:flex-row md:items-center md:justify-between md:gap-8 md:px-6"
                >
                  {/* Left Column: Index & Project Name */}
                  <div className="flex items-baseline gap-4 md:gap-6">
                    <span className="font-mono text-xs font-semibold text-foreground/40 transition-colors duration-300 group-hover:text-foreground/80">
                      {project.index}
                    </span>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-foreground sm:text-2xl">
                          {project.title}
                        </h3>
                        <span
                          className="size-2 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{ backgroundColor: project.accentColor }}
                        />
                      </div>
                      <p className="mt-1 font-mono text-xs text-foreground/55 md:hidden">
                        {project.category}
                      </p>
                    </div>
                  </div>

                  {/* Middle Column: Category & Tech Stack Tags */}
                  <div className="flex flex-col gap-2 md:items-end lg:flex-row lg:items-center lg:gap-6">
                    <span className="hidden font-mono text-xs font-medium text-foreground/50 md:inline-block">
                      {project.category}
                    </span>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded border border-foreground/10 bg-foreground/[0.03] px-2.5 py-0.5 font-mono text-[11px] text-foreground/65 transition-colors duration-300 group-hover:border-foreground/20 group-hover:text-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Year & Navigation Arrow */}
                  <div className="flex items-center justify-between border-t border-foreground/[0.04] pt-3 md:border-none md:pt-0">
                    <span className="font-mono text-xs text-foreground/45 md:hidden">
                      {project.year}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="hidden font-mono text-xs text-foreground/40 md:inline-block">
                        {project.year}
                      </span>
                      <div className="flex size-9 items-center justify-center rounded-full border border-foreground/10 bg-foreground/[0.03] text-foreground/60 transition-all duration-300 group-hover:border-foreground/25 group-hover:bg-foreground group-hover:text-background">
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </a>

                {/* Mobile Preview Toggle Button */}
                <div className="pb-3 md:hidden">
                  <button
                    type="button"
                    onClick={() => toggleMobilePreview(project.id)}
                    className="font-mono text-[11px] text-foreground/60 underline underline-offset-4"
                  >
                    {expandedMobileId === project.id ? "Hide preview ↑" : "Show preview ↓"}
                  </button>

                  {/* Mobile Inline Preview */}
                  {expandedMobileId === project.id && (
                    <div className="mt-3 overflow-hidden rounded-lg border border-foreground/10 bg-foreground/[0.03] p-3">
                      <div className="aspect-[16/9] w-full overflow-hidden rounded border border-foreground/10 bg-background/50">
                        <ProjectPreviewGraphic
                          type={project.visualType}
                          color={project.accentColor}
                        />
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-foreground/75">
                        {project.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-foreground/60">
                        <span>Metric: {project.metric}</span>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-foreground underline"
                        >
                          View Project →
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Subtext info */}
          <div className="mt-12 text-center">
            <p className="font-mono text-xs text-foreground/50">
              Hover over any project row to inspect architecture and performance metrics.
            </p>
          </div>
        </div>

        <FrameRule />
      </div>

      {/* Floating Cursor-Following Project Preview Card (Desktop) */}
      <ProjectHoverPreviewCard
        project={activeProject}
        position={previewPos}
        visible={previewVisible}
      />
    </section>
  );
}

