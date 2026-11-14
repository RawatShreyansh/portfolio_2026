import type { ReactElement } from "react";
import { FRAME_CLASS, FrameRule } from "@/components/library/frame-rule";
import OrbitingCirclesGlobe from "@/components/ui/orbiting-circles-02";

/**
 * Displays the interactive OrbitingCirclesGlobe centered inside the `FRAME_CLASS`
 * column directly after the MY STACK table, anchored to a bottom `FrameRule`.
 */
export function StackOrbitSection(): ReactElement {
  return (
    <section id="ecosystem" className="overflow-x-clip">
      <div className={FRAME_CLASS}>
        <div className="pt-14 sm:pt-20">
          <div className="mx-auto mb-4 max-w-2xl px-6 text-center sm:mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/60">
              Ecosystem
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Connected Stack in Motion
            </h2>
          </div>

          <OrbitingCirclesGlobe />
        </div>

        <FrameRule />
      </div>
    </section>
  );
}

