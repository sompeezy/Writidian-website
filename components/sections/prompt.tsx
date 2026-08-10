"use client";

import { APP_URL, COPY, SAMPLE_PROMPTS } from "@/lib/constants";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

registerGsap();

const DEPTH = [
  { y: 0, x: 0, scale: 1, rotate: 0, opacity: 1 },
  { y: 18, x: -10, scale: 0.95, rotate: -2.5, opacity: 1 },
  { y: 34, x: 8, scale: 0.9, rotate: 2.5, opacity: 1 },
] as const;

const Z_BY_DEPTH = [3, 2, 1] as const;

function applyDepth(el: HTMLElement, depthIndex: number) {
  const d = DEPTH[depthIndex];
  gsap.set(el, {
    ...d,
    zIndex: Z_BY_DEPTH[depthIndex],
  });
}

function syncAria(cards: HTMLElement[], frontCardIndex: number) {
  cards.forEach((card, i) => {
    if (i === frontCardIndex) {
      card.removeAttribute("aria-hidden");
    } else {
      card.setAttribute("aria-hidden", "true");
    }
  });
}

export function Prompt() {
  const rootRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const stack = stackRef.current;
      const copy = copyRef.current;
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      if (!root || !stack || !copy || cards.length !== SAMPLE_PROMPTS.length) {
        return;
      }

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // order[depth] = card index; depth 0 is front
      const order = cards.map((_, i) => i);

      order.forEach((cardIndex, depthIndex) => {
        applyDepth(cards[cardIndex], depthIndex);
      });
      syncAria(cards, order[0]);

      if (reduced) {
        gsap.set([stack, copy], { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set(stack, { scale: 0.78, opacity: 0.2, y: 100, rotate: -2 });
      gsap.set(copy, { opacity: 0, y: 40 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            end: "center center",
            scrub: 1.05,
          },
        })
        .to(copy, { opacity: 1, y: 0, duration: 0.35 }, 0)
        .to(
          stack,
          { scale: 1, opacity: 1, y: 0, rotate: 0, duration: 0.55 },
          0.05,
        );

      let active = false;
      let cycleTl: gsap.core.Timeline | null = null;
      let holdCall: gsap.core.Tween | null = null;

      const clearHold = () => {
        holdCall?.kill();
        holdCall = null;
      };

      const runShuffle = () => {
        if (!active) return;

        const front = cards[order[0]];
        const mid = cards[order[1]];
        const back = cards[order[2]];

        cycleTl?.kill();
        cycleTl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: () => {
            order.push(order.shift()!);
            syncAria(cards, order[0]);
            if (!active) return;
            // Hold front card visible before next shuffle (~4s total)
            holdCall = gsap.delayedCall(2.6, runShuffle);
          },
        });

        cycleTl.to(front, {
          x: window.matchMedia("(max-width: 767px)").matches ? -72 : -140,
          rotate: -10,
          opacity: 0,
          duration: 0.55,
        });

        cycleTl.to(
          mid,
          { ...DEPTH[0], zIndex: Z_BY_DEPTH[0], duration: 0.5 },
          "-=0.25",
        );
        cycleTl.to(
          back,
          { ...DEPTH[1], zIndex: Z_BY_DEPTH[1], duration: 0.5 },
          "<",
        );

        cycleTl.set(front, {
          ...DEPTH[2],
          zIndex: Z_BY_DEPTH[2],
          opacity: 0,
        });
        cycleTl.to(front, {
          opacity: 1,
          duration: 0.35,
        });
      };

      const snapToOrder = () => {
        order.forEach((cardIndex, depthIndex) => {
          applyDepth(cards[cardIndex], depthIndex);
        });
        syncAria(cards, order[0]);
      };

      const playLoop = () => {
        if (active) return;
        active = true;
        holdCall = gsap.delayedCall(2.6, runShuffle);
      };

      const pauseLoop = () => {
        active = false;
        clearHold();
        cycleTl?.kill();
        cycleTl = null;
        snapToOrder();
      };

      const visibility = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onEnter: playLoop,
        onEnterBack: playLoop,
        onLeave: pauseLoop,
        onLeaveBack: pauseLoop,
      });

      if (ScrollTrigger.isInViewport(root)) {
        playLoop();
      }

      return () => {
        active = false;
        clearHold();
        cycleTl?.kill();
        visibility.kill();
      };
    },
    { dependencies: [] },
  );

  return (
    <section
      id="prompt"
      ref={rootRef}
      data-cursor-tone="light"
      className="relative scroll-mt-24 overflow-hidden bg-surface/60 px-5 py-20 sm:px-8 sm:py-48"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div
          ref={stackRef}
          className="relative order-2 will-change-transform lg:order-1"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-ink/5 blur-2xl"
          />
          {/* Invisible sizer so absolute cards reserve layout height (+ stack peek) */}
          <article
            aria-hidden
            className="invisible rounded-2xl px-5 py-10 text-center sm:rounded-[1.75rem] sm:px-14 sm:py-20"
          >
            <p className="font-eyebrow text-xs uppercase tracking-[0.28em]">
              {SAMPLE_PROMPTS[0].label}
            </p>
            <p className="font-prompt mt-8 text-[clamp(1.05rem,2.1vw,1.5rem)] leading-relaxed">
              {
                SAMPLE_PROMPTS.reduce((a, b) =>
                  a.text.length >= b.text.length ? a : b,
                ).text
              }
            </p>
            <div className="mt-8 inline-flex min-h-11 items-center rounded-full border px-6 py-2.5 text-sm tracking-wide sm:mt-12 sm:px-7 sm:py-3">
              Write Now
            </div>
            {/* Room for the two peeking cards below */}
            <div className="h-9 sm:h-10" />
          </article>
          {SAMPLE_PROMPTS.map((prompt, i) => (
            <article
              key={prompt.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              aria-hidden={i !== 0}
              className="absolute inset-x-0 top-0 rounded-2xl bg-white px-5 py-10 text-center shadow-[0_40px_80px_-40px_rgba(14,12,9,0.45)] sm:rounded-[1.75rem] sm:px-14 sm:py-20"
            >
              <p className="font-eyebrow text-xs uppercase tracking-[0.28em] text-gold">
                {prompt.label}
              </p>
              <p className="font-prompt mt-8 text-[clamp(1.05rem,2.1vw,1.5rem)] leading-relaxed text-ink">
                {prompt.text}
              </p>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex min-h-11 items-center rounded-full border border-gold px-6 py-2.5 text-sm tracking-wide text-gold transition-colors hover:bg-gold/10 sm:mt-12 sm:px-7 sm:py-3"
              >
                Write Now
              </a>
            </article>
          ))}
        </div>

        <div ref={copyRef} className="order-1 lg:order-2">
          <h2 className="font-serif text-[clamp(1.6rem,4.4vw,2.9rem)] leading-[1.14] tracking-tight text-ink">
            {COPY.promptTitle}
          </h2>
          <p className="font-accent mt-4 max-w-md text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
            {COPY.promptBody}
          </p>
        </div>
      </div>
    </section>
  );
}
