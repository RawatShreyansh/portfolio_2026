"use client";

import { memo, useEffect, useRef, type ReactElement } from "react";
import { useResolvedTheme } from "@/lib/hooks/use-resolved-theme";
import { cn } from "@/lib/utils";

export type PrecipitationKind = "rain" | "snow";

// The ground is sampled in columns this many pixels wide: the puddle's surface for rain, the drift for snow.
const COLUMN = 6;
const DROPS = 170;
const FLAKES = 220;
// The deepest the puddle and the drift get, in pixels.
const MAX_WATER = 26;
const MAX_SNOW = 84;
// The pointer's reach: an umbrella over the rain, a breath that blows snow away.
const UMBRELLA = 60;
const BREATH = 80;
// How long the scene keeps falling while it fades out.
const LINGER_MS = 2600;

interface Palette {
  drop: string;
  waterTop: string;
  waterBottom: string;
  surface: string;
  flake: string;
  snowTop: string;
  snowBottom: string;
  snowEdge: string;
}

// Rain falls in slate by day and in pale grey by night, into a light or a deep blue puddle; snow is a cool
// grey by day, so it shows on the white page, and near white by night.
const DAY: Palette = {
  drop: "100 116 139",
  waterTop: "rgb(186 214 245 / 0.45)",
  waterBottom: "rgb(120 170 225 / 0.55)",
  surface: "rgb(96 150 215 / 0.7)",
  flake: "148 163 184",
  snowTop: "rgb(255 255 255)",
  snowBottom: "rgb(226 232 240)",
  snowEdge: "rgb(148 163 184 / 0.55)",
};
const NIGHT: Palette = {
  drop: "203 213 225",
  waterTop: "rgb(59 100 160 / 0.28)",
  waterBottom: "rgb(30 58 110 / 0.5)",
  surface: "rgb(147 190 245 / 0.55)",
  flake: "241 245 249",
  snowTop: "rgb(226 232 240 / 0.92)",
  snowBottom: "rgb(148 163 184 / 0.55)",
  snowEdge: "rgb(255 255 255 / 0.5)",
};

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
}

interface Flake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  phase: number;
  sway: number;
  pushX: number;
  pushY: number;
}

