"use client";

import { Button } from "@/components/ui/button";
import { useSound } from "@/components/sound-context";
import { WritidianLogo } from "@/components/writidian-logo";
import { APP_URL, SITE } from "@/lib/constants";
import { useEffect, useId, useState } from "react";

const LINKS = [
  { href: "/#sanctuary", label: "Sanctuary", id: "sanctuary" },
  { href: "/#soundscapes", label: "Sound", id: "soundscapes" },
  { href: "/#prompt", label: "Prompt", id: "prompt" },
  { href: "/#editor", label: "Write", id: "editor" },
] as const;

const EXTRA_LINKS = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
] as const;

function SoundIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        <path d="m23 9-6 6" />
        <path d="m17 9 6 6" />
      </svg>
    );
  }
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function Nav() {
  const { muted, toggleMuted, setMuted, unlockAudio } = useSound();
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setMuted(true);
  }, [setMuted]);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );

    const onScroll = () => {
      let current: string | null = null;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= window.innerHeight * 0.35) current = el.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="relative z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:pt-4">
      <div className="relative mx-auto max-w-6xl rounded-sm">
        <div className="flex h-14 items-center justify-between gap-3 px-1 sm:h-16 sm:px-2">
          <a
            href="/"
            className="shrink-0"
            aria-label={SITE.name}
          >
            <WritidianLogo tone="light" height={44} />
          </a>

          <nav
            aria-label="Page sections"
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 md:flex lg:gap-8"
          >
            {LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`font-eyebrow group/link relative flex min-h-11 items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive ? "text-gold" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-1 w-1 rounded-full bg-gold transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {link.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-gold transition-transform duration-300 ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover/link:scale-x-100"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                void unlockAudio();
                toggleMuted();
              }}
              aria-pressed={muted}
              aria-label={muted ? "Unmute sound" : "Mute sound"}
              className={`relative flex h-11 w-11 items-center justify-center transition-colors duration-300 ${
                muted
                  ? "text-ink-muted hover:text-ink"
                  : "text-gold hover:text-ink"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-sm transition-shadow ${
                  !muted
                    ? "ring-1 ring-gold/40"
                    : "ring-1 ring-transparent group-hover:ring-current/20"
                }`}
              >
                <SoundIcon muted={muted} />
              </span>
              <span className="font-eyebrow pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-sm border border-ink/10 bg-paper px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-ink opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
                {muted ? "Sound off" : "Sound on"}
              </span>
            </button>

            <Button
              variant="primary"
              className="!min-h-11 !rounded-sm !px-3.5 !py-2.5 !text-[11px] uppercase tracking-[0.14em] sm:!px-4 sm:!text-xs"
            >
              Sign up
            </Button>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center text-ink md:hidden"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[70] flex flex-col bg-paper md:hidden"
          style={{
            paddingTop: "max(1rem, env(safe-area-inset-top))",
            paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
          }}
        >
          <div className="flex items-center justify-between px-4 py-2">
            <a
              href="/"
              className="shrink-0"
              aria-label={SITE.name}
              onClick={() => setMenuOpen(false)}
            >
              <WritidianLogo tone="light" height={36} />
            </a>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center text-ink"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <MenuIcon open />
            </button>
          </div>

          <nav
            aria-label="Mobile sections"
            className="mt-6 flex flex-1 flex-col gap-1 px-5"
          >
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`font-serif flex min-h-14 items-center border-b border-ink/8 text-2xl tracking-tight transition-colors ${
                  active === link.id ? "text-gold" : "text-ink"
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-8 space-y-1">
              {EXTRA_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-eyebrow flex min-h-11 items-center text-[12px] uppercase tracking-[0.2em] text-ink-muted"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="px-5 pt-4">
            <Button
              variant="primary"
              className="!w-full !max-w-none !rounded-sm"
              href={APP_URL}
            >
              Sign up
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
