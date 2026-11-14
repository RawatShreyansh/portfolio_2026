"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactElement } from "react";
import {
  hasGraphicsCard,
  hexToRgb,
  useShaderCanvas,
} from "@/lib/hooks/use-shader-canvas";
import { cn } from "@/lib/utils";

// Curtains of light hanging from the top edge. Their lower hem waves with a
// few octaves of 1D value noise; fine vertical streaks run through them, and
// the colour runs across the three stops from left to right.
const FRAGMENT = `precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uHeight;
uniform float uAmplitude;
uniform float uSpeed;
uniform float uBrightness;
uniform float uOpacity;
uniform float uLean;
uniform float uPointerX;

float hash(float n) { return fract(sin(n * 127.1) * 43758.5453123); }

float valueNoise(float x) {
  float cell = floor(x);
  float t = fract(x);
  float eased = t * t * (3.0 - 2.0 * t);
  return mix(hash(cell), hash(cell + 1.0), eased);
}

float waves(float x, float t) {
  float total = 0.0;
  float weight = 0.55;
  float frequency = 1.0;
  for (int octave = 0; octave < 4; octave++) {
    total += weight * valueNoise(x * frequency + t * (0.35 + 0.15 * float(octave)));
    frequency *= 2.07;
    weight *= 0.5;
  }
  return total;
}

vec3 colourAt(float x) {
  return x < 0.5
    ? mix(uColorA, uColorB, x * 2.0)
    : mix(uColorB, uColorC, (x - 0.5) * 2.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float fromTop = 1.0 - uv.y;
  float t = uTime * uSpeed * 0.22;
  // The pointer draws the curtain towards it, most strongly right under it.
  // GLSL ES 1.0 pow(x, y) is undefined for x <= 0; multiply directly for squares.
  float nearDist = (uv.x - uPointerX) * 3.2;
  float near = exp(-(nearDist * nearDist));
  float x = uv.x * 3.0 + uLean * near;
  float hem = uHeight
    + uAmplitude * 0.2 * (waves(x * 0.85, t) - 0.5)
    + 0.04 * uAmplitude * sin(x * 1.6 + t * 1.4);
  // Brightest just above the hem, thinning towards the top edge.
  float curtain = smoothstep(hem + 0.05, hem - 0.03, fromTop)
    * (0.3 + 0.7 * smoothstep(0.0, max(hem, 0.01), fromTop));
  float streaks = 0.82 + 0.18 * valueNoise(uv.x * 22.0 + t * 1.6);
  float seamDist = (fromTop - hem) / 0.08;
  float seam = 0.55 * exp(-(seamDist * seamDist));
  float light = (curtain * streaks + seam) * uBrightness;
  float alpha = clamp(light * uOpacity, 0.0, 1.0);
  gl_FragColor = vec4(colourAt(uv.x) * alpha, alpha);
}`;

export interface AuroraProps {
  /** Three colours, left to right. On a light page, pick greys darker than the page: light can't brighten white. */
  colorStops?: readonly [string, string, string];
  /** How far down the curtain hangs, 0 to 1 of the height. */
  height?: number;
  /** How much its hem waves. */
  amplitude?: number;
  /** Animation speed. 0 holds it still. */
  speed?: number;
  brightness?: number;
  /** 0 to 1. Fade it with this, not CSS opacity, which breaks a WebGL canvas' blending. */
  opacity?: number;
  /** Draws the curtain towards the pointer. */
  followPointer?: boolean;
  /** Holds the last frame. */
  paused?: boolean;
  /**
   * Stays still where WebGL draws in software, without a graphics card, where
   * animating it would cost the page its responsiveness.
   */
  stillWithoutGpu?: boolean;
  /** Pixel density as a share of the device's. A soft glow needs little: 0.5 draws a quarter of the pixels. */
  dpr?: number;
  className?: string;
}

/**
 * A soft aurora that hangs from the top of its container and drifts slowly.
 * Fill a positioned container with it; it ignores the pointer's clicks.
 */
const subscribeReducedMotion = (onChange: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const getReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const subscribeNoop = () => () => {};
const getTrue = () => true;

export function Aurora({
  colorStops = ["#0369a1", "#0ea5e9", "#0d9488"],
  height = 0.45,
  amplitude = 1,
  speed = 1,
  brightness = 0.8,
  opacity = 0.65,
  followPointer = true,
  paused = false,
  stillWithoutGpu = true,
  dpr = 0.5,
  className,
}: AuroraProps): ReactElement {
  const hasGpu = useSyncExternalStore(subscribeNoop, hasGraphicsCard, getTrue);
  const gpu = stillWithoutGpu ? hasGpu : true;
  const lean = useRef({ value: 0, target: 0, pointerX: 0.5 });
  const reduce = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  const stops = colorStops.map(hexToRgb) as [
    [number, number, number],
    [number, number, number],
    [number, number, number],
  ];
  const canvasRef = useShaderCanvas({
    fragment: FRAGMENT,
    paused: paused || !gpu || reduce || speed === 0,
    dpr,
    uniforms: () => {
      const state = lean.current;
      state.value += (state.target - state.value) * 0.06;
      return {
        uColorA: stops[0],
        uColorB: stops[1],
        uColorC: stops[2],
        uHeight: height,
        uAmplitude: amplitude,
        uSpeed: speed,
        uBrightness: brightness,
        uOpacity: Math.min(1, Math.max(0, opacity)),
        uLean: state.value,
        uPointerX: state.pointerX,
      };
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!followPointer || !canvas) return;
    const onMove = (event: PointerEvent): void => {
      const box = canvas.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const inside =
        x >= 0 && x <= 1 && event.clientY >= box.top && event.clientY <= box.bottom;
      lean.current.pointerX = Math.min(1, Math.max(0, x));
      lean.current.target = inside ? (x - 0.5) * 0.6 : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [canvasRef, followPointer]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}
