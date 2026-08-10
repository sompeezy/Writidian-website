"use client";

import { useSound } from "@/components/sound-context";
import { useSoundscapeAudio, type SoundscapeSceneId } from "@/hooks/use-soundscape-audio";
import { gsap, registerGsap } from "@/lib/gsap";
import { COPY, GENRES, SOUNDSCAPE_SCENES } from "@/lib/constants";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

registerGsap();

const SCENE_IDS = SOUNDSCAPE_SCENES.map((scene) => scene.id) as SoundscapeSceneId[];
const SCENE_COUNT = SOUNDSCAPE_SCENES.length;
/** Relative timeline length per scene (hold + crossfade window). */
const SEGMENT = 1;
const FADE = 0.22;
const PARALLAX_START = -7;

function sceneIndexFromProgress(progress: number) {
  return Math.min(
    SCENE_COUNT - 1,
    Math.max(0, Math.floor(progress * SCENE_COUNT * 0.999)),
  );
}

export function Soundscapes() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const scenesRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const lastIndexRef = useRef(-1);
  const { setScene, fadeOutSection, ensureBeds } = useSoundscapeAudio();
  const { unlockAudio } = useSound();

  useGSAP(
    () => {
      const root = rootRef.current;
      const pin = pinRef.current;
      const scenes = scenesRef.current;
      const caption = captionRef.current;
      const titleEl = titleRef.current;
      if (!root || !pin || !scenes || !caption || !titleEl) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cards = gsap.utils.toArray<HTMLElement>(scenes.querySelectorAll("[data-scene]"));

      const syncScene = (index: number) => {
        if (index === lastIndexRef.current) return;
        lastIndexRef.current = index;
        const scene = SOUNDSCAPE_SCENES[index];
        if (!scene) return;
        titleEl.textContent = scene.category;
        caption.textContent = scene.title;
        void setScene(SCENE_IDS[index]);
      };

      if (reduced) {
        gsap.set(cards, { opacity: 0 });
        gsap.set(cards[0], { opacity: 1 });
        gsap.set(cards[0]?.querySelectorAll("[data-scene-image], [data-scene-foreground]"), { yPercent: 0, scale: 1 });
        titleEl.textContent = SOUNDSCAPE_SCENES[0].category;
        caption.textContent = SOUNDSCAPE_SCENES[0].title;
        return;
      }

      gsap.set(cards, { opacity: 0 });
      gsap.set(cards[0], { opacity: 1 });
      cards.forEach((card) => {
        const image = card.querySelector("[data-scene-image]");
        const foreground = card.querySelector("[data-scene-foreground]");
        if (image) gsap.set(image, { yPercent: PARALLAX_START, scale: 1.08 });
        if (foreground) gsap.set(foreground, { yPercent: 9, scale: 1.14 });
      });
      titleEl.textContent = SOUNDSCAPE_SCENES[0].category;
      caption.textContent = SOUNDSCAPE_SCENES[0].title;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
          pin,
          anticipatePin: 1,
          onEnter: () => {
            void unlockAudio().then(() => ensureBeds());
            lastIndexRef.current = -1;
            syncScene(0);
          },
          onEnterBack: () => {
            void unlockAudio().then(() => ensureBeds());
            lastIndexRef.current = -1;
            syncScene(SCENE_COUNT - 1);
          },
          onLeave: () => {
            lastIndexRef.current = -1;
            fadeOutSection();
          },
          onLeaveBack: () => {
            lastIndexRef.current = -1;
            fadeOutSection();
          },
        },
        // Use scrubbed timeline progress so audio matches the visible crossfade
        onUpdate: () => {
          syncScene(sceneIndexFromProgress(tl.progress()));
        },
      });

      SOUNDSCAPE_SCENES.forEach((scene, index) => {
        const card = cards[index];
        const image = card.querySelector("[data-scene-image]");
        const foreground = card.querySelector("[data-scene-foreground]");
        const at = index * SEGMENT;

        // Every scene (including the first) gets parallax across its segment
        if (image) {
          tl.fromTo(
            image,
            { yPercent: PARALLAX_START, scale: 1.08 },
            { yPercent: 0, scale: 1, duration: SEGMENT * 0.85, ease: "none" },
            at,
          );
        }
        if (foreground) {
          tl.fromTo(
            foreground,
            { yPercent: 9, scale: 1.14 },
            { yPercent: -2, scale: 1, duration: SEGMENT, ease: "none" },
            at,
          );
        }

        if (index > 0) {
          const previous = cards[index - 1];
          tl.to(previous, { opacity: 0, duration: FADE, ease: "none" }, at);
          tl.to(card, { opacity: 1, duration: FADE, ease: "none" }, at);
        }

        tl.call(
          () => {
            titleEl.textContent = scene.category;
            caption.textContent = scene.title;
          },
          undefined,
          at,
        );
      });
    },
    { dependencies: [setScene, fadeOutSection, ensureBeds, unlockAudio] },
  );

  return (
    <section
      id="soundscapes"
      ref={rootRef}
      data-cursor="scroll"
      data-cursor-tone="dark"
      className="relative h-[250vh] scroll-mt-24 bg-paper md:h-[320vh]"
    >
      <div
        ref={pinRef}
        className="relative flex h-[100dvh] flex-col overflow-hidden pt-20 sm:pt-24"
      >
        <div ref={scenesRef} className="absolute inset-0 z-0 overflow-hidden bg-espresso">
          {SOUNDSCAPE_SCENES.map((scene, index) => (
            <div key={scene.id} data-scene className="absolute inset-0 will-change-transform" style={{ zIndex: index + 1 }}>
                  <PhotoSceneArtwork sceneId={scene.id} image={scene.image} foreground={scene.foreground} priority={index === 0} />
            </div>
          ))}
        </div>

        {/* Marketing copy — top on mobile, bottom-left on desktop */}
        <div className="absolute left-5 right-5 top-24 z-10 max-w-md text-left md:bottom-24 md:top-auto md:right-auto sm:left-8 lg:left-14 lg:bottom-28">
          <h2 className="font-serif text-[clamp(1.35rem,4.2vw,2.75rem)] leading-[1.1] tracking-tight text-paper">
            {COPY.soundscapesTitle}
          </h2>
          <p className="font-accent mt-2 text-sm leading-relaxed text-paper/80 sm:mt-4 sm:text-base md:mt-3">
            {COPY.soundscapesBody}
          </p>
          <ul className="font-accent mt-3 hidden space-y-2 text-left text-sm leading-relaxed text-paper/75 md:block">
            {COPY.soundscapeBullets.map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-gold"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Scene caption — single column above marquee on mobile; bottom-right on desktop */}
        <div className="absolute bottom-[calc(3.25rem+env(safe-area-inset-bottom))] left-5 right-5 z-10 text-left md:bottom-24 md:left-auto md:right-8 md:max-w-sm md:text-right lg:right-14 lg:bottom-28">
          <p
            ref={titleRef}
            className="font-eyebrow text-[11px] uppercase tracking-[0.22em] text-gold sm:text-xs"
          />
          <p
            ref={captionRef}
            className="mt-1.5 font-serif text-lg leading-snug text-paper sm:mt-2 sm:text-3xl"
          />
        </div>

        <div className="absolute bottom-0 z-20 w-full overflow-hidden border-t border-white/15 bg-espresso/25 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-paper backdrop-blur-[2px] sm:py-4 sm:pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="marquee-track font-eyebrow flex w-max gap-8 whitespace-nowrap px-4 text-[11px] uppercase tracking-[0.2em] text-paper/75 sm:gap-10 sm:text-sm">
            {[...GENRES, ...GENRES].map((genre, index) => (
              <span key={`${genre}-${index}`} className="flex items-center gap-8 sm:gap-10">
                {genre}
                <span className="text-gold">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoSceneArtwork({
  sceneId,
  image,
  foreground,
  priority,
}: {
  sceneId: SoundscapeSceneId;
  image: string;
  foreground: string;
  priority: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-espresso" data-photo-scene={sceneId}>
      <Image
        src={image}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 55vw"
        className="soundscape-photo-layer object-cover"
        data-scene-image
      />
      <Image
        src={foreground}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 55vw"
        className="soundscape-photo-foreground object-cover blur-[1.25px]"
        data-scene-foreground
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/10 to-espresso/20" />
    </div>
  );
}

function SceneArtwork({ sceneId }: { sceneId: SoundscapeSceneId }) {
  const common = "h-full w-full text-gold-soft";

  if (sceneId === "journaling") {
    return (
      <svg aria-hidden="true" viewBox="0 0 800 600" className={common} preserveAspectRatio="xMidYMid slice">
        <g data-layer="background"><rect width="800" height="600" fill="var(--espresso)" /><circle cx="145" cy="100" r="150" fill="var(--gold)" opacity=".08" /><circle cx="670" cy="270" r="230" fill="var(--gold-soft)" opacity=".05" /></g>
        <g data-layer="midground" fill="none" stroke="currentColor" strokeLinecap="round"><circle cx="165" cy="210" r="38" strokeWidth="2" opacity=".5" /><circle cx="245" cy="145" r="15" strokeWidth="1.5" opacity=".75" /><circle cx="610" cy="150" r="26" strokeWidth="2" opacity=".4" /><circle cx="690" cy="260" r="52" strokeWidth="1.5" opacity=".35" /><path d="M100 355c80-28 150-24 220 0M530 345c80-28 140-24 210 0" strokeWidth="1.5" opacity=".35" /></g>
        <g data-layer="foreground"><path d="M165 320c110-38 265-38 385 0v180c-120 32-275 32-385 0Z" fill="var(--surface)" opacity=".18" /><path d="M165 320c110 38 265 38 385 0M165 500c110-38 265-38 385 0" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M205 375h115M205 400h90M430 375h75M430 400h104" stroke="currentColor" strokeLinecap="round" strokeWidth="2" opacity=".7" /><circle cx="592" cy="410" r="18" fill="var(--gold)" opacity=".3" /><path d="M579 410h26M592 397v26" stroke="currentColor" strokeWidth="1.5" /></g>
      </svg>
    );
  }

  if (sceneId === "literary-fiction") {
    return (
      <svg aria-hidden="true" viewBox="0 0 800 600" className={common} preserveAspectRatio="xMidYMid slice">
        <g data-layer="background"><rect width="800" height="600" fill="#211a15" /><path d="M0 170h800M0 410h800" stroke="var(--gold-soft)" strokeWidth="1" opacity=".15" /><circle cx="630" cy="120" r="180" fill="var(--gold)" opacity=".07" /></g>
        <g data-layer="midground" fill="none" stroke="currentColor" strokeWidth="3" opacity=".65"><rect x="100" y="92" width="600" height="330" rx="4" /><path d="M140 130h520M140 170h520M140 210h520M140 250h520M140 290h520M140 330h520M140 370h520" opacity=".35" /><path d="M185 125v262M325 125v262M465 125v262M605 125v262" opacity=".25" /></g>
        <g data-layer="foreground"><rect x="280" y="150" width="240" height="180" rx="3" fill="var(--surface)" opacity=".17" transform="rotate(-4 280 150)" /><rect x="296" y="166" width="208" height="148" fill="var(--gold)" opacity=".18" transform="rotate(-4 296 166)" /><path d="M330 205h120M330 230h95M330 255h135" stroke="currentColor" strokeLinecap="round" strokeWidth="2" opacity=".7" /><path d="M164 440c120-38 355-38 475 0" fill="none" stroke="currentColor" strokeWidth="2" opacity=".45" /><path d="M214 430v58M590 430v58" stroke="currentColor" strokeWidth="3" opacity=".45" /></g>
      </svg>
    );
  }

  if (sceneId === "romance") {
    return (
      <svg aria-hidden="true" viewBox="0 0 800 600" className={common} preserveAspectRatio="xMidYMid slice">
        <g data-layer="background"><rect width="800" height="600" fill="#302019" /><circle cx="400" cy="230" r="250" fill="var(--gold)" opacity=".12" /><path d="M0 0h260v600H0ZM540 0h260v600H540Z" fill="var(--gold-soft)" opacity=".05" /></g>
        <g data-layer="midground" fill="none" stroke="currentColor" strokeLinecap="round"><path d="M120 0c45 110 35 250 0 420M680 0c-45 110-35 250 0 420" strokeWidth="3" opacity=".5" /><path d="M168 0c48 120 32 250 0 420M632 0c-48 120-32 250 0 420" strokeWidth="1.5" opacity=".35" /><path d="M232 440c105-48 230-48 336 0" strokeWidth="2" opacity=".5" /></g>
        <g data-layer="foreground"><path d="M180 350c82-24 160-24 220 0v125c-70 20-145 20-220 0ZM400 350c60-24 138-24 220 0v125c-75 20-150 20-220 0Z" fill="var(--surface)" opacity=".16" /><path d="M180 350c82 24 160 24 220 0M400 350c60 24 138 24 220 0" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M235 392h95M465 392h95M235 416h75M465 416h75" stroke="currentColor" strokeLinecap="round" strokeWidth="2" opacity=".7" /><path d="M389 340c-13-20-43-11-43 10 0 20 43 43 43 43s43-23 43-43c0-21-30-30-43-10Z" fill="var(--gold)" opacity=".42" /></g>
      </svg>
    );
  }

  if (sceneId === "horror") {
    return (
      <svg aria-hidden="true" viewBox="0 0 800 600" className={common} preserveAspectRatio="xMidYMid slice">
        <g data-layer="background"><rect width="800" height="600" fill="#0d0b0a" /><path d="M0 120h800M0 250h800M0 390h800" stroke="var(--gold-soft)" strokeWidth="1" opacity=".12" /><circle cx="405" cy="250" r="190" fill="#6e5b3c" opacity=".05" /></g>
        <g data-layer="midground" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M90 500h620M160 500V170h480v330" strokeWidth="3" opacity=".55" /><path d="M190 460h420M190 420h420M190 380h420M190 340h420" strokeWidth="2" opacity=".28" /><path d="M240 170v330M320 170v330M400 170v330M480 170v330M560 170v330" strokeWidth="1" opacity=".2" /></g>
        <g data-layer="foreground"><path d="M330 160h170v290H330Z" fill="#090807" stroke="currentColor" strokeWidth="3" opacity=".9" /><path d="M500 160v290l-42-33V194Z" fill="var(--gold)" opacity=".2" /><path d="M330 160h170" stroke="currentColor" strokeWidth="4" /><path d="M370 230h90M370 260h70M370 290h50" stroke="currentColor" strokeLinecap="round" strokeWidth="2" opacity=".25" /><path d="M520 450c65-50 105-52 150-48v98H520Z" fill="var(--gold-soft)" opacity=".08" /><path d="M548 442c9-8 17-8 26 0M584 426c9-8 17-8 26 0" stroke="currentColor" strokeWidth="2" opacity=".5" /></g>
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 800 600" className={common} preserveAspectRatio="xMidYMid slice">
      <g data-layer="background"><rect width="800" height="600" fill="#1b2728" /><path d="M0 220h800M0 420h800" stroke="#9eb5a1" strokeWidth="1" opacity=".16" /><circle cx="170" cy="130" r="120" fill="#b7c9ad" opacity=".08" /></g>
      <g data-layer="midground" fill="none" stroke="#b7c9ad" strokeLinecap="round"><rect x="115" y="90" width="570" height="300" rx="4" strokeWidth="3" opacity=".55" /><path d="M145 120h510M145 150h510M145 180h510M145 210h510M145 240h510M145 270h510M145 300h510M145 330h510" strokeWidth="1" opacity=".28" /><path d="M220 90v300M400 90v300M580 90v300" strokeWidth="2" opacity=".28" /></g>
      <g data-layer="foreground"><path d="M0 465c150-24 250-24 400 0s250 24 400 0v135H0Z" fill="#0e1718" opacity=".85" /><path d="M285 425h230v105H285Z" fill="var(--surface)" opacity=".16" /><path d="M310 457h165M310 480h130M310 503h150" stroke="#b7c9ad" strokeLinecap="round" strokeWidth="2" opacity=".7" /><path d="M100 150c-10 32-10 65 0 98M160 150c-10 32-10 65 0 98M640 150c-10 32-10 65 0 98" stroke="#d6e1d0" strokeWidth="2" opacity=".45" /></g>
    </svg>
  );
}
