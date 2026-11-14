"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from "react";
import { cn } from "@/lib/utils";

export interface HandwrittenQuoteProps {
  /** A line break in the text is kept as a line break in the handwriting. */
  quote: string;
  attribution: string;
  /** Writing speed: how long each character takes to draw. */
  msPerChar?: number;
  /** A small dot that rides the edge of the word being written. */
  penTip?: boolean;
  className?: string;
}

interface Token {
  text: string;
  /** The writer starts a new line after this word. */
  breakAfter?: boolean;
  /** A quote mark, written with no pause between it and its word. */
  mark?: boolean;
}

interface Timeline {
  delays: number[];
  durations: number[];
  /** When the last stroke of the quote lands. */
  total: number;
}

const STYLES = `
@keyframes hw-wipe {
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0 0 0); }
}
@keyframes hw-tip {
  0% { left: 0%; opacity: 0; }
  1% { left: 0%; opacity: 1; }
  98% { left: 100%; opacity: 1; }
  100% { left: 100%; opacity: 0; }
}
@keyframes hw-rule {
  from { transform: scaleX(0); opacity: 0; }
  to { transform: scaleX(1); opacity: 1; }
}
@keyframes hw-fade {
  from { opacity: 0; transform: translateY(3px); }
  to { opacity: 1; transform: translateY(0); }
}
.hw-ink {
  clip-path: inset(0 100% 0 0);
}
.hw-tip {
  position: absolute;
  bottom: 0.18em;
  width: 4px;
  height: 4px;
  border-radius: 9999px;
  background-color: currentColor;
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%);
}
.hw-rule {
  transform: scaleX(0);
}
`;

const WORD_PAUSE_MS = 60;
// The hand lifting and moving down to the next line.
const LINE_PAUSE_MS = 250;
const ATTRIBUTION_WAIT_MS = 400;
const RULE_MS = 300;
const NAME_MS = 500;
// Slightly uneven, like a stroke that starts and ends slower than its middle.
const STROKE_EASE = "cubic-bezier(0.6, 0, 0.4, 1)";

function stroke(name: string, duration: number, delay: number): CSSProperties {
  return { animation: `${name} ${duration}ms ${STROKE_EASE} ${delay}ms both` };
}

/** A quote that writes itself out, word by word, the first time it scrolls into view. */
export function HandwrittenQuote({
  quote,
  attribution,
  msPerChar = 34,
  penTip = true,
  className,
}: HandwrittenQuoteProps): ReactElement {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLElement>(null);
  const tokenRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [timeline, setTimeline] = useState<Timeline | null>(null);

  const lines = quote
    .trim()
    .split("\n")
    .map((line) => line.trim().split(/\s+/));
  const words: Token[] = lines.flatMap((line, lineIndex) =>
    line.map((text, index) => ({ text, breakAfter: index === line.length - 1 && lineIndex < lines.length - 1 })),
  );
  // The opening mark is written first and the closing mark last.
  const tokens: Token[] = [{ text: "“", mark: true }, ...words, { text: "”", mark: true }];
  const spokenQuote = quote.replace(/\s+/g, " ").trim();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let cancelled = false;

    const start = async (): Promise<void> => {
      // Line breaks are only right once the handwriting font has loaded.
      await document.fonts.ready;
      if (cancelled) return;
      const delays: number[] = [];
      const durations: number[] = [];
      let time = 0;
      tokenRefs.current.forEach((element, index) => {
        const duration = Math.max(1, tokens[index].text.length) * msPerChar;
        delays.push(time);
        durations.push(duration);
        time += duration;
        const next = tokenRefs.current[index + 1];
        if (!element || !next) return;
        const attached = tokens[index].mark || tokens[index + 1].mark;
        if (next.offsetTop > element.offsetTop) time += LINE_PAUSE_MS;
        else if (!attached) time += WORD_PAUSE_MS;
      });
      setTimeline({ delays, durations, total: time });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Once only: scrolling back does not replay it.
        observer.disconnect();
        void start();
      },
      { threshold: 0.4 },
    );
    observer.observe(root);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
    // The quote and speed are fixed for the life of the component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const started = timeline !== null;
  const animated = started && !reduce;

  const renderToken = (index: number): ReactElement => (
    <span
      key={index}
      ref={(element) => {
        tokenRefs.current[index] = element;
      }}
      className="relative inline-block"
    >
      <span
        className={cn("inline-block", !reduce && "hw-ink")}
        style={animated ? stroke("hw-wipe", timeline.durations[index], timeline.delays[index]) : undefined}
      >
        {tokens[index].text}
      </span>
      {penTip && animated ? (
        <span className="hw-tip" style={stroke("hw-tip", timeline.durations[index], timeline.delays[index])} />
      ) : null}
    </span>
  );

  const last = tokens.length - 1;
  const attributionAt = (timeline?.total ?? 0) + ATTRIBUTION_WAIT_MS;

  return (
    <figure
      ref={rootRef}
      className={cn(
        "flex flex-col items-center gap-3 text-center [font-family:var(--font-hand,cursive)] text-[32px] leading-8 text-foreground",
        // Reduced motion: no writing, the whole quote fades in at once.
        reduce && "transition-opacity duration-300",
        reduce && !started && "opacity-0",
        className,
      )}
    >
      <style href="handwritten-quote" precedence="default">
        {STYLES}
      </style>

      <blockquote>
        <p className="sr-only">
          “{spokenQuote}”
        </p>
        {/* Words keep their final size and place from the start, so nothing shifts as they appear. */}
        <p aria-hidden>
          <span className="whitespace-nowrap">
            {renderToken(0)}
            {renderToken(1)}
          </span>
          {words[0].breakAfter ? <br /> : " "}
          {words.slice(1, -1).map((word, offset) => (
            <span key={offset}>
              {renderToken(offset + 2)}
              {word.breakAfter ? <br /> : " "}
            </span>
          ))}
          <span className="whitespace-nowrap">
            {renderToken(last - 1)}
            {renderToken(last)}
          </span>
        </p>
      </blockquote>

      <figcaption className="flex items-center justify-center gap-2">
        <span
          aria-hidden
          className={cn("h-[1.5px] w-3.5 origin-left bg-current", !reduce && "hw-rule")}
          style={animated ? { animation: `hw-rule ${RULE_MS}ms ease-out ${attributionAt}ms both` } : undefined}
        />
        <span
          className={cn(!reduce && "opacity-0")}
          style={animated ? { animation: `hw-fade ${NAME_MS}ms ease-out ${attributionAt + RULE_MS}ms both` } : undefined}
        >
          {attribution}
        </span>
      </figcaption>
    </figure>
  );
}

