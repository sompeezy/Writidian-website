"use client";

import { BrandLogo, type BrandKey } from "@/components/brand-logos";
import { useHeroSanctuaryAudio } from "@/hooks/use-hero-sanctuary-audio";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { COPY, SOCIAL_CLUTTER } from "@/lib/constants";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useMemo, useRef } from "react";

registerGsap();

type NotifTheme = "ios" | "dark" | "whatsapp" | "discord";

function themeFor(brand: BrandKey): NotifTheme {
  if (brand === "whatsapp") return "whatsapp";
  if (brand === "discord") return "discord";
  if (brand === "tiktok" || brand === "x") return "dark";
  return "ios";
}

function NotificationCard({
  brand,
  platform,
  title,
  body,
  accent,
  index,
  compact,
}: {
  brand: BrandKey;
  platform: string;
  title: string;
  body: string;
  accent: string;
  index: number;
  compact?: boolean;
}) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const theme = themeFor(brand);
  const iconSize = compact ? 18 : 22;
  const floatY = 5 + (index % 3) * 2.5;
  const floatDuration = 3.4 + (index % 4) * 0.45;
  const floatDelay = index * 0.18;
  const tilt = ((index % 5) - 2) * 1.1;

  const shell =
    theme === "dark"
      ? "bg-[#1c1c1e]/92 text-white ring-1 ring-white/10"
      : theme === "discord"
        ? "bg-[#313338]/95 text-white ring-1 ring-white/10"
        : theme === "whatsapp"
          ? "bg-[#efeae2]/95 text-ink ring-1 ring-black/5"
          : "bg-white/92 text-ink ring-1 ring-black/5";

  const muted =
    theme === "dark" || theme === "discord"
      ? "text-white/55"
      : "text-ink-muted";

  const titleCls =
    theme === "dark" || theme === "discord" ? "text-white" : "text-ink";

  const bodyCls =
    theme === "dark" || theme === "discord"
      ? "text-white/75"
      : "text-ink/80";

  return (
    <motion.div
      className={`relative ${compact ? "w-[min(48vw,12.5rem)]" : "w-[min(74vw,18rem)]"}`}
      initial={reduced ? false : { opacity: 0, scale: 0.82, y: 18 }}
      animate={
        reduced
          ? { opacity: 1, scale: 1, y: 0, rotate: tilt }
          : {
              opacity: 1,
              scale: 1,
              y: [0, -floatY, 0],
              rotate: [tilt, tilt + 1.4, tilt],
            }
      }
      transition={
        reduced
          ? { duration: 0 }
          : {
              opacity: { duration: 0.45, delay: floatDelay * 0.35 },
              scale: {
                type: "spring",
                stiffness: 280,
                damping: 18,
                delay: floatDelay * 0.35,
              },
              y: {
                duration: floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: floatDelay,
              },
              rotate: {
                duration: floatDuration * 1.15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: floatDelay,
              },
            }
      }
    >
      <motion.span
        aria-hidden
        className="absolute -right-1 -top-1 z-10 h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3"
        style={{ background: accent }}
        animate={
          reduced
            ? { scale: 1, opacity: 1 }
            : { scale: [1, 1.35, 1], opacity: [1, 0.55, 1] }
        }
        transition={
          reduced
            ? { duration: 0 }
            : {
                duration: 1.6 + (index % 3) * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.12,
              }
        }
      />

      <div
        className={`relative overflow-hidden rounded-[1.15rem] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.55)] backdrop-blur-md ${shell} ${
          compact ? "p-2.5" : "p-3"
        }`}
      >
        {theme === "whatsapp" && (
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-[3px] bg-[#25D366]"
          />
        )}
        {theme === "discord" && (
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-[3px] bg-[#5865F2]"
          />
        )}

        {/* App header row — iOS / Android style */}
        <div className="mb-1.5 flex items-center gap-2">
          <span
            className={`relative flex shrink-0 overflow-hidden shadow-sm ${
              brand === "whatsapp" || brand === "pinterest"
                ? "rounded-full"
                : "rounded-[0.45rem]"
            } ${
              brand === "slack" || brand === "calendar"
                ? "ring-1 ring-black/10"
                : ""
            }`}
          >
            <BrandLogo brand={brand} size={iconSize} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p
                className={`truncate font-semibold tracking-tight ${
                  compact ? "text-[10px]" : "text-[11px]"
                } ${titleCls}`}
              >
                {platform}
              </p>
              {brand === "whatsapp" && (
                <span className="text-[9px] text-[#25D366]">●</span>
              )}
            </div>
          </div>
          <span className={`shrink-0 text-[9px] ${muted}`}>now</span>
        </div>

        <p
          className={`text-left font-semibold leading-snug ${
            compact ? "text-[11px]" : "text-[13px]"
          } ${titleCls}`}
        >
          {title}
        </p>
        <p
          className={`mt-0.5 text-left leading-snug ${
            compact ? "text-[10px] line-clamp-2" : "text-[12px]"
          } ${bodyCls}`}
        >
          {body}
        </p>

        {/* Platform flourishes */}
        {brand === "instagram" && !compact && (
          <div className="mt-2 flex gap-1.5">
            <span className="h-8 w-8 overflow-hidden rounded-md bg-gradient-to-br from-[#fdf497] via-[#fd5949] to-[#d6249f] opacity-80" />
            <span className="h-8 flex-1 rounded-md bg-ink/5" />
          </div>
        )}
        {brand === "pinterest" && !compact && (
          <div className="mt-2 h-10 overflow-hidden rounded-lg bg-gradient-to-br from-[#ffd6de] to-[#E60023]/30" />
        )}
        {brand === "youtube" && !compact && (
          <div className="mt-2 flex h-10 items-center justify-center rounded-lg bg-ink/5">
            <span className="flex h-6 w-9 items-center justify-center rounded-md bg-[#FF0000]">
              <span className="ml-0.5 border-y-[5px] border-l-[8px] border-y-transparent border-l-white" />
            </span>
          </div>
        )}
        {brand === "tiktok" && !compact && (
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55]"
              initial={{ width: "20%" }}
              animate={{ width: ["20%", "75%", "40%"] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function SanctuaryReveal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const clutterRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const noiseLineRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { unlock, setSanctuaryVolume, fadeOutPastHero } =
    useHeroSanctuaryAudio();

  const clutter = useMemo(
    () =>
      isMobile
        ? SOCIAL_CLUTTER.filter((item) => item.mobile)
        : [...SOCIAL_CLUTTER],
    [isMobile],
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      const pin = pinRef.current;
      const scene = sceneRef.current;
      const clutterEl = clutterRef.current;
      const veil = veilRef.current;
      const caption = captionRef.current;
      if (!root || !pin || !scene || !clutterEl) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const noiseLine = noiseLineRef.current;
      const pieces = gsap.utils.toArray<HTMLElement>(
        clutterEl.querySelectorAll("[data-clutter]"),
      );

      if (reduced) {
        gsap.set(pieces, { opacity: 0 });
        gsap.set(scene, { scale: 1, filter: "none" });
        gsap.set(veil, { opacity: 0 });
        if (noiseLine) gsap.set(noiseLine, { opacity: 0 });
        gsap.set(caption, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(scene, { scale: 1.06, filter: "blur(8px) brightness(0.45)" });
      gsap.set(veil, { opacity: 0.6 });
      if (noiseLine) gsap.set(noiseLine, { opacity: 1, y: 0 });
      gsap.set(caption, { opacity: 0, y: 24 });
      gsap.set(pieces, {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        filter: "blur(0px)",
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.15,
          pin: pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.28) setSanctuaryVolume(0);
            else if (p < 0.72) setSanctuaryVolume((p - 0.28) / 0.44);
            else setSanctuaryVolume(1);
          },
          onLeave: () => fadeOutPastHero(),
          onLeaveBack: () => setSanctuaryVolume(0),
        },
      });

      pieces.forEach((piece, i) => {
        const ox = Number(piece.dataset.ox ?? 0);
        const oy = Number(piece.dataset.oy ?? 0);
        const rot = Number(piece.dataset.rot ?? 0);
        tl.to(
          piece,
          {
            x: `${ox}vw`,
            y: `${oy}vh`,
            rotate: rot,
            scale: 1.2,
            opacity: 0,
            filter: "blur(16px)",
            duration: 0.55,
          },
          0.04 + i * 0.03,
        );
      });

      if (noiseLine) {
        tl.to(
          noiseLine,
          { opacity: 0, y: -20, filter: "blur(6px)", duration: 0.22 },
          0.16,
        );
      }

      tl.to(
        scene,
        {
          scale: 1,
          filter: "blur(0px) brightness(1)",
          duration: 0.55,
        },
        0.2,
      );
      tl.to(veil, { opacity: 0, duration: 0.45 }, 0.22);
      tl.to(caption, { opacity: 1, y: 0, duration: 0.3 }, 0.55);

      const unlockOnce = () => {
        void unlock();
        window.removeEventListener("scroll", unlockOnce);
        window.removeEventListener("pointerdown", unlockOnce);
      };
      window.addEventListener("scroll", unlockOnce, { passive: true });
      window.addEventListener("pointerdown", unlockOnce);
      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        window.removeEventListener("scroll", unlockOnce);
        window.removeEventListener("pointerdown", unlockOnce);
      };
    },
    {
      dependencies: [
        unlock,
        setSanctuaryVolume,
        fadeOutPastHero,
        clutter,
        isMobile,
      ],
    },
  );

  return (
    <div
      id="sanctuary"
      ref={rootRef}
      data-cursor="scroll"
      data-cursor-tone="dark"
      className="relative h-[200vh] scroll-mt-24 md:h-[260vh]"
      aria-label="Clear the noise"
    >
      <div
        ref={pinRef}
        className="relative h-[100dvh] overflow-hidden bg-espresso"
      >
        <div ref={sceneRef} className="absolute inset-0 will-change-transform">
          <Image
            src="/images/writing-sanctuary-focus.jpg"
            alt="Writer focused at a desk with headphones, papers, and a city window beyond"
            fill
            priority
            className="object-cover object-[72%_center] sm:object-[68%_center] md:object-[62%_center]"
            sizes="100vw"
          />
        </div>

        <div
          ref={veilRef}
          aria-hidden
          className="absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(14,12,9,0.5) 0%, rgba(14,12,9,0.78) 100%)",
          }}
        />

        {/* Act I — the noise, named */}
        <div
          ref={noiseLineRef}
          className="pointer-events-none absolute inset-x-0 top-[16%] z-30 px-6 text-center sm:top-[18%]"
        >
          <p className="font-eyebrow text-[10px] uppercase tracking-[0.3em] text-paper/50 sm:text-[11px]">
            Every time you sit down to write
          </p>
          <p className="mx-auto mt-3 max-w-2xl font-serif text-[29px] italic leading-snug text-paper/90 sm:text-[41px]">
            The world will not stop talking.
          </p>
        </div>

        <div
          ref={clutterRef}
          className="pointer-events-none absolute inset-0 z-20"
          aria-hidden
        >
          {clutter.map((item, index) => (
            <div
              key={item.id}
              data-clutter
              data-ox={item.ox}
              data-oy={item.oy}
              data-rot={item.rot}
              className="absolute will-change-transform"
              style={{
                left: `${isMobile ? item.mx : item.x}%`,
                top: `${isMobile ? item.my : item.y}%`,
              }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <NotificationCard
                  {...item}
                  index={index}
                  compact={isMobile}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Act II — the quiet, kept */}
        <div
          ref={captionRef}
          className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-espresso/95 via-espresso/50 to-transparent px-5 pb-[max(3.5rem,calc(env(safe-area-inset-bottom)+2.5rem))] pt-24 text-center sm:px-8 sm:pb-16 sm:pt-32"
        >
          <p className="font-eyebrow text-[10px] uppercase tracking-[0.3em] text-gold-soft sm:text-[11px]">
            Your writing sanctuary
          </p>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-2xl leading-snug text-paper sm:mt-5 sm:text-4xl">
            In here, it&rsquo;s just you, your thoughts{" "}
            <span className="italic text-gold-soft">and the page.</span>
          </p>
          <p className="font-accent mx-auto mt-3 max-w-lg text-sm leading-relaxed text-paper/65 sm:text-base">
            {COPY.sanctuaryBody}
          </p>
        </div>
      </div>
    </div>
  );
}
