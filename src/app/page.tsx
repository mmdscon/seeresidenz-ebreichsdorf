"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import Quiz from "@/components/quiz";
import { IMPRESSION_IMAGES } from "@/lib/images";

const PRIMARY = "#547587";
const TEXT = "#2D3134";
const TEXT_SECONDARY = "#6C757A";
const SECTION_BG = "#F4F1EB";
const DIVIDER = "#E7E6E2";

// Subtle decorative dot-pattern in the primary color — used sparingly (max. 2 sections)
// to add depth without a loud gradient. Fades out radially so it stays barely visible.
function AccentPattern({ corner = "top-right", size = 480 }: { corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right"; size?: number }) {
  const offset = -size * 0.22;
  const posStyle: React.CSSProperties =
    corner === "top-left" ? { top: offset, left: offset } :
    corner === "top-right" ? { top: offset, right: offset } :
    corner === "bottom-left" ? { bottom: offset, left: offset } :
    { bottom: offset, right: offset };
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: size,
        height: size,
        backgroundImage: `radial-gradient(circle, ${PRIMARY} 1.5px, transparent 1.6px)`,
        backgroundSize: "24px 24px",
        opacity: 0.12,
        WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 70%)",
        maskImage: "radial-gradient(circle, black 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
        ...posStyle,
      }}
    />
  );
}

function useSectionReveal() {
  React.useEffect(() => {
    const newEls = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .reveal-fade');
    const ioNew = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); ioNew.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );
    newEls.forEach((el) => ioNew.observe(el));

    const legacyEls = document.querySelectorAll('.section-reveal, .reveal');
    const ioLegacy = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); ioLegacy.unobserve(e.target); }
      }),
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );
    legacyEls.forEach((el) => ioLegacy.observe(el));

    return () => { ioNew.disconnect(); ioLegacy.disconnect(); };
  }, []);
}

function AnimatedNumber({ target, suffix = '', decimals = 0 }: { target: number; suffix?: string; decimals?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = React.useState((0).toFixed(decimals));
  const started = React.useRef(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1400; const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setDisplayed((ease * target).toFixed(decimals));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick); io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el); return () => io.disconnect();
  }, [target]);
  return <span ref={ref}>{displayed}{suffix}</span>;
}

function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 mt-[3px]">
      <path d="M5 12l4 4 10-10" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Polaroid: weißer Rahmen, unten dicker, leichte Schieflage ──
function Polaroid({ src, alt, rotate = 0, size = 280, aspect = "1/1", fill = false }: { src: string; alt: string; rotate?: number; size?: number; aspect?: string; fill?: boolean }) {
  if (fill) {
    return (
      <div
        className="bg-white flex flex-col h-full"
        style={{
          padding: "14px 14px 44px 14px",
          boxShadow: "0 14px 34px rgba(45,49,52,0.12)",
          transform: `rotate(${rotate}deg)`,
          aspectRatio: aspect,
          maxWidth: "100%",
        }}
      >
        <div className="relative w-full flex-1 overflow-hidden">
          <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 768px) 40vw, 80vw" />
        </div>
      </div>
    );
  }
  return (
    <div
      className="bg-white"
      style={{
        padding: "14px 14px 44px 14px",
        boxShadow: "0 14px 34px rgba(45,49,52,0.12)",
        transform: `rotate(${rotate}deg)`,
        width: size,
        maxWidth: "100%",
      }}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: aspect }}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 768px) 30vw, 60vw" />
      </div>
    </div>
  );
}

