"use client";

import { getLenis } from "@/components/smooth-scroll";
import {
  COPY,
  STAT_HEAT_LEVELS,
  STAT_PANELS,
  STAT_WEEK,
  type StatPanelId,
} from "@/lib/constants";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useMemo, useRef, useSyncExternalStore } from "react";

registerGsap();

const PANEL_COUNT = STAT_PANELS.length;
const MOMENTUM = STAT_PANELS[0];
const RHYTHM = STAT_PANELS[5];
const COMPASS = STAT_PANELS.find((p) => p.id === "compass")!;
const RESONANCE = STAT_PANELS.find((p) => p.id === "resonance")!;

/**
 * The pinned scroll moves through three narrative stages; each one owns a
 * contiguous run of panels and swaps the section heading as it arrives.
 */
const STAGES = [
  {
    id: "streak",
    firstPanel: 0,
    title: COPY.streakTitle,
    body: COPY.streakBody,
    bullets: null,
  },
  {
    id: "rhythm",
    firstPanel: 1,
    title: COPY.analyticsTitle,
    body: COPY.analyticsBody,
    bullets: null,
  },
  {
    id: "advanced",
    firstPanel: 3,
    title: COPY.statsTitle,
    body: COPY.statsBody,
    bullets: COPY.statsBullets,
  },
] as const;

function stageForPanel(index: number): (typeof STAGES)[number] {
  let stage: (typeof STAGES)[number] = STAGES[0];
  for (const candidate of STAGES) {
    if (index >= candidate.firstPanel) stage = candidate;
  }
  return stage;
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function cellTone(level: number) {
  if (level === 0) return "bg-ink/8";
  if (level === 1) return "bg-gold/30";
  if (level === 2) return "bg-gold/60";
  return "bg-gold";
}

function compassPoint(
  index: number,
  total: number,
  radius: number,
  cx = 100,
  cy = 100,
) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  };
}

function subscribeNarrow(onStoreChange: () => void) {
  const mq = window.matchMedia("(max-width: 1023px)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getNarrowSnapshot() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

function getNarrowServerSnapshot() {
  return false;
}

function StaticMomentumDisplay() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-transparent shadow-[0_0_28px_rgba(163,138,94,0.3)]"
        aria-hidden
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className="text-gold"
        >
          <path
            d="M12 2s5 5.2 5 10a5 5 0 1 1-10 0c0-2.4 1.4-4.8 3-6.5C10.8 7.2 12 9 12 9s.7-1.6 1.6-2.8C15 4.4 12 2 12 2Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <p className="font-serif text-5xl text-ink">{MOMENTUM.value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gold">
        Days Streak
      </p>
      <div className="mt-8 flex gap-2" aria-hidden>
        {MOMENTUM.daysActive.map((active, i) => (
          <span
            key={i}
            className={`h-3 w-3 rounded-full sm:h-3.5 sm:w-3.5 ${
              active ? "bg-gold" : "bg-ink/15"
            }`}
          />
        ))}
      </div>
      <div className="mt-3 flex w-full max-w-xs justify-between px-1 text-[9px] uppercase tracking-[0.12em] text-ink-muted">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>
    </div>
  );
}

