"use client";

import { useEffect, useRef, useState } from "react";

type CursorTone = "light" | "dark";
type CursorMode = "default" | "scroll" | "open";

const INTERACTIVE_SELECTOR =
  'a[href], button, [role="button"], summary, label[for], input, textarea, select';

function canUseCustomCursor() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(pointer: coarse)").matches
  );
}

function readTone(el: Element | null): CursorTone {
  const toneEl = el?.closest("[data-cursor-tone]");
  const tone = toneEl?.getAttribute("data-cursor-tone");
  return tone === "dark" ? "dark" : "light";
}

function readMode(el: Element | null): CursorMode {
  if (!el) return "default";
  if (el.closest('[data-cursor="scroll"]')) return "scroll";
  if (el.closest(INTERACTIVE_SELECTOR)) return "open";
  return "default";
}

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [tone, setTone] = useState<CursorTone>("light");
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);

  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const pending = useRef(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    const updateEnabled = () => setEnabled(canUseCustomCursor());
    updateEnabled();

    const fine = window.matchMedia("(pointer: fine)");
    const coarse = window.matchMedia("(pointer: coarse)");
    fine.addEventListener("change", updateEnabled);
    coarse.addEventListener("change", updateEnabled);
    return () => {
      fine.removeEventListener("change", updateEnabled);
      coarse.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (!enabled) {
      html.removeAttribute("data-custom-cursor");
      return;
    }
    html.setAttribute("data-custom-cursor", "on");
    return () => html.removeAttribute("data-custom-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const flush = () => {
      pending.current = false;
      const el = rootRef.current;
      if (!el) return;
      const { x, y } = pos.current;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMove = (e: PointerEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      if (!pending.current) {
        pending.current = true;
        raf.current = requestAnimationFrame(flush);
      }

      const follower = rootRef.current;
      if (follower) follower.style.visibility = "hidden";
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      if (follower) follower.style.visibility = "";

      const nextTone = readTone(hit);
      const nextMode = readMode(hit);
      setTone((t) => (t === nextTone ? t : nextTone));
      setMode((m) => (m === nextMode ? m : nextMode));
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    const onEnter = () => {
      visibleRef.current = true;
      setVisible(true);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  const isCircle = mode !== "default";
  const nibSrc =
    tone === "dark" ? "/images/cursor-light.png" : "/images/cursor-dark.png";
  const label = mode === "scroll" ? "scroll" : "open";

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[100] will-change-transform ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ transition: "opacity 120ms ease" }}
    >
      {/* Tip at follower origin: image tip is bottom-center before rotate(135deg) */}
      <div
        className={`absolute left-0 top-0 transition-opacity duration-200 ${
          isCircle ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={nibSrc}
          alt=""
          width={28}
          height={28}
          draggable={false}
          className="block h-7 w-7 object-contain"
          style={{
            marginLeft: -14,
            marginTop: -28,
            transform: "rotate(135deg)",
            transformOrigin: "50% 100%",
          }}
        />
      </div>

      <div
        className={`absolute left-0 top-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-[opacity,transform,background-color,border-color,color] duration-200 ${
          isCircle ? "scale-100 opacity-100" : "scale-75 opacity-0"
        } ${
          tone === "dark"
            ? "border-gold/70 bg-paper text-espresso"
            : "border-gold/50 bg-espresso text-paper"
        }`}
      >
        <span className="font-eyebrow text-[10px] uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
    </div>
  );
}
