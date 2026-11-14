"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactElement } from "react";
import {
  hexToRgb,
  useShaderCanvas,
} from "@/lib/hooks/use-shader-canvas";
import { cn } from "@/lib/utils";

// Beams fanning out from a point at the edge of the canvas towards its centre.
// Around the fan's heading, two layers of value noise over the angle make the
// beams, which drift sideways at different speeds; light falls off with
// distance from the source. Dust is a grid of sparse, drifting motes that only
// show inside the light.
const FRAGMENT = `precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uOrigin;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uIntensity;
uniform float uSpread;
uniform float uDensity;
uniform float uSpeed;
uniform float uReach;
uniform float uDust;
uniform float uOpacity;
uniform float uFade;
uniform float uLean;

const float PI = 3.14159265;

float hash(float n) { return fract(sin(n * 311.7) * 43758.5453123); }

float hash2(vec2 p) {
  p = fract(p * vec2(233.34, 851.73));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}

float valueNoise(float x) {
  float cell = floor(x);
  float t = fract(x);
  return mix(hash(cell), hash(cell + 1.0), t * t * (3.0 - 2.0 * t));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 point = vec2(uv.x * aspect, uv.y);
  vec2 source = vec2(uOrigin.x * aspect, uOrigin.y);
  vec2 toPoint = point - source;
  float distance = length(toPoint);
  vec2 toCentre = vec2(0.5 * aspect, 0.42) - source;
  float heading = atan(toCentre.y, toCentre.x) + uLean;
  float angle = mod(atan(toPoint.y, toPoint.x) - heading + PI, 2.0 * PI) - PI;

  float spreadRatio = angle / uSpread;
  float fan = exp(-(spreadRatio * spreadRatio));
  float t = uTime * uSpeed * 0.12;
  float across = angle * uDensity;
  float beams = 0.6 * smoothstep(0.3, 0.92, valueNoise(across + t))
    + 0.4 * smoothstep(0.25, 0.95, valueNoise(across * 1.7 - t * 0.6 + 19.0));
  beams = 0.18 + 0.82 * beams;
  // GLSL ES 1.0 pow(x, y) is undefined for x <= 0; guard distance and avoid pow for squares.
  float reach = 1.0 / (1.0 + pow(max(distance, 0.0001) / uReach, 1.5));
  float coreRatio = distance / 0.3;
  float core = 0.5 * exp(-(coreRatio * coreRatio));
  float light = (fan * beams * reach + core) * uIntensity;

  if (uDust > 0.0) {
    vec2 grid = point * 26.0 + vec2(t * 2.6, -t * 1.9);
    vec2 cell = floor(grid);
    vec2 inside = fract(grid) - 0.5;
    float seed = hash2(cell);
    vec2 offset = vec2(hash2(cell + 3.1), hash2(cell + 7.7)) - 0.5;
    float size = 0.035 + 0.05 * hash2(cell + 1.3);
    float mote = step(0.62, seed)
      * smoothstep(size, size * 0.25, length(inside - offset * 0.6))
      * (0.55 + 0.45 * sin(uTime * 1.8 + seed * 40.0));
    light += mote * fan * reach * uDust * 1.6;
  }

  // Full above the middle, softening to nothing at the bottom edge.
  light *= mix(1.0, smoothstep(0.0, 0.55, uv.y), uFade);
  float alpha = clamp(light * uOpacity, 0.0, 1.0);
  vec3 colour = mix(uColorA, uColorB, smoothstep(-uSpread, uSpread, angle));
  gl_FragColor = vec4(colour * alpha, alpha);
}`;

const ORIGINS = {
  "top-right": [1.02, 1.04],
  "top-left": [-0.02, 1.04],
  top: [0.5, 1.08],
} as const;

export interface LightRaysProps {
  /** Where the light comes from. */
  origin?: keyof typeof ORIGINS;
  /** Two colours, blended across the fan. On a light page, warm pale colours read as sunlight. */
  colors?: readonly [string, string];
  intensity?: number;
  /** How wide the fan opens, in radians. */
  spread?: number;
  /** How many beams fit across the fan. */
  density?: number;
  /** How fast the beams drift. 0 holds them still. */
  speed?: number;
  /** How far the light reaches before it falls off, as a share of the height. */
  reach?: number;
  /** Motes of dust floating in the light, 0 to 1. */
  dust?: number;
  /** Softens the light from the middle down, to nothing at the bottom edge. */
  fadeToBottom?: boolean;
  /** Leans the fan towards the pointer. */
  followPointer?: boolean;
  /** 0 to 1. Fade it with this, not CSS opacity, which breaks a WebGL canvas' blending. */
  opacity?: number;
  /** Holds the last frame. */
  paused?: boolean;
  /** Pixel density as a share of the device's. */
  dpr?: number;
  className?: string;
}

/** Soft beams of light fanning from a corner, with dust drifting in them. */
const subscribeReducedMotion = (onChange: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const getReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function LightRays({
  origin = "top-right",
  colors = ["#ffd27a", "#ffe9c2"],
  intensity = 1.6,
  spread = 0.75,
  density = 12,
  speed = 2,
  reach = 0.9,
  dust = 0.5,
  fadeToBottom = false,
  followPointer = true,
  opacity = 1,
  paused = false,
  dpr = 1,
  className,
}: LightRaysProps): ReactElement {
  const lean = useRef({ value: 0, target: 0 });
  const reduce = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  const first = hexToRgb(colors[0]);
  const second = hexToRgb(colors[1]);
  const canvasRef = useShaderCanvas({
    fragment: FRAGMENT,
    paused: paused || reduce || speed === 0,
    dpr,
    uniforms: () => {
      const state = lean.current;
      state.value += (state.target - state.value) * 0.05;
      return {
        uOrigin: ORIGINS[origin],
        uColorA: first,
        uColorB: second,
        uIntensity: intensity,
        uSpread: Math.max(0.05, spread),
        uDensity: density,
        uSpeed: speed,
        uReach: Math.max(0.05, reach),
        uDust: dust,
        uOpacity: Math.min(1, Math.max(0, opacity)),
        uFade: fadeToBottom ? 1 : 0,
        uLean: state.value,
      };
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!followPointer || !canvas) return;
    const onMove = (event: PointerEvent): void => {
      const box = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom;
      if (!inside) {
        lean.current.target = 0;
        return;
      }
      // The angle from the source to the pointer, against the angle to the centre, both in canvas space.
      const [ox, oy] = ORIGINS[origin];
      const aspect = box.width / box.height;
      const px = ((event.clientX - box.left) / box.width) * aspect;
      const py = 1 - (event.clientY - box.top) / box.height;
      const toPointer = Math.atan2(py - oy, px - ox * aspect);
      const toCentre = Math.atan2(0.42 - oy, 0.5 * aspect - ox * aspect);
      let difference = toPointer - toCentre;
      difference = Math.atan2(Math.sin(difference), Math.cos(difference));
      lean.current.target = Math.max(-spread, Math.min(spread, difference)) * 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [canvasRef, followPointer, origin, spread]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}