function StaticWordsDisplay() {
  return (
    <div className="flex flex-col px-4 py-6">
      <p className="text-center font-serif text-5xl text-ink">
        {STAT_PANELS[1].value}
      </p>
      <p className="mt-1 text-center text-xs uppercase tracking-[0.18em] text-gold">
        Words Flowed
      </p>
      <div
        className="mt-8 flex h-40 items-end justify-between gap-2 sm:h-48 sm:gap-3"
        aria-hidden
      >
        {STAT_WEEK.map((d) => (
          <div
            key={d.day}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <div
              className="w-full rounded-t-md bg-gold/85"
              style={{ height: `${d.h}%` }}
            />
            <span className="text-[9px] uppercase tracking-[0.1em] text-ink-muted">
              {d.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaticSanctuaryDisplay() {
  const progress = "progress" in STAT_PANELS[2] ? STAT_PANELS[2].progress : 0.72;
  const sessions = "sessions" in STAT_PANELS[2] ? STAT_PANELS[2].sessions : 18;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full -rotate-90"
          aria-hidden
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="color-mix(in srgb, var(--ink) 10%, transparent)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="relative z-10 text-center">
          <p className="font-serif text-4xl text-ink sm:text-5xl">
            {STAT_PANELS[2].value}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-gold">
            hours
          </p>
        </div>
      </div>
      <p className="mt-6 text-sm text-ink-muted">
        <span className="text-ink">{sessions}</span> focused sessions
      </p>
    </div>
  );
}

function StaticCompassDisplay() {
  const axes = COMPASS.axes;
  const radarPoints = axes
    .map((axis, i) => {
      const pt = compassPoint(i, axes.length, 38 + axis.value * 48);
      return `${pt.x.toFixed(2)},${pt.y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6">
      <div className="relative h-56 w-56 sm:h-64 sm:w-64">
        <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
          {[0.35, 0.55, 0.75, 0.95].map((scale) => (
            <circle
              key={scale}
              cx="100"
              cy="100"
              r={38 + scale * 48}
              fill="none"
              stroke="color-mix(in srgb, var(--gold) 22%, transparent)"
              strokeWidth="1"
            />
          ))}
          {axes.map((_, i) => {
            const end = compassPoint(i, axes.length, 86);
            return (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={end.x}
                y2={end.y}
                stroke="color-mix(in srgb, var(--gold) 20%, transparent)"
                strokeWidth="1"
              />
            );
          })}
          <polygon
            points={radarPoints}
            fill="color-mix(in srgb, var(--gold) 35%, transparent)"
            stroke="var(--gold)"
            strokeWidth="2"
          />
        </svg>
        {axes.map((axis, i) => {
          const pt = compassPoint(i, axes.length, 96);
          return (
            <span
              key={axis.label}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-[9px] uppercase tracking-[0.1em] text-gold sm:text-[10px]"
              style={{
                left: `${(pt.x / 200) * 100}%`,
                top: `${(pt.y / 200) * 100}%`,
              }}
            >
              {axis.label}
            </span>
          );
        })}
      </div>
      <p className="mt-2 font-serif text-xl text-ink">
        {COMPASS.value} · {COMPASS.unit}
      </p>
    </div>
  );
}

function StaticResonanceDisplay() {
  const bars = RESONANCE.bars;

  return (
    <div className="flex flex-col px-4 py-6">
      <p className="text-[10px] uppercase tracking-[0.18em] text-gold">
        Resonance
      </p>
      <div className="mt-5 space-y-3.5" aria-hidden>
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="text-ink">{bar.label}</span>
              <span className="text-ink-muted">
                {Math.round(bar.value * 100)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink/8">
              <div
                className="h-full rounded-full bg-gold"
                style={{ width: `${bar.value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <svg
        viewBox="0 0 200 36"
        className="mt-5 h-8 w-full text-gold"
        aria-hidden
      >
        <path
          d="M0 18 Q20 10 40 18 T80 18 T120 18 T160 18 T200 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

function StaticRhythmDisplay() {
  return (
    <div className="flex flex-col px-4 py-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold">
          Writing Rhythm
        </p>
        <p className="text-[10px] text-ink-muted">2026</p>
      </div>
      <div
        className="mt-6 grid grid-cols-12 content-start gap-1.5 sm:gap-2"
        aria-hidden
      >
        {STAT_HEAT_LEVELS.map((level, i) => (
          <div
            key={i}
            className={`aspect-square rounded-[3px] sm:rounded-sm ${cellTone(level)}`}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[9px] uppercase tracking-[0.12em] text-ink-muted">
        {RHYTHM.months.map((m, i) => (
          <span key={`${m}-${i}`}>{m}</span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-ink-muted">
        <span>Less</span>
        <span className="h-2.5 w-2.5 rounded-[2px] bg-ink/8" />
        <span className="h-2.5 w-2.5 rounded-[2px] bg-gold/30" />
        <span className="h-2.5 w-2.5 rounded-[2px] bg-gold/60" />
        <span className="h-2.5 w-2.5 rounded-[2px] bg-gold" />
        <span>More</span>
      </div>
    </div>
  );
}

function StaticPanelDisplay({ id }: { id: StatPanelId }) {
  switch (id) {
    case "momentum":
      return <StaticMomentumDisplay />;
    case "words":
      return <StaticWordsDisplay />;
    case "sanctuary":
      return <StaticSanctuaryDisplay />;
    case "compass":
      return <StaticCompassDisplay />;
    case "resonance":
      return <StaticResonanceDisplay />;
    case "rhythm":
      return <StaticRhythmDisplay />;
    default:
      return null;
  }
}

function MobileStatsStack() {
  return (
    <section
      id="stats"
      data-cursor="scroll"
      data-cursor-tone="light"
      className="scroll-mt-24 bg-surface/50 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-[clamp(1.6rem,5vw,2.5rem)] leading-[1.1] tracking-tight text-ink">
          {COPY.statsTitle}
        </h2>
        <p className="font-accent mt-4 text-base leading-relaxed text-ink-muted">
          {COPY.statsBody}
        </p>

        <div className="mt-12 space-y-14">
          {STAT_PANELS.map((panel) => (
            <article key={panel.id}>
              <h3 className="font-serif text-[clamp(1.35rem,4vw,1.85rem)] leading-tight tracking-tight text-ink">
                {panel.label}
              </h3>
              <p className="font-accent mt-2 text-base leading-relaxed text-ink-muted">
                {panel.caption}
              </p>
              <div className="mt-5 overflow-hidden rounded-2xl border border-ink/8 bg-paper/70">
                <StaticPanelDisplay id={panel.id} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Stats() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const bulletsRef = useRef<HTMLUListElement>(null);
  const lastIndexRef = useRef(-1);
  const panelTlsRef = useRef<ReturnType<typeof gsap.timeline>[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const isNarrow = useSyncExternalStore(
    subscribeNarrow,
    getNarrowSnapshot,
    getNarrowServerSnapshot,
  );

  const heatCells = useMemo(
    () =>
      STAT_HEAT_LEVELS.map((level, i) => ({
        id: i,
        level,
      })),
    [],
  );

  useGSAP(
    () => {
      if (reducedMotion || isNarrow) return;

      const root = rootRef.current;
      const pin = pinRef.current;
      const panelsBox = panelsRef.current;
      const labelEl = labelRef.current;
      const captionEl = captionRef.current;
      const headingEl = headingRef.current;
      const bodyEl = bodyRef.current;
      const bulletsEl = bulletsRef.current;
      if (!root || !pin || !panelsBox || !labelEl || !captionEl) return;

      const panels = gsap.utils.toArray<HTMLElement>(
        panelsBox.querySelectorAll("[data-panel]"),
      );

      const buildPanelTimeline = (panel: HTMLElement, id: StatPanelId) => {
        const tl = gsap.timeline({ paused: true });

        if (id === "momentum") {
          const count = panel.querySelector<HTMLElement>("[data-count]");
          const flame = panel.querySelector<HTMLElement>("[data-flame]");
          const days = gsap.utils.toArray<HTMLElement>(
            panel.querySelectorAll("[data-day-dot]"),
          );
          const state = { value: 0 };
          if (flame) gsap.set(flame, { scale: 0.55, opacity: 0.35 });
          if (count) count.textContent = "0";
          gsap.set(days, { scale: 0.6, opacity: 0.25 });
          if (flame) {
            tl.to(flame, { scale: 1.08, opacity: 1, duration: 0.45 }, 0).to(
              flame,
              { scale: 1, duration: 0.2 },
              0.45,
            );
          }
          if (count) {
            tl.to(
              state,
              {
                value: 12,
                duration: 0.7,
                ease: "power2.out",
                onUpdate: () => {
                  count.textContent = String(Math.round(state.value));
                },
              },
              0.05,
            );
          }
          tl.to(
            days,
            {
              scale: 1,
              opacity: 1,
              stagger: 0.07,
              duration: 0.35,
              ease: "back.out(1.6)",
            },
            0.15,
          );
        }

        if (id === "words") {
          const count = panel.querySelector<HTMLElement>("[data-count]");
          const bars = gsap.utils.toArray<HTMLElement>(
            panel.querySelectorAll("[data-bar]"),
          );
          const state = { value: 0 };
          if (count) count.textContent = "0";
          gsap.set(bars, {
            scaleY: 0.08,
            opacity: 0.35,
            transformOrigin: "bottom",
          });
          if (count) {
            tl.to(
              state,
              {
                value: 28.4,
                duration: 0.75,
                ease: "power2.out",
                onUpdate: () => {
                  count.textContent = `${state.value.toFixed(1)}k`;
                },
              },
              0,
            );
          }
          tl.to(
            bars,
            {
              scaleY: 1,
              opacity: 1,
              stagger: 0.07,
              duration: 0.5,
              ease: "power2.out",
            },
            0.1,
          );
        }

        if (id === "sanctuary") {
          const count = panel.querySelector<HTMLElement>("[data-count]");
          const ring = panel.querySelector<SVGCircleElement>("[data-ring]");
          const sessions = panel.querySelector<HTMLElement>("[data-sessions]");
          const state = { value: 0, sessions: 0 };
          if (count) count.textContent = "0";
          if (sessions) sessions.textContent = "0";
          if (ring) {
            const length = ring.getTotalLength?.() ?? 2 * Math.PI * 42;
            gsap.set(ring, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
            tl.to(
              ring,
              {
                strokeDashoffset: length * (1 - 0.72),
                duration: 0.9,
                ease: "power2.out",
              },
              0,
            );
          }
          if (count) {
            tl.to(
              state,
              {
                value: 14.5,
                duration: 0.8,
                ease: "power2.out",
                onUpdate: () => {
                  count.textContent = state.value.toFixed(1);
                },
              },
              0,
            );
          }
          if (sessions) {
            tl.to(
              state,
              {
                sessions: 18,
                duration: 0.7,
                ease: "power2.out",
                onUpdate: () => {
                  sessions.textContent = String(Math.round(state.sessions));
                },
              },
              0.1,
            );
          }
        }

        if (id === "compass") {
          const poly = panel.querySelector<SVGPolygonElement>("[data-radar]");
          const rings = gsap.utils.toArray<SVGElement>(
            panel.querySelectorAll("[data-radar-ring]"),
          );
          const labels = gsap.utils.toArray<HTMLElement>(
            panel.querySelectorAll("[data-axis-label]"),
          );
          gsap.set(rings, { opacity: 0, scale: 0.7, transformOrigin: "center" });
          gsap.set(labels, { opacity: 0, y: 6 });
          if (poly) gsap.set(poly, { scale: 0.15, opacity: 0, transformOrigin: "center" });
          tl.to(
            rings,
            {
              opacity: 1,
              scale: 1,
              stagger: 0.08,
              duration: 0.35,
              ease: "power2.out",
            },
            0,
          );
          if (poly) {
            tl.to(
              poly,
              {
                scale: 1,
                opacity: 0.85,
                duration: 0.65,
                ease: "power2.out",
              },
              0.15,
            );
          }
          tl.to(
            labels,
            { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 },
            0.25,
          );
        }

        if (id === "resonance") {
          const bars = gsap.utils.toArray<HTMLElement>(
            panel.querySelectorAll("[data-res-bar]"),
          );
          const wave = panel.querySelector<SVGPathElement>("[data-wave]");
          gsap.set(bars, { scaleX: 0, transformOrigin: "left" });
          if (wave) gsap.set(wave, { opacity: 0 });
          tl.to(
            bars,
            {
              scaleX: 1,
              stagger: 0.08,
              duration: 0.55,
              ease: "power2.out",
            },
            0,
          );
          if (wave) {
            tl.fromTo(
              wave,
              { opacity: 0 },
              { opacity: 0.7, duration: 0.4 },
              0.2,
            );
            tl.fromTo(
              wave,
              { attr: { d: wave.getAttribute("d") || "" } },
              {
                keyframes: [
                  {
                    attr: {
                      d: "M0 18 Q20 6 40 18 T80 18 T120 18 T160 18 T200 18",
                    },
                  },
                  {
                    attr: {
                      d: "M0 18 Q20 28 40 18 T80 18 T120 18 T160 18 T200 18",
                    },
                  },
                  {
                    attr: {
                      d: "M0 18 Q20 10 40 18 T80 18 T120 18 T160 18 T200 18",
                    },
                  },
                ],
                duration: 1.8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              },
              0.25,
            );
          }
        }

        if (id === "rhythm") {
          const cells = gsap.utils.toArray<HTMLElement>(
            panel.querySelectorAll("[data-cell]"),
          );
          gsap.set(cells, { opacity: 0.12, scale: 0.7 });
          tl.to(
            cells,
            {
              opacity: 1,
              scale: 1,
              stagger: { each: 0.008, from: "start" },
              duration: 0.28,
              ease: "power1.out",
            },
            0,
          );
        }

        return tl;
      };

      panelTlsRef.current = panels.map((panel) =>
        buildPanelTimeline(panel, panel.dataset.panel as StatPanelId),
      );

      let lastStageId = "";
      const syncStage = (index: number) => {
        const stage = stageForPanel(index);
        if (stage.id === lastStageId) return;
        lastStageId = stage.id;

        if (headingEl) headingEl.textContent = stage.title;
        if (bodyEl) bodyEl.textContent = stage.body;
        if (bulletsEl) {
          gsap.to(bulletsEl, {
            autoAlpha: stage.bullets ? 1 : 0,
            duration: 0.35,
            ease: "power2.out",
          });
        }
        if (headingEl && bodyEl) {
          gsap.fromTo(
            [headingEl, bodyEl],
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          );
        }
      };

      const syncMeta = (index: number) => {
        if (index === lastIndexRef.current) return;
        lastIndexRef.current = index;
        const panel = STAT_PANELS[index];
        if (!panel) return;
        labelEl.textContent = panel.label;
        captionEl.textContent = panel.caption;
        syncStage(index);

        root
          .querySelectorAll<HTMLElement>("[data-rail-dot]")
          .forEach((dot) => {
            const i = Number(dot.dataset.railIndex);
            const active = i === index;
            dot.dataset.active = active ? "true" : "false";
            if (dot.hasAttribute("aria-current")) {
              dot.setAttribute("aria-current", active ? "true" : "false");
            }
          });

        panels.forEach((el, i) => {
          const active = i === index;
          el.dataset.active = active ? "true" : "false";
          el.style.opacity = active ? "1" : "0";
          el.style.pointerEvents = active ? "auto" : "none";
        });

        panelTlsRef.current.forEach((innerTl, i) => {
          if (i === index) {
            innerTl.restart();
          } else {
            innerTl.pause(0);
          }
        });
      };

      panels.forEach((el, i) => {
        el.dataset.active = i === 0 ? "true" : "false";
      });
      labelEl.textContent = STAT_PANELS[0].label;
      captionEl.textContent = STAT_PANELS[0].caption;
      if (headingEl) headingEl.textContent = STAGES[0].title;
      if (bodyEl) bodyEl.textContent = STAGES[0].body;
      if (bulletsEl) gsap.set(bulletsEl, { autoAlpha: 0 });
      lastStageId = STAGES[0].id;

      // Dummy scrubbed tween keeps pin + progress in sync with Lenis
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
          pin,
          anticipatePin: 1,
          onEnter: () => {
            lastIndexRef.current = -1;
            syncMeta(0);
          },
          onEnterBack: () => {
            lastIndexRef.current = -1;
            syncMeta(PANEL_COUNT - 1);
          },
          onUpdate: (self) => {
            const index = Math.min(
              PANEL_COUNT - 1,
              Math.floor(self.progress * 0.999 * PANEL_COUNT),
            );
            syncMeta(index);
          },
          onRefresh: (self) => {
            scrollTriggerRef.current = self;
          },
        },
      });

      // Equal-weight segments so progress maps cleanly to 6 panels
      tl.to({}, { duration: PANEL_COUNT });

      scrollTriggerRef.current = tl.scrollTrigger ?? null;
      panelTlsRef.current[0]?.restart();

      return () => {
        scrollTriggerRef.current = null;
      };
    },
    { dependencies: [reducedMotion, isNarrow] },
  );

  const jumpToPanel = (index: number) => {
    const st = scrollTriggerRef.current;
    const targetProgress = (index + 0.5) / PANEL_COUNT;

    const scrollToTarget = (target: number) => {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1.05,
          onComplete: () => ScrollTrigger.update(),
        });
      } else {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
      window.setTimeout(() => ScrollTrigger.update(), 1100);
    };

    if (st) {
      scrollToTarget(st.start + (st.end - st.start) * targetProgress);
      return;
    }

    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const triggerStart = scrollTop + rect.top;
    const triggerLength = root.offsetHeight - window.innerHeight;
    scrollToTarget(triggerStart + targetProgress * Math.max(triggerLength, 1));
  };

  const compassAxes = COMPASS.axes;
  const resonanceBars = RESONANCE.bars;

  const radarPoints = compassAxes
    .map((axis, i) => {
      const pt = compassPoint(i, compassAxes.length, 38 + axis.value * 48);
      return `${pt.x.toFixed(2)},${pt.y.toFixed(2)}`;
    })
    .join(" ");

  if (reducedMotion || isNarrow) {
    return <MobileStatsStack />;
  }

  return (
    <section
      id="stats"
      ref={rootRef}
      data-cursor="scroll"
      data-cursor-tone="light"
      className="relative h-[520vh] scroll-mt-24 bg-surface/50 md:h-[620vh]"
    >
      <div
        ref={pinRef}
        className="relative flex h-[100dvh] flex-col overflow-hidden"
      >
        <div className="mx-auto grid h-full w-full max-w-6xl grid-cols-1 items-center gap-6 px-5 pb-16 pt-24 sm:px-8 sm:pt-28 lg:grid-cols-[minmax(0,0.95fr)_auto_minmax(0,1.1fr)] lg:gap-8 lg:pb-16 lg:pt-28">
          {/* Copy */}
          <div className="relative z-10 shrink-0">
            <h2
              ref={headingRef}
              className="font-serif text-[clamp(1.6rem,4vw,2.9rem)] leading-[1.1] tracking-tight text-ink"
            >
              {STAGES[0].title}
            </h2>
            <p
              ref={bodyRef}
              className="font-accent mt-4 max-w-md text-sm leading-relaxed text-ink-muted sm:mt-5 sm:text-lg"
            >
              {STAGES[0].body}
            </p>
            <ul
              ref={bulletsRef}
              className="font-accent mt-5 max-w-md space-y-2 text-sm leading-relaxed text-ink-muted opacity-0"
            >
              {COPY.statsBullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-gold"
                  />
                  {bullet}
                </li>
              ))}
            </ul>
            <p
              ref={labelRef}
              className="font-eyebrow mt-8 text-[10px] uppercase tracking-[0.22em] text-gold sm:text-xs"
            />
            <p
              ref={captionRef}
              className="font-accent mt-2 max-w-sm text-sm leading-relaxed text-ink/70 sm:text-base"
            />
          </div>

          {/* Progress rail */}
          <div
            className="relative z-20 hidden flex-col items-center gap-3 lg:flex"
            aria-label="Stats progress"
          >
            {STAT_PANELS.map((panel, index) => (
              <button
                key={panel.id}
                type="button"
                data-rail-dot
                data-rail-index={index}
                data-active={index === 0 ? "true" : "false"}
                aria-label={`Go to ${panel.label}`}
                aria-current={index === 0 ? "true" : "false"}
                onClick={() => jumpToPanel(index)}
                className="group relative flex items-center justify-center"
              >
                <span className="block h-2 w-2 rounded-full bg-gold/35 transition-all duration-300 group-hover:bg-gold/70 group-data-[active=true]:h-3.5 group-data-[active=true]:w-3.5 group-data-[active=true]:bg-gold group-data-[active=true]:shadow-[0_0_12px_rgba(163,138,94,0.35)]" />
                <span className="pointer-events-none absolute left-5 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-paper opacity-0 transition-opacity group-hover:opacity-100">
                  {panel.label}
                </span>
              </button>
            ))}
          </div>

          {/* App frame */}
          <div className="relative z-10 flex min-h-0 w-full flex-1 items-center justify-center lg:flex-none">
            <div className="relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-transparent bg-transparent p-4 sm:p-6 lg:max-w-lg">
              <div className="mb-4 flex items-center justify-between sm:mb-5">
                <p className="font-serif text-lg text-ink sm:text-xl">
                  Your Stats
                </p>
                <span className="rounded-full border border-gold/45 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-gold">
                  Persona
                </span>
              </div>

              {/* Mobile rail */}
              <div
                className="mb-4 flex items-center justify-center gap-2 lg:hidden"
                aria-label="Stats progress"
              >
                {STAT_PANELS.map((panel, index) => (
                  <button
                    key={panel.id}
                    type="button"
                    data-rail-dot
                    data-rail-index={index}
                    data-active={index === 0 ? "true" : "false"}
                    aria-label={`Go to ${panel.label}`}
                    onClick={() => jumpToPanel(index)}
                    className="h-2 w-2 rounded-full bg-gold/35 transition-all duration-300 data-[active=true]:w-6 data-[active=true]:bg-gold"
                  />
                ))}
              </div>

              <div
                ref={panelsRef}
                className="relative aspect-[4/5] w-full sm:aspect-[5/6]"
              >
                {/* Momentum */}
                <div
                  data-panel="momentum"
                  data-active="true"
                  className="absolute inset-0 flex flex-col opacity-0 transition-opacity duration-300 data-[active=true]:opacity-100"
                >
                  <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-transparent bg-transparent p-6">
                    <div
                      data-flame
                      className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-transparent shadow-[0_0_28px_rgba(163,138,94,0.3)]"
                      aria-hidden
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-gold"
                      >
                        <path
                          d="M12 2s5 5.2 5 10a5 5 0 1 1-10 0c0-2.4 1.4-4.8 3-6.5C10.8 7.2 12 9 12 9s.7-1.6 1.6-2.8C15 4.4 12 2 12 2Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <p className="font-serif text-5xl text-ink sm:text-6xl">
                      <span data-count>0</span>
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gold">
                      Days Streak
                    </p>
                    <div className="mt-8 flex gap-2" aria-hidden>
                      {"daysActive" in MOMENTUM &&
                        MOMENTUM.daysActive.map((active, i) => (
                        <span
                          key={i}
                          data-day-dot
                          className={`h-3 w-3 rounded-full sm:h-3.5 sm:w-3.5 ${
                            active ? "bg-gold" : "bg-ink/15"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-3 flex w-full justify-between px-1 text-[9px] uppercase tracking-[0.12em] text-ink-muted">
                      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                        <span key={`${d}-${i}`}>{d}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Words */}
                <div
                  data-panel="words"
                  data-active="false"
                  className="absolute inset-0 flex flex-col opacity-0 transition-opacity duration-300 data-[active=true]:opacity-100"
                >
                  <div className="flex flex-1 flex-col rounded-2xl border border-transparent bg-transparent p-5 sm:p-6">
                    <p className="text-center font-serif text-5xl text-ink sm:text-6xl">
                      <span data-count>0</span>
                    </p>
                    <p className="mt-1 text-center text-xs uppercase tracking-[0.18em] text-gold">
                      Words Flowed
                    </p>
                    <div
                      className="mt-8 flex h-40 flex-1 items-end justify-between gap-2 sm:h-48 sm:gap-3"
                      aria-hidden
                    >
                      {STAT_WEEK.map((d) => (
                        <div
                          key={d.day}
                          className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                        >
                          <div
                            data-bar
                            className="w-full rounded-t-md bg-gold/85 transition-[filter,transform] duration-200 hover:brightness-110 hover:-translate-y-0.5"
                            style={{ height: `${d.h}%` }}
                          />
                          <span className="text-[9px] uppercase tracking-[0.1em] text-ink-muted">
                            {d.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sanctuary Hours */}
                <div
                  data-panel="sanctuary"
                  data-active="false"
                  className="absolute inset-0 flex flex-col opacity-0 transition-opacity duration-300 data-[active=true]:opacity-100"
                >
                  <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-transparent bg-transparent p-6">
                    <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
                      <svg
                        viewBox="0 0 100 100"
                        className="absolute inset-0 h-full w-full -rotate-90"
                        aria-hidden
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="color-mix(in srgb, var(--ink) 10%, transparent)"
                          strokeWidth="6"
                        />
                        <circle
                          data-ring
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="var(--gold)"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="relative z-10 text-center">
                        <p className="font-serif text-4xl text-ink sm:text-5xl">
                          <span data-count>0</span>
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-gold">
                          hours
                        </p>
                      </div>
                    </div>
                    <p className="mt-6 text-sm text-ink-muted">
                      <span data-sessions className="text-ink">
                        0
                      </span>{" "}
                      focused sessions
                    </p>
                  </div>
                </div>

                {/* Thematic Compass */}
                <div
                  data-panel="compass"
                  data-active="false"
                  className="absolute inset-0 flex flex-col opacity-0 transition-opacity duration-300 data-[active=true]:opacity-100"
                >
                  <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-transparent bg-transparent p-4 sm:p-6">
                    <div className="relative h-56 w-56 sm:h-64 sm:w-64">
                      <svg
                        viewBox="0 0 200 200"
                        className="h-full w-full"
                        aria-hidden
                      >
                        {[0.35, 0.55, 0.75, 0.95].map((scale) => (
                          <circle
                            key={scale}
                            data-radar-ring
                            cx="100"
                            cy="100"
                            r={38 + scale * 48}
                            fill="none"
                            stroke="color-mix(in srgb, var(--gold) 22%, transparent)"
                            strokeWidth="1"
                          />
                        ))}
                        {compassAxes.map((_, i) => {
                          const end = compassPoint(i, compassAxes.length, 86);
                          return (
                            <line
                              key={i}
                              data-radar-ring
                              x1="100"
                              y1="100"
                              x2={end.x}
                              y2={end.y}
                              stroke="color-mix(in srgb, var(--gold) 20%, transparent)"
                              strokeWidth="1"
                            />
                          );
                        })}
                        <polygon
                          data-radar
                          points={radarPoints}
                          fill="color-mix(in srgb, var(--gold) 35%, transparent)"
                          stroke="var(--gold)"
                          strokeWidth="2"
                        />
                      </svg>
                      {compassAxes.map((axis, i) => {
                        const pt = compassPoint(i, compassAxes.length, 96);
                        return (
                          <span
                            key={axis.label}
                            data-axis-label
                            className="absolute -translate-x-1/2 -translate-y-1/2 text-[9px] uppercase tracking-[0.1em] text-gold sm:text-[10px]"
                            style={{
                              left: `${(pt.x / 200) * 100}%`,
                              top: `${(pt.y / 200) * 100}%`,
                            }}
                          >
                            {axis.label}
                          </span>
                        );
                      })}
                    </div>
                    <p className="mt-2 font-serif text-xl text-ink">
                      Fantasy · 42%
                    </p>
                  </div>
                </div>

                {/* Soundscape Resonance */}
                <div
                  data-panel="resonance"
                  data-active="false"
                  className="absolute inset-0 flex flex-col opacity-0 transition-opacity duration-300 data-[active=true]:opacity-100"
                >
                  <div className="flex flex-1 flex-col rounded-2xl border border-transparent bg-transparent p-5 sm:p-6">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-gold">
                      Resonance
                    </p>
                    <div className="mt-5 flex-1 space-y-3.5" aria-hidden>
                      {resonanceBars.map((bar) => (
                        <div key={bar.label}>
                          <div className="mb-1.5 flex items-center justify-between text-[11px]">
                            <span className="text-ink">{bar.label}</span>
                            <span className="text-ink-muted">
                              {Math.round(bar.value * 100)}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-ink/8">
                            <div
                              data-res-bar
                              className="h-full rounded-full bg-gold transition-[filter] duration-200 hover:brightness-110"
                              style={{ width: `${bar.value * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <svg
                      viewBox="0 0 200 36"
                      className="mt-5 h-8 w-full text-gold"
                      aria-hidden
                    >
                      <path
                        data-wave
                        d="M0 18 Q20 10 40 18 T80 18 T120 18 T160 18 T200 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        opacity="0.7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Flow Rhythm */}
                <div
                  data-panel="rhythm"
                  data-active="false"
                  className="absolute inset-0 flex flex-col opacity-0 transition-opacity duration-300 data-[active=true]:opacity-100"
                >
                  <div className="flex flex-1 flex-col rounded-2xl border border-transparent bg-transparent p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gold">
                        Writing Rhythm
                      </p>
                      <p className="text-[10px] text-ink-muted">2026</p>
                    </div>
                    <div
                      className="mt-6 grid flex-1 grid-cols-12 content-start gap-1.5 sm:gap-2"
                      aria-hidden
                    >
                      {heatCells.map((cell) => (
                        <div
                          key={cell.id}
                          data-cell
                          className={`aspect-square rounded-[3px] transition-[filter,transform] duration-200 hover:brightness-125 hover:scale-110 sm:rounded-sm ${cellTone(cell.level)}`}
                        />
                      ))}
                    </div>
                    <div className="mt-3 flex justify-between text-[9px] uppercase tracking-[0.12em] text-ink-muted">
                      {"months" in RHYTHM &&
                        RHYTHM.months.map((m, i) => (
                          <span key={`${m}-${i}`}>{m}</span>
                        ))}
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-ink-muted">
                      <span>Less</span>
                      <span className="h-2.5 w-2.5 rounded-[2px] bg-ink/8" />
                      <span className="h-2.5 w-2.5 rounded-[2px] bg-gold/30" />
                      <span className="h-2.5 w-2.5 rounded-[2px] bg-gold/60" />
                      <span className="h-2.5 w-2.5 rounded-[2px] bg-gold" />
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