// ── Overlap Feature: Bild + weiße Text-Card, leicht überlappend ──
function OverlapFeature({ image, alt, media, children, imgSide = "right" }: { image?: string; alt?: string; media?: React.ReactNode; children: React.ReactNode; imgSide?: "left" | "right" }) {
  const renderMedia = () =>
    media ? media : <Image src={image!} alt={alt ?? ""} fill className="object-cover" sizes="72vw" />;
  const renderMediaMobile = () =>
    media ? media : <Image src={image!} alt={alt ?? ""} fill className="object-cover" sizes="100vw" />;
  return (
    <div className="relative w-full">
      {/* Desktop: Bild + überlappende Card */}
      <div className="hidden md:block relative w-full" style={{ aspectRatio: "21/9" }}>
        <div className={`absolute inset-y-0 ${imgSide === "right" ? "right-0" : "left-0"} overflow-hidden`} style={{ width: "72%" }}>
          {renderMedia()}
        </div>
        <div
          className={`absolute top-1/2 z-10 bg-white ${imgSide === "right" ? "left-0" : "right-0"}`}
          style={{ transform: "translateY(-50%)", width: "42%", minWidth: "300px", maxWidth: "460px", padding: "40px 36px", borderRadius: "20px", border: `1px solid ${DIVIDER}`, boxShadow: "0 24px 55px rgba(45,49,52,0.10)" }}
        >
          {children}
        </div>
      </div>
      {/* Mobile: Bild oben, weiße Card unten zentriert überlappend */}
      <div className="md:hidden">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
          {renderMediaMobile()}
        </div>
        <div
          className="relative z-10 bg-white mx-auto"
          style={{ width: "90%", marginTop: "-48px", padding: "28px 24px", borderRadius: "20px", border: `1px solid ${DIVIDER}`, boxShadow: "0 20px 45px rgba(45,49,52,0.12)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function QuizModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop"
      style={{ backgroundColor: 'rgba(45,49,52,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg bg-white shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
        style={{ border: `1px solid ${DIVIDER}`, borderRadius: "20px" }}>
        <Quiz onClose={onClose} />
      </div>
    </div>
  );
}
// ── Hero Marquee ──
function HeroMarquee() {
  const images = IMPRESSION_IMAGES;
  return (
    <section className="w-full" style={{ backgroundColor: SECTION_BG, borderBottom: `1px solid ${DIVIDER}` }}>
      <div className="mx-auto w-full max-w-6xl px-0" style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "120px", zIndex: 2, background: `linear-gradient(to right, ${SECTION_BG} 0%, transparent 100%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "120px", zIndex: 2, background: `linear-gradient(to left, ${SECTION_BG} 0%, transparent 100%)`, pointerEvents: "none" }} />
        <div style={{ display: "flex", gap: "12px", animation: "heroMarquee 32s linear infinite", width: "max-content", padding: "20px 0" }}>
          {[...images, ...images].map((src, i) => (
            <div key={i} style={{ width: "220px", height: "148px", flexShrink: 0, overflow: "hidden", borderRadius: "12px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes heroMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </section>
  );
}

// ── Impressionen Slideshow ──
const IMPRESSIONEN_GRID = [
  { src: "/hero.jpg", alt: "Lorem ipsum dolor sit amet", label: "Lorem Ipsum", ratio: 0.75 },
  { src: "/saison-1.jpg", alt: "Consectetur adipiscing elit", label: "Dolor Sit Amet", ratio: 1.6 },
  { src: "/sternenhimmel.jpg", alt: "Sed do eiusmod tempor", label: "Consectetur", ratio: 1.0 },
  { src: "/team-2.jpg", alt: "Incididunt ut labore", label: "Adipiscing Elit", ratio: 1.6 },
  { src: "/baufortschritt-nachher-1.jpg", alt: "Et dolore magna aliqua", label: "Sed Do Eiusmod", ratio: 0.75 },
  { src: "/saison-3.jpg", alt: "Ut enim ad minim veniam", label: "Tempor Incididunt", ratio: 1.0 },
];

function ImpressCard({ src, alt, label, aspect }: { src: string; alt: string; label: string; aspect?: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={aspect ? { aspectRatio: aspect, borderRadius: "12px" } : { borderRadius: "12px" }}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 768px) 33vw, 50vw" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(45,49,52,0.55) 0%, transparent 100%)" }} />
      <span className="absolute bottom-3 inset-x-0 px-2 text-center text-sm font-semibold text-white">{label}</span>
    </div>
  );
}

function JustifiedRow({ images, height }: { images: typeof IMPRESSIONEN_GRID; height: number }) {
  return (
    <div className="flex gap-3" style={{ height }}>
      {images.map((img, i) => (
        <div key={img.src} className={`reveal-up reveal-delay-${i + 1} h-full`} style={{ flex: `${img.ratio} 1 0%`, minWidth: 0 }}>
          <ImpressCard {...img} />
        </div>
      ))}
    </div>
  );
}

function ImpressSection({ openQuiz }: { openQuiz: () => void }) {
  const desktopRows = [IMPRESSIONEN_GRID.slice(0, 3), IMPRESSIONEN_GRID.slice(3, 6)];
  const mobileRows = [IMPRESSIONEN_GRID.slice(0, 2), IMPRESSIONEN_GRID.slice(2, 4), IMPRESSIONEN_GRID.slice(4, 6)];
  return (
    <section id="impressionen" className="reveal-right w-full scroll-mt-20 overflow-hidden" style={{ backgroundColor: SECTION_BG }}>
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="reveal-up flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl md:text-4xl" style={{ color: TEXT }}>Lorem Ipsum</h2>
          <p className="mt-2 text-sm normal-case" style={{ color: TEXT_SECONDARY }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
        </div>

        {/* Desktop / Tablet: justified Zeilen, feste Höhe, unterschiedliche Breiten je nach Bildformat */}
        <div className="hidden md:flex flex-col gap-3">
          {desktopRows.map((row, ri) => (
            <JustifiedRow key={ri} images={row} height={260} />
          ))}
        </div>

        {/* Mobile: gleiches Prinzip, 2 Bilder pro Zeile, unterschiedliche Breiten */}
        <div className="flex flex-col gap-3 md:hidden">
          {mobileRows.map((row, ri) => (
            <JustifiedRow key={ri} images={row} height={150} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button onClick={openQuiz}
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold transition-all duration-300 active:scale-[0.98]"
            style={{ background: PRIMARY, color: "white", border: `1px solid ${PRIMARY}`, borderRadius: "12px" }}>
            Lorem Ipsum Dolor
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Vorher/Nachher Slider (draggable divider) ──
function BeforeAfterSlider({ before, after, beforeAlt, afterAlt }: { before: string; after: string; beforeAlt: string; afterAlt: string }) {
  const [pos, setPos] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const draggingRef = React.useRef(false);

  const updateFromClientX = React.useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  React.useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      const clientX = "touches" in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      if (typeof clientX === "number") updateFromClientX(clientX);
    };
    const onUp = () => { draggingRef.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [updateFromClientX]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none"
      style={{ aspectRatio: "4/3", cursor: "ew-resize", touchAction: "none" }}
      onMouseDown={(e) => { draggingRef.current = true; updateFromClientX(e.clientX); }}
      onTouchStart={(e) => { draggingRef.current = true; updateFromClientX(e.touches[0].clientX); }}
    >
      <Image src={after} alt={afterAlt} fill className="object-cover pointer-events-none" sizes="(min-width: 1024px) 50vw, 100vw" />
      <div className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={beforeAlt} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${pos}%`, width: "2px", background: "white", transform: "translateX(-1px)" }} />
      <div
        className="absolute top-1/2 flex items-center justify-center pointer-events-none"
        style={{ left: `${pos}%`, transform: "translate(-50%, -50%)", width: "42px", height: "42px", background: "white", borderRadius: "50%", boxShadow: "0 2px 10px rgba(45,49,52,0.25)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" stroke={TEXT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 pointer-events-none" style={{ background: "rgba(45,49,52,0.55)", color: "white", borderRadius: "6px" }}>Vorher</span>
      <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 pointer-events-none" style={{ background: "rgba(45,49,52,0.55)", color: "white", borderRadius: "6px" }}>Nachher</span>
    </div>
  );
}

const BAUFORTSCHRITT_VERGLEICH = [
  { title: "Lorem Ipsum", before: "/baufortschritt-vorher-1.jpg", after: "/baufortschritt-nachher-1.jpg" },
  { title: "Dolor Sit Amet", before: "/baufortschritt-vorher-2.jpg", after: "/baufortschritt-nachher-2.jpg" },
  { title: "Consectetur Elit", before: "/baufortschritt-vorher-3.jpg", after: "/baufortschritt-nachher-3.jpg" },
];

function BaufortschrittGrid() {
  return (
    <section className="w-full" style={{ backgroundColor: "#FBFAF7" }}>
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="reveal-up text-center mb-10">
          <h2 className="text-3xl md:text-4xl" style={{ color: TEXT }}>
            Lorem Ipsum Dolor Sit
          </h2>
          <p className="mt-3 text-sm normal-case" style={{ color: TEXT_SECONDARY }}>Ziehen Sie den Regler, um lorem ipsum dolor sit amet zu vergleichen.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BAUFORTSCHRITT_VERGLEICH.map((item, i) => (
            <div key={item.title} className={`reveal-up reveal-delay-${i + 1}`}>
              <div style={{ border: `1px solid ${DIVIDER}`, borderRadius: "20px", overflow: "hidden" }}>
                <BeforeAfterSlider
                  before={item.before}
                  after={item.after}
                  beforeAlt={`Vorher – ${item.title}`}
                  afterAlt={`Nachher – ${item.title}`}
                />
              </div>
              <p className="mt-4 text-center font-semibold text-base" style={{ color: TEXT }}>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Route ──
const STATIONS = [
  { city: "Lorem Ipsum", detail: "Standort der Seeresidenz", dist: "direkt vor Ort", pos: 8 },
  { city: "Dolor Sit Amet", detail: "Lorem ipsum dolor sit", dist: "ca. 10 min", pos: 28 },
  { city: "Consectetur", detail: "Adipiscing elit sed do", dist: "ca. 15 min", pos: 48 },
  { city: "Eiusmod Tempor", detail: "Incididunt ut labore", dist: "ca. 15 min", pos: 70 },
  { city: "Magna Aliqua", detail: "Ausflugsziel in der Region", dist: "ca. 15 min", pos: 90 },
];

function RouteSection() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);
  const rafRef = React.useRef<number | null>(null);
  const targetProgressRef = React.useRef(0);
  const currentProgressRef = React.useRef(0);

  React.useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const computeTarget = () => {
      const el = sectionRef.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const sectionCenter = rect.top + rect.height / 2;
      const p = (windowH - sectionCenter) / windowH;
      targetProgressRef.current = Math.min(1, Math.max(0, p));
    };
    const animate = () => {
      const next = lerp(currentProgressRef.current, targetProgressRef.current, 0.08);
      currentProgressRef.current = next;
      setProgress(next);
      rafRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener('scroll', computeTarget, { passive: true });
    computeTarget();
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('scroll', computeTarget);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const firstPos = STATIONS[0].pos;
  const lastPos = STATIONS[STATIONS.length - 1].pos;
  const carY = firstPos + progress * (lastPos - firstPos);

  const StationCard = ({ s }: { s: typeof STATIONS[0] }) => (
    <div style={{ padding: "10px 16px", backgroundColor: "white", border: `1px solid ${DIVIDER}`, borderRadius: "12px", boxShadow: "0 2px 12px rgba(84,117,135,0.10)" }}>
      <p className="font-semibold text-sm" style={{ color: TEXT }}>{s.city}</p>
      <p className="text-xs normal-case" style={{ color: TEXT_SECONDARY }}>{s.detail}</p>
      <p className="text-xs font-semibold mt-0.5" style={{ color: PRIMARY }}>{s.dist}</p>
    </div>
  );

  return (
    <section ref={sectionRef} className="w-full py-16" style={{ backgroundColor: SECTION_BG }}>
      <div className="reveal-left mx-auto w-full max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl" style={{ color: TEXT }}>Lorem Ipsum Dolor Sit Amet</h2>
        </div>
        {/* Mobile */}
        <div className="md:hidden relative flex gap-0" style={{ minHeight: "600px" }}>
          <div className="relative flex-shrink-0" style={{ width: "40px" }}>
            <div className="absolute inset-0 flex justify-center">
              <div style={{ width: "2px", height: "100%", backgroundImage: `repeating-linear-gradient(to bottom, rgba(84,117,135,0.30) 0px, rgba(84,117,135,0.30) 8px, transparent 8px, transparent 16px)` }} />
            </div>
            <div className="absolute top-0 left-1/2" style={{ width: "2px", height: `${carY}%`, background: PRIMARY, transform: "translateX(-50%)" }} />
            <div className="absolute z-20" style={{ top: `${carY}%`, left: "50%", transform: "translate(-50%, -50%)" }}>
              <Image src="/car-icon.png" alt="Auto" width={255} height={507} className="object-contain" style={{ width: "clamp(190px, 52vw, 260px)", height: "auto" }} />
            </div>
            {STATIONS.map((s) => {
              const visible = progress * 100 >= s.pos - 4;
              return (
                <div key={s.city} className="absolute left-1/2" style={{ top: `${s.pos}%`, transform: "translate(-50%, -50%)", zIndex: 5 }}>
                  <div style={{ width: "10px", height: "10px", backgroundColor: visible ? PRIMARY : "rgba(84,117,135,0.25)", borderRadius: "50%", border: "2px solid white", boxShadow: visible ? `0 0 0 3px rgba(84,117,135,0.22)` : "none", transition: "all 0.4s ease" }} />
                </div>
              );
            })}
          </div>
          <div className="relative flex-1">
            {STATIONS.map((s) => {
              const visible = progress * 100 >= s.pos - 4;
              return (
                <div key={s.city} className="absolute w-full" style={{ top: `${s.pos}%`, transform: "translateY(-50%)", paddingLeft: "12px", opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                  <StationCard s={s} />
                </div>
              );
            })}
          </div>
        </div>
        {/* Desktop */}
        <div className="hidden md:block relative" style={{ minHeight: "680px" }}>
          <div className="absolute top-0 bottom-0" style={{ left: "50%", transform: "translateX(-50%)", width: "2px" }}>
            <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(to bottom, rgba(84,117,135,0.30) 0px, rgba(84,117,135,0.30) 8px, transparent 8px, transparent 16px)` }} />
            <div className="absolute top-0 left-0 right-0" style={{ height: `${carY}%`, background: PRIMARY }} />
          </div>
          <div className="absolute z-20" style={{ top: `${carY}%`, left: "50%", transform: "translate(-50%, -50%)" }}>
            <Image src="/car-icon.png" alt="Auto" width={205} height={407} className="object-contain" style={{ width: "clamp(55px, 4.5vw, 85px)", height: "auto" }} />
          </div>
          {STATIONS.map((s, i) => {
            const visible = progress * 100 >= s.pos - 4;
            const isRight = i % 2 === 1;
            return (
              <div key={s.city} className="absolute" style={{ top: `${s.pos}%`, left: "50%", opacity: visible ? 1 : 0, transform: "translateY(-50%)", transition: 'opacity 0.5s ease', pointerEvents: 'none' }}>
                <div style={{ position: "absolute", top: "50%", left: "0", transform: "translate(-50%, -50%)", width: "12px", height: "12px", backgroundColor: visible ? PRIMARY : "rgba(84,117,135,0.25)", borderRadius: "50%", border: "2px solid white", boxShadow: visible ? `0 0 0 3px rgba(84,117,135,0.22)` : "none", transition: "all 0.4s ease", zIndex: 10 }} />
                <div className="absolute pointer-events-none" style={{ top: "50%", transform: "translateY(-50%)", whiteSpace: "nowrap", ...(isRight ? { left: "120px", right: "auto", textAlign: "left" } : { right: "120px", left: "auto", textAlign: "right" }) }}>
                  <div style={{ padding: "12px 20px", backgroundColor: "white", border: `1px solid ${DIVIDER}`, borderRadius: "12px", boxShadow: "0 2px 12px rgba(84,117,135,0.10)", minWidth: "180px" }}>
                    <p className="font-semibold text-base" style={{ color: TEXT }}>{s.city}</p>
                    <p className="text-sm normal-case" style={{ color: TEXT_SECONDARY }}>{s.detail}</p>
                    <p className="text-sm font-semibold mt-1" style={{ color: PRIMARY }}>{s.dist}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
// ── Parallax Section ──
function ParallaxSection({ openQuiz }: { openQuiz: () => void }) {
  return (
    <section className="w-full bg-center bg-cover bg-scroll md:bg-fixed" style={{ backgroundImage: "url(/paralax.jpg)" }}>
      <div className="relative">
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(251,250,247,0.20) 0%, rgba(251,250,247,0.55) 100%)" }} />
        <div className="reveal-left relative mx-auto w-full max-w-6xl px-6 py-20 md:py-28 flex justify-center">
          <div
            className="text-center"
            style={{
              maxWidth: "700px",
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: `1px solid ${DIVIDER}`,
              borderRadius: "20px",
              padding: "40px 36px",
            }}
          >
            <h2 className="text-3xl md:text-5xl leading-tight" style={{ color: TEXT }}>
              Lorem Ipsum Dolor
            </h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed normal-case" style={{ color: TEXT_SECONDARY }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="mt-7 flex justify-center">
              <button onClick={openQuiz}
                className="inline-flex items-center justify-center h-12 px-8 text-sm font-semibold transition-all duration-300 active:scale-[0.98]"
                style={{ background: PRIMARY, color: "white", border: `1px solid ${PRIMARY}`, borderRadius: "12px" }}
              >Lorem Ipsum</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Personal / Final CTA Section ──
function PersonalCTASection({ openQuiz }: { openQuiz: () => void }) {
  return (
    <section className="section-reveal w-full" style={{ backgroundColor: "#FBFAF7" }}>
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <OverlapFeature image="/final-cta.jpg" alt="Lorem ipsum dolor sit amet" imgSide="right">
          <h2 className="text-2xl md:text-3xl leading-tight mb-5" style={{ color: TEXT }}>
            Lorem Ipsum Dolor Sit Amet
          </h2>
          <p className="text-sm leading-relaxed mb-4 normal-case" style={{ color: TEXT_SECONDARY }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.
          </p>
          <p className="text-sm leading-relaxed mb-5 normal-case" style={{ color: TEXT_SECONDARY }}>
            Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat, duis aute irure dolor in reprehenderit.
          </p>
          <div className="mb-5">
            <p className="text-sm font-semibold" style={{ color: TEXT }}>Seeresidenz</p>
            <p className="text-xs normal-case" style={{ color: TEXT_SECONDARY }}>Musterstraße 1, 10115 Berlin · +49 30 000 000</p>
          </div>
          <Button onClick={openQuiz}>Lorem Ipsum</Button>
        </OverlapFeature>
      </div>
    </section>
  );
}

// ── Timeline / Meilensteine Section ──
function TimelineSection() {
  return (
    <section className="reveal-right w-full" style={{ backgroundColor: PRIMARY }}>
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { date: "Lorem Ipsum", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.", delay: 1 },
            { date: "Dolor Sit Amet", text: "Ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud exercitation.", delay: 2 },
          ].map((item) => (
            <div key={item.date} className={`reveal-up reveal-delay-${(item as any).delay}`} style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: "20px", padding: "32px" }}>
              <p className="text-2xl md:text-3xl font-semibold mb-3 text-white normal-case">{item.date}</p>
              <p className="text-base leading-relaxed normal-case" style={{ color: "rgba(255,255,255,0.85)" }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Video Section: branded custom player ──
function VideoSection({ openQuiz }: { openQuiz: () => void }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [engaged, setEngaged] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [current, setCurrent] = React.useState(0);
  const [ended, setEnded] = React.useState(false);

  // Start the silent teaser loop as soon as possible.
  React.useEffect(() => {
    const v = videoRef.current;
    if (v) { v.muted = true; v.play().catch(() => {}); }
  }, []);

  const engage = () => {
    const v = videoRef.current; if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    setMuted(false);
    setEngaged(true);
    setEnded(false);
    v.play();
    setPlaying(true);
  };

  const togglePlay = () => {
    const v = videoRef.current; if (!v) return;
    if (!engaged) { engage(); return; }
    if (ended) { engage(); return; }
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current; if (!v) return;
    v.muted = !v.muted; setMuted(v.muted);
  };

  const onTimeUpdate = () => {
    const v = videoRef.current; if (!v) return;
    setCurrent(v.currentTime);
    if (v.duration) setProgress((v.currentTime / v.duration) * 100);
  };

  const onEnded = () => {
    if (!engaged) return; // teaser loop uses native loop, shouldn't fire
    setPlaying(false);
    setEnded(true);
  };

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current; if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
    if (ended) setEnded(false);
  };

  const fmt = (t: number) => {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <section className="section-reveal w-full" style={{ backgroundColor: "#FBFAF7" }}>
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div
          className="reveal-left relative w-full md:w-[75%] mx-auto overflow-hidden group"
          style={{ border: `1px solid ${DIVIDER}`, borderRadius: "20px", backgroundColor: "black", aspectRatio: "16/9" }}
        >
          <video
            ref={videoRef}
            src="/project-video.mp4"
            muted={muted}
            autoPlay
            loop={!engaged}
            playsInline
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={onEnded}
            onClick={togglePlay}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            style={{ filter: ended ? "blur(14px)" : "none", transform: ended ? "scale(1.06)" : "none", transition: "filter 0.4s ease" }}
          />

          {/* Enticing play button — shown until the visitor engages with sound */}
          {!engaged && !ended && (
            <button
              type="button"
              onClick={engage}
              aria-label="Video mit Ton starten"
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
              style={{ background: "rgba(45,49,52,0.20)" }}
            >
              <span
                className="flex items-center justify-center transition-transform duration-200 active:scale-95"
                style={{ width: "76px", height: "76px", background: PRIMARY, border: `1px solid ${PRIMARY}`, borderRadius: "50%" }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </button>
          )}

          {/* Paused (after engaging) — show a plain play button, no dark overlay teaser text */}
          {engaged && !playing && !ended && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Video fortsetzen"
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
              style={{ background: "rgba(45,49,52,0.20)" }}
            >
              <span
                className="flex items-center justify-center transition-transform duration-200 active:scale-95"
                style={{ width: "76px", height: "76px", background: PRIMARY, border: `1px solid ${PRIMARY}`, borderRadius: "50%" }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </button>
          )}

          {/* End-of-video CTA overlay */}
          {ended && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              style={{ background: "rgba(45,49,52,0.45)" }}
            >
              <button
                type="button"
                onClick={openQuiz}
                className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 text-sm md:text-base font-semibold transition-all duration-200 active:scale-[0.98]"
                style={{ background: PRIMARY, color: "white", border: `1px solid ${PRIMARY}`, borderRadius: "12px" }}
              >
                Lorem Ipsum
              </button>
              <button
                type="button"
                onClick={engage}
                className="text-xs font-medium tracking-wide underline underline-offset-2 transition-opacity hover:opacity-80"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Video erneut ansehen
              </button>
            </div>
          )}

          {/* Branded control bar — only once engaged */}
          {engaged && (
            <div
              className="absolute inset-x-0 bottom-0 flex items-center gap-4 px-4 py-3 md:px-5 md:py-4"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)", opacity: ended ? 0 : 1, transition: "opacity 0.2s ease" }}
            >
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Abspielen"}
                className="flex items-center justify-center shrink-0 transition-opacity active:scale-95"
                style={{ width: "36px", height: "36px", background: PRIMARY, borderRadius: "8px" }}
              >
                {playing ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>

              <div
                onClick={onSeek}
                className="relative flex-1 cursor-pointer"
                style={{ height: "6px", background: "rgba(255,255,255,0.25)", borderRadius: "4px" }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${progress}%`, background: PRIMARY, borderRadius: "4px", transition: "width 0.1s linear" }} />
              </div>

              <span className="hidden sm:inline text-xs font-bold tabular-nums shrink-0" style={{ color: "white", letterSpacing: "0.02em" }}>
                {fmt(current)} / {fmt(duration)}
              </span>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Ton einschalten" : "Ton ausschalten"}
                className="flex items-center justify-center shrink-0 transition-opacity active:scale-95"
                style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "8px" }}
              >
                {muted ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5 6 9H2v6h4l5 4V5z" fill="white" stroke="none" />
                    <path d="M23 9l-6 6M17 9l6 6" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5 6 9H2v6h4l5 4V5z" fill="white" stroke="none" />
                    <path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
// ── Über uns: 16:9 Foto mit seitlichem Fade und Trust-Text ──
function AboutSection() {
  return (
    <section className="w-full" style={{ backgroundColor: TEXT }}>
      <div className="relative w-full overflow-hidden aspect-[4/5] md:aspect-[16/9]">
        <Image
          src="/team-1.jpg"
          alt="Lorem ipsum dolor sit amet"
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Mobile: fade from bottom */}
        <div
          className="absolute inset-0 md:hidden"
          style={{ background: "linear-gradient(to top, rgba(45,49,52,0.92) 0%, rgba(45,49,52,0.55) 38%, rgba(45,49,52,0.05) 70%, transparent 100%)" }}
        />
        {/* Desktop: fade from left */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{ background: "linear-gradient(to right, rgba(45,49,52,0.90) 0%, rgba(45,49,52,0.65) 32%, rgba(45,49,52,0.10) 58%, transparent 75%)" }}
        />

        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="mx-auto w-full max-w-6xl px-6 pb-8 md:pb-0">
            <div className="reveal-left" style={{ maxWidth: "480px" }}>
              <h2 className="text-2xl md:text-4xl leading-tight mb-4 text-white">
                Lorem Ipsum Dolor Sit
              </h2>
              <p className="text-sm md:text-base leading-relaxed mb-4 normal-case" style={{ color: "rgba(255,255,255,0.85)" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.
              </p>
              <p className="hidden md:block text-base leading-relaxed mb-6 normal-case" style={{ color: "rgba(255,255,255,0.75)" }}>
                Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat — duis aute irure dolor in reprehenderit in voluptate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Polaroid-Collage: überlappende Schnappschüsse aus dem Marquee ──
const POLAROID_COLLAGE = [
  { src: "/hero.jpg", alt: "Lorem ipsum dolor sit amet", rotate: -6, y: 6 },
  { src: "/saison-1.jpg", alt: "Consectetur adipiscing elit", rotate: 4, y: 18 },
  { src: "/baufortschritt-nachher-1.jpg", alt: "Sed do eiusmod tempor", rotate: -4, y: -6 },
  { src: "/sternenhimmel.jpg", alt: "Incididunt ut labore", rotate: 5, y: 14 },
  { src: "/saison-3.jpg", alt: "Et dolore magna aliqua", rotate: -5, y: 0 },
  { src: "/team-1.jpg", alt: "Ut enim ad minim veniam", rotate: 3, y: -12 },
];

function PolaroidCollageSection({ openQuiz }: { openQuiz: () => void }) {
  return (
    <section className="w-full overflow-hidden" style={{ backgroundColor: SECTION_BG }}>
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="reveal-left text-center mb-10">
          <h2 className="text-3xl md:text-4xl" style={{ color: TEXT }}>Lorem Ipsum</h2>
          <p className="mt-2 text-sm normal-case" style={{ color: TEXT_SECONDARY }}>Dolor sit amet, consectetur adipiscing elit sed do eiusmod.</p>
          <button onClick={openQuiz}
            className="mt-5 inline-flex items-center justify-center h-11 px-6 text-sm font-semibold transition-all duration-300 active:scale-[0.98]"
            style={{ background: PRIMARY, color: "white", border: `1px solid ${PRIMARY}`, borderRadius: "12px" }}>
            Lorem Ipsum Dolor
          </button>
        </div>
        {/* Mobile: 2 Zeilen à 3, überlappend, größer */}
        <div className="flex flex-col items-center md:hidden">
          {[POLAROID_COLLAGE.slice(0, 3), POLAROID_COLLAGE.slice(3, 6)].map((row, ri) => (
            <div key={ri} className="flex items-center justify-center" style={{ marginTop: ri === 0 ? 0 : "-36px" }}>
              {row.map((p, i) => (
                <div
                  key={p.src}
                  className={i === 0 ? "shrink-0" : "shrink-0 -ml-7"}
                  style={{ transform: `translateY(${p.y * 0.5}px)`, zIndex: ri * 10 + i }}
                >
                  <Polaroid src={p.src} alt={p.alt} rotate={p.rotate} size={125} aspect="4/5" />
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* Desktop: eine Zeile */}
        <div className="hidden md:flex items-center justify-center">
          {POLAROID_COLLAGE.map((p, i) => (
            <div
              key={p.src}
              className={i === 0 ? "shrink-0" : "shrink-0 -ml-10"}
              style={{ transform: `translateY(${p.y}px)`, zIndex: i }}
            >
              <Polaroid src={p.src} alt={p.alt} rotate={p.rotate} size={170} aspect="4/5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  const [quizOpen, setQuizOpen] = React.useState(false);
  const openQuiz = React.useCallback(() => setQuizOpen(true), []);

  React.useEffect(() => {
    const handler = () => setQuizOpen(true);
    window.addEventListener('open-quiz', handler);
    return () => window.removeEventListener('open-quiz', handler);
  }, []);

  useSectionReveal();

  return (
    <main>
      <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
      <Header onQuizOpen={openQuiz} />

      {/* HERO */}
      <section className="w-full">
        {/* Mobile layout */}
        <div className="md:hidden">
          <div className="relative w-full aspect-video overflow-hidden" style={{ backgroundColor: SECTION_BG }}>
            <Image src="/hero-desktop.jpg" alt="Seeresidenz" fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: "90px", background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)" }} />
          </div>
          <div className="relative w-full px-5 py-8" style={{ backgroundColor: "#FBFAF7" }}>
            <div className="reveal-left">
              <h1 className="leading-tight" style={{ fontSize: "clamp(2rem, 8vw, 2.6rem)" }}>
                <span className="block" style={{ color: TEXT }}>Lorem Ipsum Dolor Sit Amet.</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed normal-case" style={{ color: TEXT_SECONDARY }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit — sed do eiusmod tempor incididunt ut labore et dolore magna.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {["Lorem Ipsum", "Dolor Sit Amet", "Ab XXX.000 €"].map((pill) => (
                  <span key={pill} style={{ display: "inline-flex", alignItems: "center", padding: "6px 14px", background: SECTION_BG, border: `1px solid ${DIVIDER}`, color: TEXT, fontSize: "12px", fontWeight: 700, borderRadius: "8px" }}>{pill}</span>
                ))}
              </div>
              <div className="mt-6">
                <Button onClick={openQuiz} size="lg">Lorem Ipsum</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block relative w-full md:aspect-[16/10] lg:aspect-[16/8] overflow-hidden" style={{ backgroundColor: SECTION_BG }}>
          <Image src="/hero-desktop.jpg" alt="Seeresidenz" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: "160px", background: "linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: "55%", background: "linear-gradient(180deg, transparent 0%, rgba(251,250,247,0.15) 40%, rgba(251,250,247,0.72) 100%)" }} />

          <div className="absolute inset-x-0 bottom-0 z-10 pb-10 lg:pb-14">
            <div className="mx-auto w-full max-w-6xl px-6 flex items-end justify-between gap-10">
              <div className="reveal-left flex-1 min-w-0">
                <div className="flex flex-wrap gap-2.5 mb-4">
                  {["Lorem Ipsum", "Dolor Sit Amet", "Ab XXX.000 €"].map((pill) => (
                    <span key={pill} style={{ display: "inline-flex", alignItems: "center", padding: "6px 14px", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", border: `1px solid ${DIVIDER}`, color: TEXT, fontSize: "12px", fontWeight: 700, borderRadius: "8px" }}>{pill}</span>
                  ))}
                </div>
                <h1 className="text-left leading-tight" style={{ fontSize: "clamp(2.2rem, 5vw, 4.6rem)" }}>
                  <span className="block" style={{ color: TEXT }}>Lorem Ipsum Dolor Sit Amet.</span>
                </h1>
              </div>
              <div className="reveal-right text-right flex flex-col items-end gap-5 shrink-0" style={{ maxWidth: "320px" }}>
                <p className="text-sm md:text-base leading-relaxed normal-case" style={{ color: TEXT_SECONDARY }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit — sed do eiusmod tempor incididunt ut labore et dolore magna.
                </p>
                <Button onClick={openQuiz} size="lg">Lorem Ipsum</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <VideoSection openQuiz={openQuiz} />

      {/* HERO MARQUEE */}
      <HeroMarquee />

      {/* TRUST BAND */}
      <section id="vorteile" className="w-full scroll-mt-20" style={{ backgroundColor: SECTION_BG, borderBottom: `1px solid ${DIVIDER}` }}>
        <div className="reveal-right mx-auto w-full max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Lorem Ipsum Dolor", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit — sed do eiusmod tempor incididunt." },
              { title: "Consectetur Adipiscing", text: "Ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud exercitation." },
              { title: "Sed Do Eiusmod", text: "Ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor." },
              { title: "Incididunt Ut Labore", text: "In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
            ].map((item, idx) => (
              <div key={idx} className={`reveal-up reveal-delay-${idx + 1} flex flex-col gap-2`}>
                <div className="flex items-start gap-3">
                  <IconCheck />
                  <p className="font-semibold text-sm leading-snug normal-case" style={{ color: TEXT }}>{item.title}</p>
                </div>
                <p className="text-xs leading-relaxed pl-7 normal-case" style={{ color: TEXT_SECONDARY }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start md:items-center md:justify-center reveal-up reveal-delay-4">
            <Button onClick={openQuiz}>Lorem Ipsum</Button>
          </div>
        </div>
      </section>

      {/* OBJEKT DETAIL */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-12">
          {[
            {
              src: "/saison-1.jpg",
              alt: "Lorem ipsum dolor sit amet",
              title: "Lorem Ipsum Dolor Sit",
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit — sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              reverse: false,
            },
            {
              src: "/saison-2.jpg",
              alt: "Consectetur adipiscing elit",
              title: "Ut Enim Ad Minim",
              text: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat — duis aute irure dolor in reprehenderit.",
              reverse: true,
            },
            {
              src: "/saison-3.jpg",
              alt: "Sed do eiusmod tempor",
              title: "Voluptate Velit Esse",
              text: "Cillum dolore eu fugiat nulla pariatur, excepteur sint occaecat cupidatat non proident sunt in culpa qui officia.",
              reverse: false,
            },
          ].map((card, i) => (
            <div key={card.title} className={`${i % 2 === 0 ? "reveal-left" : "reveal-right"} grid grid-cols-1 md:grid-cols-2 items-stretch`} style={{ border: `1px solid ${DIVIDER}`, borderRadius: "20px", overflow: "hidden" }}>
              <div className={`relative w-full overflow-hidden ${card.reverse ? "md:order-2" : ""}`} style={{ aspectRatio: "21/9" }}>
                <Image src={card.src} alt={card.alt} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
              </div>
              <div className={`flex flex-col justify-center p-6 md:p-10 ${card.reverse ? "md:order-1" : ""}`}>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 normal-case" style={{ color: TEXT }}>{card.title}</h3>
                <p className="text-base leading-relaxed normal-case" style={{ color: TEXT_SECONDARY }}>{card.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-start">
          <Button onClick={openQuiz}>Lorem Ipsum Dolor</Button>
        </div>
      </section>

      <section className="w-full relative overflow-hidden" style={{ backgroundColor: SECTION_BG }}>
        <AccentPattern corner="top-right" size={460} />
        <div className="reveal-left relative z-10 mx-auto w-full max-w-6xl px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ border: `1px solid ${DIVIDER}`, borderRadius: "20px", overflow: "hidden" }}>
            {[
              { number: 500, unit: " m²", label: "Lorem Ipsum" },
              { number: 104, unit: " m²", label: "Dolor Sit Amet" },
              { label: "2 Einheiten", isText: true },
              { number: 499, unit: "T€", label: "Consectetur" },
            ].map((stat, i) => (
              <div key={i}
                className={`reveal-up reveal-delay-${i + 1} flex flex-col items-center justify-center py-10 px-4 text-center`}
                style={{ backgroundColor: "white", borderRight: i < 3 ? `1px solid ${DIVIDER}` : "none" }}>
                {(stat as any).isText ? (
                  <>
                    <p className="text-4xl md:text-5xl font-semibold leading-none" style={{ color: PRIMARY }}>2</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-widest" style={{ color: TEXT_SECONDARY }}>Lorem Ipsum</p>
                  </>
                ) : (
                  <>
                    <p className="text-4xl md:text-5xl font-semibold leading-none" style={{ color: PRIMARY }}>
                      <AnimatedNumber target={(stat as any).number} decimals={(stat as any).decimals ?? 0} />{(stat as any).unit}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-widest" style={{ color: TEXT_SECONDARY }}>{stat.label}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPRESSIONEN SLIDESHOW */}
      <ImpressSection openQuiz={openQuiz} />

      {/* PARALLAX */}
      <ParallaxSection openQuiz={openQuiz} />

      {/* BAUFORTSCHRITT VORHER/NACHHER */}
      <BaufortschrittGrid />

      {/* ROUTE */}
      <RouteSection />

      {/* LAGE */}
      <section id="lage" className="mx-auto w-full max-w-6xl px-6 py-16 scroll-mt-20">
        <OverlapFeature
          imgSide="right"
          media={
            <iframe
              title="Karte Lorem Ipsum"
              className="w-full h-full"
              style={{ display: "block", border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Berlin,+Germany&t=k&z=12&output=embed"
            />
          }
        >
          <h2 className="text-2xl md:text-3xl leading-tight mb-5" style={{ color: TEXT }}>
            Lorem Ipsum Dolor.
          </h2>
          <p className="text-sm leading-relaxed mb-4 normal-case" style={{ color: TEXT_SECONDARY }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p className="text-sm leading-relaxed mb-5 normal-case" style={{ color: TEXT_SECONDARY }}>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <Button onClick={openQuiz}>Lorem Ipsum Dolor</Button>
        </OverlapFeature>
      </section>

      {/* PROJEKTDATEN */}
      <section id="projektdaten" className="w-full scroll-mt-20" style={{ backgroundColor: SECTION_BG }}>
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <OverlapFeature image="/saison-2.jpg" alt="Lorem ipsum dolor sit amet" imgSide="left">
            <h2 className="text-2xl md:text-3xl leading-tight mb-5" style={{ color: TEXT }}>
              Lorem Ipsum Dolor Sit.
            </h2>
            <p className="text-sm leading-relaxed mb-6 normal-case" style={{ color: TEXT_SECONDARY }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <Button onClick={openQuiz}>Lorem Ipsum Dolor</Button>
          </OverlapFeature>
        </div>
      </section>

      {/* TIMELINE / MEILENSTEINE */}
      <TimelineSection />

      {/* ÜBER UNS */}
      <AboutSection />

      {/* PERSONAL / FINAL CTA */}
      <PersonalCTASection openQuiz={openQuiz} />

      {/* POLAROID COLLAGE */}
      <PolaroidCollageSection openQuiz={openQuiz} />
    </main>
  );
}