interface Bead {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export interface PrecipitationProps {
  kind: PrecipitationKind;
  /** Falls while true. When it turns false it keeps falling for a moment, for a fade out, then stops. */
  active?: boolean;
  /** The palette. It follows the `dark` class on <html> unless set. */
  dark?: boolean;
  className?: string;
}

/**
 * Rain or snow over its container, falling to the container's bottom edge and gathering there:
 * rain into a rippling puddle with splashes, snow into a drift that slumps into soft mounds. The pointer
 * joins in: it is an umbrella that the rain breaks on and a hand that stirs the puddle, and a breath that
 * blows the falling snow aside and scatters the drift. It draws only while active (and through the
 * fade out), and starts from dry ground each time it turns active.
 */
export const Precipitation = memo(function Precipitation({
  kind,
  active = true,
  dark,
  className,
}: PrecipitationProps): ReactElement {
  const theme = useResolvedTheme();
  const shown = active;
  const night = dark ?? theme === "dark";
  const ref = useRef<HTMLCanvasElement>(null);
  const shownRef = useRef(shown);
  const paletteRef = useRef(night ? NIGHT : DAY);
  const wakeRef = useRef<(() => void) | null>(null);
  paletteRef.current = night ? NIGHT : DAY;

  useEffect(() => {
    shownRef.current = shown;
    wakeRef.current?.();
  }, [shown]);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let width = 1;
    let height = 1;
    let columns = 1;
    let ground: Float32Array = new Float32Array(1);
    let swell: Float32Array = new Float32Array(1);
    let ripple: Float32Array = new Float32Array(1);
    let level = 0;
    let frame = 0;
    let last = 0;
    let lingerUntil = 0;
    let wasShown = false;
    let onScreen = true;
    let clock = 0;
    const drops: Drop[] = [];
    const flakes: Flake[] = [];
    let beads: Bead[] = [];
    const pointer = { x: -1e4, y: -1e4, vx: 0, vy: 0, inside: false };

    const column = (x: number): number =>
      Math.min(columns - 1, Math.max(0, Math.floor(x / COLUMN)));
    const at = (values: Float32Array, index: number): number =>
      values[Math.min(columns - 1, Math.max(0, index))] ?? 0;

    const resetDrop = (drop: Drop, anywhere: boolean): void => {
      drop.x = Math.random() * (width + 120) - 20;
      drop.y = anywhere ? Math.random() * height : -Math.random() * 80;
      drop.length = 10 + Math.random() * 14;
      drop.speed = 620 + Math.random() * 380;
      drop.alpha = 0.18 + Math.random() * 0.32;
    };
    const resetFlake = (flake: Flake, anywhere: boolean): void => {
      flake.x = Math.random() * width;
      flake.y = anywhere ? Math.random() * height : -10 - Math.random() * 60;
      flake.radius = 1.2 + Math.random() * 2.3;
      flake.speed = 28 + flake.radius * 14 + Math.random() * 18;
      flake.phase = Math.random() * Math.PI * 2;
      flake.sway = 10 + Math.random() * 22;
      flake.pushX = 0;
      flake.pushY = 0;
    };

    // Dry ground and a fresh sky, each time the scene comes back.
    const restart = (): void => {
      ground = new Float32Array(columns);
      swell = new Float32Array(columns);
      ripple = new Float32Array(columns);
      level = 0;
      beads = [];
      drops.length = 0;
      flakes.length = 0;
      if (kind === "rain")
        for (let i = 0; i < DROPS; i++) {
          const drop = { x: 0, y: 0, length: 0, speed: 0, alpha: 0 };
          resetDrop(drop, true);
          drops.push(drop);
        }
      else
        for (let i = 0; i < FLAKES; i++) {
          const flake = {
            x: 0,
            y: 0,
            radius: 0,
            speed: 0,
            phase: 0,
            sway: 0,
            pushX: 0,
            pushY: 0,
          };
          resetFlake(flake, true);
          flakes.push(flake);
        }
    };

    const resize = (): void => {
      const box = canvas.getBoundingClientRect();
      // Thin streaks and soft flakes look the same at 1.25x as at 2x, and a full screen at 2x is four times
      // the pixels to clear every frame, under the nav's blur.
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
      width = Math.max(1, box.width);
      height = Math.max(1, box.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const next = Math.ceil(width / COLUMN) + 1;
      if (next !== columns) {
        // Keep what has gathered, stretched over the new width.
        const resample = (values: Float32Array): Float32Array => {
          const out = new Float32Array(next);
          for (let i = 0; i < next; i++)
            out[i] = values[Math.floor((i * columns) / next)] ?? 0;
          return out;
        };
        ground = resample(ground);
        swell = resample(swell);
        ripple = resample(ripple);
        columns = next;
      }
    };

    const splash = (
      x: number,
      y: number,
      count: number,
      force: number,
    ): void => {
      for (let i = 0; i < count && beads.length < 220; i++)
        beads.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 160 * force,
          vy: -(60 + Math.random() * 150) * force,
          life: 1,
        });
    };

    const stepRain = (dt: number): void => {
      const surface = height - level;
      for (const drop of drops) {
        drop.y += drop.speed * dt;
        drop.x -= drop.speed * dt * 0.12;
        // The umbrella: a drop that reaches the top half of the circle around the pointer breaks on it.
        const dx = drop.x - pointer.x;
        const dy = drop.y - pointer.y;
        if (
          pointer.inside &&
          dy < 0 &&
          dx * dx + dy * dy < UMBRELLA * UMBRELLA
        ) {
          splash(drop.x, drop.y, 2, 0.7);
          resetDrop(drop, false);
          continue;
        }
        const index = column(drop.x);
        if (drop.y >= surface + at(swell, index)) {
          splash(drop.x, surface + at(swell, index), 2, 1);
          ripple[index] = at(ripple, index) + 0.9;
          level = Math.min(MAX_WATER, level + 0.012 * (height / 720));
          resetDrop(drop, false);
        }
      }
      // A hand in the puddle pushes its surface along.
      if (pointer.inside && Math.abs(pointer.y - surface) < 50) {
        const push = Math.max(
          -3,
          Math.min(3, pointer.vx * 0.004 + pointer.vy * 0.006),
        );
        const center = column(pointer.x);
        for (let i = -5; i <= 5; i++) {
          const index = center + i;
          if (index >= 0 && index < columns)
            ripple[index] = at(ripple, index) + push * (1 - Math.abs(i) / 6);
        }
      }
      // The surface: each column springs back to rest and pulls on its neighbours, so ripples travel.
      for (let i = 0; i < columns; i++) {
        const here = at(swell, i);
        const pull = at(swell, i - 1) + at(swell, i + 1) - 2 * here;
        ripple[i] = (at(ripple, i) - here * 0.03 + pull * 0.2) * 0.96;
      }
      for (let i = 0; i < columns; i++)
        swell[i] = Math.max(-8, Math.min(8, at(swell, i) + at(ripple, i)));
    };

    const stepSnow = (dt: number, time: number): void => {
      for (const flake of flakes) {
        // The breath: flakes near the pointer are pushed away from it, and drift back into line after.
        const dx = flake.x - pointer.x;
        const dy = flake.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (pointer.inside && distance < BREATH && distance > 0.1) {
          const strength = ((BREATH - distance) / BREATH) * 260;
          flake.pushX += (dx / distance) * strength * dt;
          flake.pushY += (dy / distance) * strength * dt;
        }
        flake.pushX *= 1 - Math.min(1, dt * 2.5);
        flake.pushY *= 1 - Math.min(1, dt * 2.5);
        flake.x +=
          (Math.sin(time * 0.9 + flake.phase) * flake.sway + flake.pushX) * dt;
        flake.y += (flake.speed + flake.pushY) * dt;
        if (flake.x < -10) flake.x += width + 20;
        if (flake.x > width + 10) flake.x -= width + 20;
        const index = column(flake.x);
        if (flake.y >= height - at(ground, index) - flake.radius * 0.5) {
          // Each flake settles where it lands and a little to either side. Fewer flakes land per second on a
          // tall screen and each covers less of a wide one, so the amount scales with both, and the drift
          // grows at the same pace on any screen.
          const amount = flake.radius * 9 * (width / 1280) * (height / 720);
          ground[index] = Math.min(MAX_SNOW, at(ground, index) + amount);
          if (index > 0)
            ground[index - 1] = at(ground, index - 1) + amount * 0.5;
          if (index < columns - 1)
            ground[index + 1] = at(ground, index + 1) + amount * 0.5;
          resetFlake(flake, false);
        }
      }
      // Sweeping the pointer through the drift scatters it in a puff.
      const moving = Math.hypot(pointer.vx, pointer.vy);
      const center = column(pointer.x);
      if (
        pointer.inside &&
        moving > 60 &&
        pointer.y > height - at(ground, center) - 14
      ) {
        for (let i = -4; i <= 4; i++) {
          const index = center + i;
          if (index < 0 || index >= columns) continue;
          const taken = Math.min(
            at(ground, index),
            0.5 * (1 - Math.abs(i) / 5) * (moving / 200),
          );
          ground[index] = at(ground, index) - taken;
          if (taken > 0.15 && Math.random() < 0.5)
            splash(index * COLUMN, height - at(ground, index), 1, 0.8);
        }
      }
      // The drift slumps: a step steeper than a couple of pixels slides into the lower column.
      for (let pass = 0; pass < 4; pass++)
        for (let i = 0; i < columns - 1; i++) {
          const difference = at(ground, i) - at(ground, i + 1);
          if (Math.abs(difference) <= 1.4) continue;
          const move =
            (Math.abs(difference) - 1.4) * 0.25 * Math.sign(difference);
          ground[i] = at(ground, i) - move;
          ground[i + 1] = at(ground, i + 1) + move;
        }
    };

    const stepBeads = (dt: number): void => {
      const gravity = kind === "rain" ? 900 : 240;
      beads = beads.filter((bead) => {
        bead.vy += gravity * dt;
        bead.x += bead.vx * dt;
        bead.y += bead.vy * dt;
        bead.life -= dt * (kind === "rain" ? 2.4 : 1.2);
        return bead.life > 0 && bead.y < height;
      });
    };

    // The surface as a smooth curve through the columns, closed along the bottom of the canvas.
    const tracePile = (top: (index: number) => number): void => {
      context.beginPath();
      context.moveTo(0, height);
      context.lineTo(0, top(0));
      for (let i = 1; i < columns; i++) {
        const x = (i - 0.5) * COLUMN;
        context.quadraticCurveTo(
          (i - 1) * COLUMN,
          top(i - 1),
          x,
          (top(i - 1) + top(i)) / 2,
        );
      }
      context.lineTo(width, top(columns - 1));
      context.lineTo(width, height);
      context.closePath();
    };

    const draw = (): void => {
      const palette = paletteRef.current;
      context.clearRect(0, 0, width, height);
      if (kind === "rain") {
        context.lineWidth = 1;
        context.lineCap = "round";
        for (const drop of drops) {
          context.strokeStyle = `rgb(${palette.drop} / ${drop.alpha})`;
          context.beginPath();
          context.moveTo(drop.x, drop.y);
          context.lineTo(drop.x + drop.length * 0.12, drop.y - drop.length);
          context.stroke();
        }
        if (level > 0.3) {
          const surface = height - level;
          const fill = context.createLinearGradient(0, surface - 6, 0, height);
          fill.addColorStop(0, palette.waterTop);
          fill.addColorStop(1, palette.waterBottom);
          tracePile((i) => surface + at(swell, i));
          context.fillStyle = fill;
          context.fill();
          context.strokeStyle = palette.surface;
          context.lineWidth = 1.2;
          context.beginPath();
          for (let i = 0; i < columns; i++) {
            const y = surface + at(swell, i);
            if (i === 0) context.moveTo(0, y);
            else context.lineTo(i * COLUMN, y);
          }
          context.stroke();
        }
        context.fillStyle = `rgb(${palette.drop} / 0.5)`;
        for (const bead of beads) {
          context.globalAlpha = Math.max(0, bead.life);
          context.fillRect(bead.x, bead.y, 1.4, 1.4);
        }
        context.globalAlpha = 1;
        return;
      }
      for (const flake of flakes) {
        context.fillStyle = `rgb(${palette.flake} / ${0.45 + flake.radius * 0.12})`;
        context.beginPath();
        context.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        context.fill();
      }
      context.fillStyle = `rgb(${palette.flake} / 0.8)`;
      for (const bead of beads) {
        context.globalAlpha = Math.max(0, bead.life);
        context.beginPath();
        context.arc(bead.x, bead.y, 1.6, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      if (Math.max(...ground) > 0.5) {
        const fill = context.createLinearGradient(
          0,
          height - MAX_SNOW,
          0,
          height,
        );
        fill.addColorStop(0, palette.snowTop);
        fill.addColorStop(1, palette.snowBottom);
        tracePile((i) => height - at(ground, i));
        context.fillStyle = fill;
        context.fill();
        context.strokeStyle = palette.snowEdge;
        context.lineWidth = 1;
        context.stroke();
      }
    };

    const tick = (now: number): void => {
      frame = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      clock += dt;
      if (kind === "rain") stepRain(dt);
      else stepSnow(dt, clock);
      stepBeads(dt);
      // The pointer's speed eases off between moves.
      pointer.vx *= 0.85;
      pointer.vy *= 0.85;
      draw();
      wake();
    };

    // Runs while the scene shows, and for the fade after it; stops off screen and in hidden tabs.
    function wake(): void {
      const shownNow = shownRef.current;
      if (shownNow && !wasShown) {
        resize();
        restart();
      }
      if (!shownNow && wasShown) lingerUntil = performance.now() + LINGER_MS;
      wasShown = shownNow;
      const running =
        (shownNow || performance.now() < lingerUntil) &&
        onScreen &&
        document.visibilityState === "visible";
      if (!running) {
        last = 0;
        if (!shownNow && performance.now() >= lingerUntil)
          context?.clearRect(0, 0, width, height);
        return;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    }
    wakeRef.current = wake;

    const onMove = (event: PointerEvent): void => {
      const box = canvas.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      if (pointer.inside) {
        pointer.vx = (x - pointer.x) * 60;
        pointer.vy = (y - pointer.y) * 60;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.inside = x >= 0 && x <= box.width && y >= 0 && y <= box.height;
    };
    const onLeave = (): void => {
      pointer.inside = false;
    };
    const onUp = (event: PointerEvent): void => {
      if (event.pointerType !== "mouse") onLeave();
    };
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
      wake();
    });
    const observer = new ResizeObserver(() => resize());
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", wake);
    visibility.observe(canvas);
    observer.observe(canvas);
    resize();
    wake();

    return () => {
      cancelAnimationFrame(frame);
      wakeRef.current = null;
      visibility.disconnect();
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", wake);
    };
  }, [kind]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
});

