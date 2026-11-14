import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

/** The frame every section of the lower page sits in: a centred column with hairline sides. */
export const FRAME_CLASS = "mx-auto w-full max-w-[1200px] border-x border-foreground/5";

const DOT_CLASS = "absolute top-0 grid size-5 -translate-y-1/2 place-items-center rounded-full bg-background";

/**
 * The horizontal rule of a framed section. Sits inside a `border-x` frame, runs
 * past it on both sides and marks each crossing with a dot. The section around
 * it needs `overflow-x-clip`, or the overhang widens the page.
 */
export function FrameRule({ className }: { className?: string }): ReactElement {
  return (
    <div aria-hidden className={cn("pointer-events-none relative h-px", className)}>
      <div className="absolute -inset-x-[129px] top-0 h-px bg-foreground/5" />
      <span className={cn(DOT_CLASS, "left-0 -translate-x-1/2")}>
        <span className="size-0.5 rounded-full bg-foreground" />
      </span>
      <span className={cn(DOT_CLASS, "right-0 translate-x-1/2")}>
        <span className="size-0.5 rounded-full bg-foreground" />
      </span>
    </div>
  );
}

