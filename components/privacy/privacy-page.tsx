"use client";

import { linkifyText } from "@/components/privacy/linkify";
import { Reveal } from "@/components/ui/reveal";
import {
  PRIVACY,
  type PrivacyBlock,
  type PrivacySection,
} from "@/lib/privacy";

function Block({ block }: { block: PrivacyBlock }) {
  switch (block.type) {
    case "h3":
      return (
        <h3 className="font-serif text-lg tracking-tight text-ink sm:text-xl">
          {block.text}
        </h3>
      );
    case "callout":
      return (
        <p className="border-l-2 border-gold/50 pl-4 text-[15px] leading-relaxed text-ink-muted sm:text-base">
          <span className="font-eyebrow mr-2 text-[11px] uppercase tracking-[0.18em] text-gold">
            In Short
          </span>
          {linkifyText(block.text)}
        </p>
      );
    case "list":
      return (
        <ul className="list-disc space-y-2 break-words pl-5 text-base text-ink-muted">
          {block.items.map((item) => (
            <li key={item.slice(0, 48)}>{linkifyText(item)}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <>
          {/* Mobile: stacked cards */}
          <div className="space-y-3 md:hidden">
            {block.rows.map((row) => (
              <article
                key={row.category}
                className="rounded-sm border border-ink/10 bg-surface/40 px-4 py-4"
              >
                <p className="font-medium text-ink">{row.category}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {row.examples || "—"}
                </p>
                <p className="font-eyebrow mt-3 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                  Collected: {row.collected}
                </p>
              </article>
            ))}
          </div>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-sm border border-ink/10 md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-surface/80">
                  {block.headers.map((h) => (
                    <th
                      key={h}
                      className="border-b border-ink/10 px-3 py-2.5 font-eyebrow text-[11px] font-medium uppercase tracking-[0.16em] text-ink"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr
                    key={row.category}
                    className="align-top even:bg-surface/40"
                  >
                    <td className="border-b border-ink/8 px-3 py-3 font-medium text-ink">
                      {row.category}
                    </td>
                    <td className="border-b border-ink/8 px-3 py-3 text-ink-muted">
                      {row.examples || "—"}
                    </td>
                    <td className="border-b border-ink/8 px-3 py-3 font-eyebrow text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                      {row.collected}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    default:
      return (
        <p className="break-words text-base leading-relaxed text-ink-muted">
          {linkifyText(block.text)}
        </p>
      );
  }
}

function Section({ section }: { section: PrivacySection }) {
  return (
    <section id={section.id} className="scroll-mt-6 space-y-4 lg:scroll-mt-28">
      <h2 className="font-serif text-xl tracking-tight text-ink sm:text-2xl">
        {section.title}
      </h2>
      {section.inShort ? (
        <p className="border-l-2 border-gold/50 pl-4 text-[15px] leading-relaxed text-ink-muted sm:text-base">
          <span className="font-eyebrow mr-2 text-[11px] uppercase tracking-[0.18em] text-gold">
            In Short
          </span>
          {linkifyText(section.inShort)}
        </p>
      ) : null}
      <div className="space-y-4">
        {section.blocks.map((block, i) => (
          <Block key={`${section.id}-${i}`} block={block} />
        ))}
      </div>
    </section>
  );
}

function ContentsNav() {
  return (
    <nav aria-label="Privacy policy contents">
      <ol className="space-y-1 text-sm leading-snug text-ink-muted">
        {PRIVACY.toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="flex min-h-11 items-center py-1 transition-colors hover:text-ink"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PrivacyPageContent() {
  return (
    <div data-cursor-tone="light" className="bg-paper">
      <header className="relative overflow-hidden border-b border-ink/8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(163,138,94,0.12),transparent_65%),linear-gradient(180deg,var(--surface)_0%,var(--paper)_100%)]"
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14">
          <Reveal y={32}>
            <p className="font-eyebrow text-[12px] uppercase tracking-[0.22em] text-gold">
              Legal
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.08] tracking-tight text-ink">
              {PRIVACY.title}
            </h1>
            <div
              aria-hidden
              className="mt-5 h-1 w-16 bg-gold/40 sm:mt-6"
            />
            <p className="mt-5 font-eyebrow text-[12px] uppercase tracking-[0.18em] text-ink-muted sm:mt-6">
              Last updated {PRIVACY.lastUpdated}
            </p>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink-muted sm:text-lg">
              {PRIVACY.introLead}
            </p>
            <ul className="mt-4 max-w-3xl list-disc space-y-2 break-words pl-5 text-base leading-relaxed text-ink-muted sm:text-lg">
              {PRIVACY.introServices.map((item) => (
                <li key={item.slice(0, 40)}>{linkifyText(item)}</li>
              ))}
            </ul>
            <p className="mt-6 max-w-3xl break-words text-base leading-relaxed text-ink-muted sm:text-lg">
              {linkifyText(PRIVACY.introClose)}
            </p>
          </Reveal>
        </div>
      </header>

      <section className="border-b border-ink/8 bg-surface/50">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <h2 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">
            Summary of key points
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
            {PRIVACY.keyPointsIntro}
          </p>
          <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2">
            {PRIVACY.keyPoints.map((point) => (
              <a
                key={point.question}
                href={point.href}
                className="group block min-h-11 space-y-2 transition-colors"
              >
                <h3 className="font-serif text-lg text-ink group-hover:text-gold sm:text-xl">
                  {point.question}
                </h3>
                <p className="text-base leading-relaxed text-ink-muted sm:text-[15px]">
                  {point.answer}
                </p>
                <span className="font-eyebrow text-[11px] uppercase tracking-[0.16em] text-gold underline underline-offset-2">
                  Read more
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[16rem_minmax(0,1fr)]">
        {/* Mobile collapsible TOC */}
        <details className="rounded-sm border border-ink/10 bg-surface/40 px-4 py-2 lg:hidden">
          <summary className="font-eyebrow flex min-h-11 cursor-pointer list-none items-center text-[11px] uppercase tracking-[0.2em] text-gold [&::-webkit-details-marker]:hidden">
            Contents
          </summary>
          <div className="pb-3 pt-2">
            <ContentsNav />
          </div>
        </details>

        {/* Desktop sticky TOC */}
        <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <p className="font-eyebrow text-[11px] uppercase tracking-[0.2em] text-gold">
            Contents
          </p>
          <div className="mt-4 max-h-[70vh] overflow-y-auto pr-2">
            <ContentsNav />
          </div>
        </aside>

        <div className="min-w-0 space-y-14 sm:space-y-16">
          {PRIVACY.sections.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
