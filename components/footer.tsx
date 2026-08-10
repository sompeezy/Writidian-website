import {
  APP_URL,
  FOOTER_LINKS,
  SITE,
  SOCIALS,
} from "@/lib/constants";
import { WritidianLogo } from "@/components/writidian-logo";

function SocialIcon({ id }: { id: (typeof SOCIALS)[number]["id"] }) {
  if (id === "email") {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 7 9-7" />
      </svg>
    );
  }
  if (id === "linkedin") {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-cursor-tone="light" className="border-t border-ink/10 bg-surface/60 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <a
              href="/"
              className="inline-block transition-opacity hover:opacity-80"
              aria-label={SITE.name}
            >
              <WritidianLogo tone="light" height={48} />
            </a>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">
              {SITE.tagline}
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    social.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 text-ink-muted transition-colors hover:border-gold/40 hover:text-ink"
                >
                  <SocialIcon id={social.id} />
                </a>
              ))}
            </div>
          </div>

          {(
            [
              ["Product", FOOTER_LINKS.product],
              ["Company", FOOTER_LINKS.company],
              ["Legal", FOOTER_LINKS.legal],
            ] as const
          ).map(([heading, links]) => (
            <div key={heading}>
              <p className="font-eyebrow text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                {heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => {
                  const external =
                    "external" in link && link.external
                      ? true
                      : link.href.startsWith("http") ||
                        link.href.startsWith("mailto:");
                  return (
                    <li key={link.href + link.label}>
                      <a
                        href={link.href}
                        {...(external && link.href.startsWith("http")
                          ? {
                              target: "_blank",
                              rel: "noopener noreferrer",
                            }
                          : {})}
                        className="inline-flex min-h-11 items-center text-sm text-ink-muted transition-colors hover:text-ink"
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink/10 pt-6 text-sm text-ink-muted/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}
          </p>
          <p className="text-ink-muted/70">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              app.writidian.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
