import type { ReactElement } from "react";
import { FRAME_CLASS, FrameRule } from "@/components/library/frame-rule";
import { STACK_ITEMS, TechLogo } from "@/components/sections/stack-logos";

/**
 * Centered MY STACK section framed with `FrameRule` and `FRAME_CLASS`,
 * displaying 30 core technologies in a 6×5 table grid with theme-aware
 * monochrome logos that reveal their brand colors on hover.
 */
export function MyStackSection(): ReactElement {
  return (
    <section id="stack" className="overflow-x-clip">
      <div className={FRAME_CLASS}>
        <FrameRule />

        <div className="px-6 py-20 sm:px-12 sm:py-28">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/60">
              My Stack
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Technologies &amp; Tools
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground/65 sm:text-base">
              Languages, deep learning frameworks, LLM ecosystems, and scalable data infrastructure.
            </p>
          </div>

          <ul
            aria-label="Tech stack in 6 by 5 grid"
            className="mx-auto grid max-w-[1040px] grid-cols-2 gap-px border border-foreground/[0.08] bg-foreground/[0.08] sm:grid-cols-3 md:grid-cols-6"
          >
            {STACK_ITEMS.map((item) => (
              <li
                key={item.id}
                title={`${item.name} · ${item.category}`}
                className="group flex flex-col items-center justify-center gap-3.5 bg-background px-4 py-7 transition-colors duration-300 hover:bg-foreground/[0.025] sm:px-6 sm:py-9"
              >
                <div className="flex size-11 items-center justify-center">
                  <TechLogo id={item.id} />
                </div>
                <span className="text-center font-mono text-[11px] font-medium tracking-wide text-foreground/55 transition-colors duration-300 group-hover:text-foreground">
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <FrameRule />
      </div>
    </section>
  );
}
