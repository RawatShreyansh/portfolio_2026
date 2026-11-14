"use client";

import { useEffect, useRef, type RefObject } from "react";

export type UniformValue =
  | number
  | readonly [number, number]
  | readonly [number, number, number];

export interface ShaderCanvasOptions {
  /**
   * A GLSL ES 1.0 fragment shader. It is given `uResolution` (the canvas size
   * in pixels) and `uTime` (seconds, advancing only while running) and should
   * write premultiplied colour to `gl_FragColor`.
   */
  fragment: string;
  /** Read on every frame, so changing a value needs no re-render of the canvas. */
  uniforms: () => Record<string, UniformValue>;
  /** Holds the last frame and stops the loop. Uniform changes still redraw it. */
  paused: boolean;
  /** Pixel density, as a share of the device's. Soft effects look the same at 0.5. */
  dpr: number;
}

const VERTEX = `attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;

let cachedGraphicsCard: boolean | null = null;

/** Whether WebGL here runs on a graphics card, rather than drawing in software on the CPU. */
export function hasGraphicsCard(): boolean {
  if (cachedGraphicsCard !== null) return cachedGraphicsCard;
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    if (!gl) {
      cachedGraphicsCard = false;
      return false;
    }
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info
      ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : "";
    // Explicitly release the temporary probe context so repeated checks cannot exhaust Chrome's WebGL limit.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    cachedGraphicsCard = !/swiftshader|llvmpipe|software|basic render/i.test(
      renderer,
    );
    return cachedGraphicsCard;
  } catch {
    cachedGraphicsCard = false;
    return false;
  }
}

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

/**
 * Runs a full-screen fragment shader on a canvas. It draws only while the
 * canvas is on screen and the tab is visible, sizes itself to the canvas'
 * box, and redraws a paused frame when its uniforms change.
 */
export function useShaderCanvas({
  fragment,
  uniforms,
  paused,
  dpr,
}: ShaderCanvasOptions): RefObject<HTMLCanvasElement | null> {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const settings = useRef({ uniforms, paused, dpr });
  const wakeRef = useRef<(() => void) | null>(null);

  // Every render may carry new uniform values: draw them, even when paused.
  useEffect(() => {
    settings.current = { uniforms, paused, dpr };
    wakeRef.current?.();
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!canvas || !gl) return;
    let vertex: WebGLShader | null = null;
    let shaded: WebGLShader | null = null;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    const locations = new Map<string, WebGLUniformLocation | null>();

    const setup = (): boolean => {
      vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
      shaded = compile(gl, gl.FRAGMENT_SHADER, fragment);
      program = gl.createProgram();
      if (!vertex || !shaded || !program) return false;
      gl.attachShader(program, vertex);
      gl.attachShader(program, shaded);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return false;
      }
      gl.useProgram(program);
      // One triangle that covers the whole canvas.
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      const position = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      locations.clear();
      return true;
    };

    if (!setup()) return;

    const locate = (name: string): WebGLUniformLocation | null => {
      if (!program) return null;
      if (!locations.has(name))
        locations.set(name, gl.getUniformLocation(program, name));
      return locations.get(name) ?? null;
    };

    let frame = 0;
    let last = 0;
    let time = Math.random() * 100;
    let onScreen = true;
    let lost = false;

    const resize = (): void => {
      const box = canvas.getBoundingClientRect();
      const ratio = (window.devicePixelRatio || 1) * settings.current.dpr;
      const width = Math.max(1, Math.round(box.width * ratio));
      const height = Math.max(1, Math.round(box.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const draw = (): void => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(locate("uResolution"), canvas.width, canvas.height);
      gl.uniform1f(locate("uTime"), time);
      for (const [name, value] of Object.entries(settings.current.uniforms())) {
        const at = locate(name);
        if (typeof value === "number") gl.uniform1f(at, value);
        else if (value.length === 2) gl.uniform2f(at, value[0], value[1]);
        else gl.uniform3f(at, value[0], value[1], value[2]);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const running = (): boolean =>
      !lost &&
      !settings.current.paused &&
      onScreen &&
      document.visibilityState === "visible";

    const tick = (now: number): void => {
      frame = 0;
      if (last) time += Math.min((now - last) / 1000, 0.05);
      last = now;
      draw();
      if (running()) frame = requestAnimationFrame(tick);
      else last = 0;
    };

    const wake = (): void => {
      if (lost) return;
      resize();
      if (running()) {
        if (!frame) frame = requestAnimationFrame(tick);
      } else if (!frame) draw();
    };
    wakeRef.current = wake;

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
      wake();
    });
    const observer = new ResizeObserver(wake);
    const onLost = (event: Event): void => {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const onRestored = (): void => {
      lost = !setup();
      last = 0;
      wake();
    };
    visibility.observe(canvas);
    observer.observe(canvas);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    document.addEventListener("visibilitychange", wake);
    wake();

    return () => {
      cancelAnimationFrame(frame);
      wakeRef.current = null;
      visibility.disconnect();
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      document.removeEventListener("visibilitychange", wake);
      // The context is left alive: React's development double mount would
      // otherwise reuse a lost one and draw nothing.
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(shaded);
    };
  }, [fragment]);

  return canvasRef;
}

/** "#rrggbb" or "#rgb" as 0–1 channels. Anything else reads as white. */
export function hexToRgb(hex: string): [number, number, number] {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!match?.[1]) return [1, 1, 1];
  const digits =
    match[1].length === 3
      ? [...match[1]].map((digit) => digit + digit).join("")
      : match[1];
  return [0, 2, 4].map(
    (start) => parseInt(digits.slice(start, start + 2), 16) / 255,
  ) as [number, number, number];
}
