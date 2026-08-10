"use client";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ABOUT } from "@/lib/about";
import { CONTACT_EMAIL } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

registerGsap();

function LexiconHero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const items = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-lex]"),
      );

      if (reduced) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(items, { opacity: 0, y: 22 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.12,
      });
    },
    { dependencies: [] },
  );

  const { lexicon, coined } = ABOUT;

  return (
    <section
      ref={rootRef}
      data-cursor-tone="light"
      className="relative overflow-hidden bg-paper px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_12%_0%,rgba(163,138,94,0.12),transparent_58%),linear-gradient(180deg,var(--surface)_0%,var(--paper)_100%)]"
      />

      <div className="relative mx-auto max-w-3xl">
        <p
          data-lex
          className="font-eyebrow text-[12px] uppercase tracking-[0.24em] text-ink"
        >
          {ABOUT.title}
        </p>

        <h1
          data-lex
          className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-serif text-[clamp(3rem,12vw,5.75rem)] leading-[0.95] tracking-tight text-ink"
        >
          <span>{lexicon.word}</span>
          <span className="font-serif text-[clamp(1.1rem,3vw,1.5rem)] italic font-normal text-ink-muted">
            {lexicon.pos}
          </span>
        </h1>

        <div
          data-lex
          aria-hidden
          className="mt-8 h-px w-full bg-ink/12 sm:mt-10"
        />

        <p
          data-lex
          className="mt-8 max-w-xl text-base leading-relaxed text-ink-muted sm:mt-10 sm:text-lg"
        >
          {coined}
        </p>

        <p
          data-lex
          className="mt-8 font-serif text-[clamp(1.2rem,3.5vw,2rem)] leading-[1.3] text-ink sm:mt-10"
        >
          Write{" "}
          <span className="text-ink-muted" aria-hidden>
            +
          </span>{" "}
          Quotidian{" "}
          <span className="font-sans text-[0.55em] uppercase tracking-[0.14em] text-ink-muted">
            (every day)
          </span>{" "}
          <span className="text-ink-muted" aria-hidden>
            =
          </span>{" "}
          <span className="italic">Write every day</span>
        </p>
      </div>
    </section>
  );
}

function PhilosophyBands() {
  const [thinking, hostile, purpose] = ABOUT.paragraphs;

  return (
    <>
      <section data-cursor-tone="light" className="bg-paper px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-10">
        <Reveal className="mx-auto max-w-3xl">
          <p className="font-eyebrow text-[11px] uppercase tracking-[0.22em] text-ink">
            Belief
          </p>
          <p className="mt-5 font-serif text-[clamp(1.4rem,3.5vw,2.1rem)] leading-[1.3] text-ink">
            {thinking}
          </p>
        </Reveal>
      </section>

      <section data-cursor-tone="dark" className="relative overflow-hidden bg-espresso px-5 py-20 text-paper sm:px-8 sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 80% 30%, color-mix(in srgb, var(--gold) 22%, transparent), transparent 70%)",
          }}
        />
        <Reveal className="relative mx-auto max-w-3xl">
          <p className="font-eyebrow text-[11px] uppercase tracking-[0.22em] text-gold-soft">
            The problem
          </p>
          <p className="mt-5 font-serif text-[clamp(1.4rem,3.5vw,2.1rem)] leading-[1.3]">
            {hostile}
          </p>
        </Reveal>
      </section>

      <section data-cursor-tone="light" className="bg-surface/60 px-5 py-16 sm:px-8 sm:py-24">
        <Reveal className="mx-auto max-w-3xl">
          <p className="font-eyebrow text-[11px] uppercase tracking-[0.22em] text-ink">
            Purpose
          </p>
          <p className="mt-5 font-serif text-[clamp(1.4rem,3.5vw,2.1rem)] leading-[1.3] text-ink">
            {purpose}
          </p>
        </Reveal>
      </section>
    </>
  );
}

function AudienceSection() {
  return (
    <section data-cursor-tone="light" className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 pb-6 pt-16 sm:px-8 sm:pt-24">
        <Reveal>
          <h2 className="font-serif text-[clamp(1.85rem,5vw,3.25rem)] leading-[1.08] tracking-tight text-ink">
            {ABOUT.audience.title}
          </h2>
          <div
            aria-hidden
            className="mt-5 h-1 w-14 bg-gold/40 sm:mt-6"
          />
        </Reveal>
      </div>

      <div className="mx-auto max-w-6xl space-y-16 px-5 pb-20 sm:space-y-24 sm:px-8 sm:pb-28">
        {ABOUT.audience.rows.map((row) => (
          <Reveal key={row.id} y={36}>
            <div className="grid items-center gap-8 lg:grid-cols-5 lg:gap-12">
              <div
                className={`relative aspect-[4/3] w-full overflow-hidden lg:col-span-2 lg:aspect-[5/4] ${
                  row.imageFirst ? "order-2 lg:order-1" : "order-2"
                }`}
              >
                <Image
                  src={row.image}
                  alt={row.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div
                className={`lg:col-span-3 ${
                  row.imageFirst ? "order-1 lg:order-2" : "order-1"
                }`}
              >
                <p className="font-serif text-[clamp(1.25rem,2.8vw,1.75rem)] leading-[1.35] text-ink">
                  {row.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function VisionMission() {
  return (
    <>
      <section data-cursor-tone="dark" className="relative overflow-hidden bg-espresso px-5 py-20 text-paper sm:px-8 sm:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 20% 60%, color-mix(in srgb, var(--gold) 24%, transparent), transparent 68%)",
          }}
        />
        <Reveal className="relative mx-auto max-w-3xl text-center sm:text-left">
          <p className="font-eyebrow text-[11px] uppercase tracking-[0.22em] text-gold-soft">
            {ABOUT.vision.label}
          </p>
          <p className="mt-6 font-serif text-[clamp(1.5rem,4vw,2.5rem)] leading-[1.22]">
            {ABOUT.vision.body}
          </p>
        </Reveal>
      </section>

      <section data-cursor-tone="light" className="bg-paper px-5 py-20 sm:px-8 sm:py-32">
        <Reveal className="mx-auto max-w-3xl text-center sm:text-left">
          <p className="font-eyebrow text-[11px] uppercase tracking-[0.22em] text-ink">
            {ABOUT.mission.label}
          </p>
          <p className="mt-6 font-serif text-[clamp(1.5rem,4vw,2.5rem)] leading-[1.22] text-ink">
            {ABOUT.mission.body}
          </p>
        </Reveal>
      </section>
    </>
  );
}

function ContactClose() {
  return (
    <section data-cursor-tone="light" className="border-t border-ink/8 bg-surface/50 px-5 py-20 pb-[max(5rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-28">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-start gap-8 sm:items-center sm:text-center">
        <p className="font-serif text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.25] text-ink">
          {ABOUT.contact.lead}
        </p>
        <Button
          href={`mailto:${CONTACT_EMAIL}`}
          className="max-md:!w-full max-md:!max-w-xs"
        >
          {ABOUT.contact.cta}
        </Button>
      </Reveal>
    </section>
  );
}

export function AboutPageContent() {
  return (
    <div data-cursor-tone="light" className="bg-paper">
      <LexiconHero />
      <PhilosophyBands />
      <AudienceSection />
      <VisionMission />
      <ContactClose />
    </div>
  );
}
