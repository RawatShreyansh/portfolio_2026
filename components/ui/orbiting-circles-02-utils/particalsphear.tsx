"use client";

import { useEffect, useRef, type ReactElement } from "react";

interface SpherePoint {
  x: number;
  y: number;
  z: number;
}

const POINT_COUNT = 420;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// Evenly spaced unit-sphere coordinates via Fibonacci spiral.
const SPHERE_POINTS: SpherePoint[] = Array.from({ length: POINT_COUNT }, (_, i) => {
  const y = 1 - (i / (POINT_COUNT - 1)) * 2;
  const radius = Math.sqrt(1 - y * y);
  const theta = GOLDEN_ANGLE * i;
  return {
    x: Math.cos(theta) * radius,
    y,
    z: Math.sin(theta) * radius,
  };
});

/**
 * 3D rotating Fibonacci particle sphere rendered on Canvas 2D so it adapts
 * live to light/dark theme switches without allocating an extra WebGL context.
 */
export default function ParticleSphereAnimation(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let angle = 0;
    let rafId = 0;
    let isDark = document.documentElement.classList.contains("dark");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = (): void => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
    };

    const draw = (): void => {
      if (width > 0 && height > 0) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const sphereRadius = Math.min(width, height) * 0.44;
        const cosY = Math.cos(angle);
        const sinY = Math.sin(angle);
        const tilt = 0.28;
        const cosX = Math.cos(tilt);
        const sinX = Math.sin(tilt);

        const glow = ctx.createRadialGradient(cx, cy, sphereRadius * 0.1, cx, cy, sphereRadius * 1.05);
        if (isDark) {
          glow.addColorStop(0, "rgba(56, 189, 248, 0.08)");
          glow.addColorStop(0.65, "rgba(250, 250, 250, 0.03)");
          glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        } else {
          glow.addColorStop(0, "rgba(2, 132, 199, 0.07)");
          glow.addColorStop(0.65, "rgba(9, 9, 11, 0.03)");
          glow.addColorStop(1, "rgba(255, 255, 255, 0)");
        }
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, sphereRadius * 1.05, 0, Math.PI * 2);
        ctx.fill();

        const baseRgb = isDark ? "250, 250, 250" : "9, 9, 11";
        const accentRgb = isDark ? "56, 189, 248" : "2, 132, 199";

        for (let i = 0; i < SPHERE_POINTS.length; i++) {
          const p = SPHERE_POINTS[i];
          const x1 = p.x * cosY - p.z * sinY;
          const z1 = p.x * sinY + p.z * cosY;
          const y2 = p.y * cosX - z1 * sinX;
          const z2 = p.y * sinX + z1 * cosX;

          const perspective = 2.4 / (2.4 - z2 * 0.75);
          const px = cx + x1 * sphereRadius * perspective;
          const py = cy + y2 * sphereRadius * perspective;

          const depth = (z2 + 1) * 0.5; // 0 (back) -> 1 (front)
          const alpha = 0.1 + depth * 0.65;
          const dotRadius = (0.75 + depth * 1.25) * (width / 360);

          ctx.fillStyle = i % 7 === 0
            ? `rgba(${accentRgb}, ${(alpha * 0.95).toFixed(3)})`
            : `rgba(${baseRgb}, ${alpha.toFixed(3)})`;

          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.7, dotRadius), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reducedMotion) {
        angle += 0.0032;
        rafId = window.requestAnimationFrame(draw);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) draw();
    });
    resizeObserver.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
      if (reducedMotion) draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resize();
    draw();

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="h-full w-full"
    />
  );
}

