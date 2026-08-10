"use client";

import { COPY } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

registerGsap();

const LINES = [
  "\u201CMister! Mister! MISTER!\u201D",
  "Her last call woke me up.",
  "Apparently, she bore the name Linda. Her face was unfamiliar but I knew her somehow.",
  "\u201CWe need to go now! They\u2019ll be here any minute!\u201D she yelled over me as I lay on the cold hard floor.",
];

const CARET_CLASS =
  "ml-0.5 inline-block h-[1.1em] w-0.5 animate-pulse bg-[#C6A87C] align-middle motion-reduce:animate-none";

export function Editor() {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const frame = frameRef.current;
      const linesBox = linesRef.current;
      if (!root || !frame || !linesBox) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const lineEls = gsap.utils.toArray<HTMLElement>(
        linesBox.querySelectorAll("[data-line]"),
      );
      const typedEls = lineEls.map(
        (line) => line.querySelector<HTMLElement>("[data-typed]"),
      );
      const caretEls = lineEls.map(
        (line) => line.querySelector<HTMLElement>("[data-caret]"),
      );
      const endCaret = linesBox.querySelector<HTMLElement>("[data-end-caret]");

      const showCaret = (activeIndex: number | null) => {
        caretEls.forEach((caret, i) => {
          if (!caret) return;
          caret.hidden = activeIndex !== i;
        });
        if (endCaret) endCaret.hidden = activeIndex !== null;
      };

      if (reduced) {
        gsap.set(frame, { opacity: 1, y: 0, scale: 1 });
        typedEls.forEach((el, i) => {
          if (el) el.textContent = LINES[i];
        });
        gsap.set(lineEls, { opacity: 1, x: 0 });
        showCaret(null);
        return;
      }

      const isMobile = window.matchMedia("(max-width: 639px)").matches;

      gsap.set(frame, {
        opacity: 0,
        y: isMobile ? 56 : 80,
        scale: isMobile ? 0.96 : 0.94,
      });
      gsap.set(lineEls, { opacity: 1, x: 0 });
      typedEls.forEach((el) => {
        if (el) el.textContent = "";
      });
      showCaret(0);

      const states = typedEls.map(() => ({ n: 0 }));

      const syncTyped = () => {
        let active: number | null = null;
        typedEls.forEach((el, i) => {
          if (!el) return;
          const full = LINES[i];
          const n = Math.min(full.length, Math.round(states[i].n));
          el.textContent = full.slice(0, n);
          if (active === null && n < full.length) active = i;
        });
        showCaret(active);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: isMobile ? "top 78%" : "top 65%",
          end: isMobile ? "bottom 45%" : "bottom 55%",
          scrub: 1.05,
        },
        onUpdate: syncTyped,
      });

      tl.to(
        frame,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: isMobile ? 0.35 : 0.4,
        },
        0,
      );

      let cursor = 0.28;
      states.forEach((state, i) => {
        const duration = Math.max(0.32, LINES[i].length * 0.016);
        tl.to(state, { n: LINES[i].length, duration, ease: "none" }, cursor);
        cursor += duration + 0.06;
      });

      return () => {
        typedEls.forEach((el, i) => {
          if (el) el.textContent = LINES[i];
        });
        showCaret(null);
      };
    },
    { dependencies: [] },
  );

  return (
    <section
      id="editor"
      ref={rootRef}
      data-cursor-tone="light"
      className="scroll-mt-24 bg-paper px-5 py-20 sm:px-8 sm:py-48"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="mx-auto max-w-2xl text-center font-serif text-[clamp(1.75rem,5vw,3.4rem)] leading-[1.1] tracking-tight text-ink">
          {COPY.editorTitle}
        </h2>
        <p className="font-accent mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
          {COPY.editorBody}
        </p>

        <div
          ref={frameRef}
          className="mt-10 overflow-hidden rounded-2xl border border-[#C6A87C]/20 bg-[#120F09] shadow-[0_30px_60px_-35px_rgba(14,12,9,0.55)] will-change-transform sm:mt-14 sm:rounded-[1.75rem]"
        >
          {/* App editor chrome — matches app.writidian.com/Editor */}
          <div className="flex items-center justify-between px-3 py-3 sm:px-5 sm:py-4">
            <span className="font-sans text-sm font-medium tabular-nums text-[#F9F8F4] sm:text-base">
              29:44
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#F9F8F4]/90 sm:h-9 sm:w-9"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 4v10m0 0 4-4m-4 4-4-4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 18h14"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#F9F8F4]/90 sm:h-9 sm:w-9"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 12v-1a8 8 0 0 1 16 0v1"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 13a2 2 0 0 1 2-2h1v6H5a2 2 0 0 1-2-2v-2Zm18 0a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="rounded-lg bg-[#F9F8F4] px-3.5 py-1.5 text-sm font-semibold text-[#120F09]">
                Done
              </span>
            </div>
          </div>

          <div className="px-4 sm:px-6">
            <p className="font-serif text-lg font-semibold uppercase text-[#eaeaea]/70">
              I HAD A DREAM
            </p>
            <div className="mt-3 border-t border-[#F9F8F4]/10" />
          </div>

          <div
            ref={linesRef}
            className="min-h-[14rem] space-y-4 px-4 py-8 sm:min-h-[18rem] sm:space-y-5 sm:px-8 sm:py-10"
            aria-label={LINES.join(" ")}
          >
            {LINES.map((line) => (
              <p
                key={line}
                data-line
                aria-hidden
                className="font-serif text-lg leading-relaxed text-[#F9F8F4] sm:text-xl"
              >
                <span data-typed>{line}</span>
                <span data-caret hidden className={CARET_CLASS} />
              </p>
            ))}
            <p aria-hidden className="font-serif text-lg text-[#F9F8F4] sm:text-xl">
              <span data-end-caret className={CARET_CLASS} />
            </p>
          </div>

          <div className="flex items-center justify-center gap-1 border-t border-[#F9F8F4]/8 bg-[#0c0a07] px-2 py-2.5 sm:gap-2 sm:px-4 sm:py-3">
            {(["B", "I", "U"] as const).map((mark, i) => (
              <span
                key={mark}
                aria-hidden
                className={`flex h-8 w-8 items-center justify-center rounded-xl font-serif text-sm text-[#F9F8F4] ${
                  i === 0 ? "font-bold" : i === 1 ? "italic" : "underline"
                }`}
              >
                {mark}
              </span>
            ))}
            <span aria-hidden className="mx-1 h-4 w-px bg-[#F9F8F4]/15" />
            <span
              aria-hidden
              className="flex h-8 items-center gap-1 rounded-xl px-1.5 text-[#F9F8F4]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M6 19c1.5-3 4-4.5 6-4.5S16.5 16 18 19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="18" cy="6" r="2" fill="#C6A87C" />
              </svg>
              <span className="h-3 w-3 rounded-full bg-[#F9F8F4]" />
            </span>
            <span aria-hidden className="mx-1 h-4 w-px bg-[#F9F8F4]/15" />
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-xl text-[#F9F8F4]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect
                  x="5"
                  y="3"
                  width="14"
                  height="18"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 8h8M8 12h8M8 16h5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span aria-hidden className="mx-1 h-4 w-px bg-[#F9F8F4]/15" />
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-xl text-[#F9F8F4]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 7h.01M8 12h.01M8 17h.01M12 7h8M12 12h8M12 17h8"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-xl text-[#F9F8F4]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                <path
                  d="M4 16l4.5-4.5L14 17l2.5-2.5L20 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
