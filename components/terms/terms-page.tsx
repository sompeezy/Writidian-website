"use client";

import { linkifyText } from "@/components/privacy/linkify";
import { Reveal } from "@/components/ui/reveal";
import {
  TERMS,
  type TermsBlock,
  type TermsSection,
} from "@/lib/terms";

function Block({ block }: { block: TermsBlock }) {
  switch (block.type) {
    case "h3":
      return (
        <h3 className="font-serif text-lg tracking-tight text-ink sm:text-xl">
          {block.text}
        </h3>
      );
    case "list":
      return (
        <ul className="list-disc space-y-2 break-words pl-5 text-base text-ink-muted">
          {block.items.map((item) => (
            <li key={item.slice(0, 64)}>{linkifyText(item)}</li>
          ))}
        </ul>
      );
    default:
      return (
        <p className="break-words text-base leading-relaxed text-ink-muted">
          {linkifyText(block.text)}
        </p>
      );
  }
}

function Section({ section }: { section: TermsSection }) {
  return (
    <section id={section.id} className="scroll-mt-6 space-y-4 lg:scroll-mt-28">
      <h2 className="font-serif text-xl tracking-tight text-ink sm:text-2xl">
        {section.title}
      </h2>
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
    <nav aria-label="Terms of service contents">
      <ol className="space-y-1 text-sm leading-snug text-ink-muted">
        {TERMS.toc.map((item) => (
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

export function TermsPageContent() {
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
              {TERMS.title}
            </h1>
            <div
              aria-hidden
              className="mt-5 h-1 w-16 bg-gold/40 sm:mt-6"
            />
            <p className="mt-5 font-eyebrow text-[12px] uppercase tracking-[0.18em] text-ink-muted sm:mt-6">
              Last updated {TERMS.lastUpdated}
            </p>
            <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-ink-muted sm:text-lg">
              {TERMS.agreementBlocks.map((block, i) =>
                block.type === "p" ? (
                  <p key={`agree-${i}`} className="break-words">
                    {linkifyText(block.text)}
                  </p>
                ) : null,
              )}
            </div>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[16rem_minmax(0,1fr)]">
        <details className="rounded-sm border border-ink/10 bg-surface/40 px-4 py-2 lg:hidden">
          <summary className="font-eyebrow flex min-h-11 cursor-pointer list-none items-center text-[11px] uppercase tracking-[0.2em] text-gold [&::-webkit-details-marker]:hidden">
            Contents
          </summary>
          <div className="pb-3 pt-2">
            <ContentsNav />
          </div>
        </details>

        <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <p className="font-eyebrow text-[11px] uppercase tracking-[0.2em] text-gold">
            Contents
          </p>
          <div className="mt-4 max-h-[70vh] overflow-y-auto pr-2">
            <ContentsNav />
          </div>
        </aside>

        <div className="min-w-0 space-y-14 sm:space-y-16">
          {TERMS.sections.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
