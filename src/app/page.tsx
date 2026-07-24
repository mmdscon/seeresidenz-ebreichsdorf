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

// Small right-pointing arrow used on every CTA-style button.
function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Reusable pill CTA (raw button, used where the shared Button component's
// default styling doesn't fit, e.g. on photo backgrounds).
function PillCTA({ onClick, children, tone = "solid" }: { onClick: () => void; children: React.ReactNode; tone?: "solid" | "light" }) {
  const solid = tone === "solid";
  const GOLD = "#D4AF37";
  return (
    <button
      onClick={onClick}
      className="group/cta inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-semibold rounded-full transition-colors duration-300 active:scale-[0.98]"
      style={{
        background: solid ? PRIMARY : "white",
        color: solid ? "white" : PRIMARY,
        border: `1px solid ${solid ? PRIMARY : "white"}`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = "white"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = solid ? PRIMARY : "white"; e.currentTarget.style.borderColor = solid ? PRIMARY : "white"; e.currentTarget.style.color = solid ? "white" : PRIMARY; }}
    >
      {children}
      <ArrowIcon className="transition-transform duration-300 group-hover/cta:translate-x-1" />
    </button>
  );
}

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
            <div key={i} style={{ width: "220px", height: "148px", flexShrink: 0, overflow: "hidden" }}>
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
          style={{ transform: "translateY(-50%)", width: "42%", minWidth: "300px", maxWidth: "460px", padding: "40px 36px", border: `1px solid ${DIVIDER}`, boxShadow: "0 24px 55px rgba(45,49,52,0.10)" }}
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
          style={{ width: "90%", marginTop: "-48px", padding: "28px 24px", border: `1px solid ${DIVIDER}`, boxShadow: "0 20px 45px rgba(45,49,52,0.12)" }}
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
        style={{ border: `1px solid ${DIVIDER}` }}>
        <Quiz onClose={onClose} />
      </div>
    </div>
  );
}

// ── 6er Facts-Grid: Icon + kurzer Fakt, 3 pro Zeile (Desktop), 2 pro Zeile (Mobile) ──
function FactIcon({ path }: { path: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={PRIMARY} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const FACTS = [
  { icon: "M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6", label: "Lorem Ipsum" },
  { icon: "M12 2v20M2 12h20", label: "Dolor Sit Amet" },
  { icon: "M4 19h16M4 15h16M8 11h8M10 7h4", label: "Consectetur" },
  { icon: "M12 21s-7-4.5-7-11a7 7 0 0114 0c0 6.5-7 11-7 11z", label: "Adipiscing Elit" },
  { icon: "M3 3v18h18M8 17V9m5 8V5m5 12v-6", label: "Sed Do Eiusmod" },
  { icon: "M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z", label: "Tempor Incididunt" },
];

function FactsGrid() {
  return (
    <section className="w-full" style={{ backgroundColor: "#FBFAF7", borderBottom: `1px solid ${DIVIDER}` }}>
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
          {FACTS.map((f, i) => (
            <div key={f.label} className={`reveal-up reveal-delay-${(i % 4) + 1} flex flex-col items-start gap-3 text-left`}>
              <div className="flex items-center justify-center" style={{ width: "48px", height: "48px", background: SECTION_BG, border: `1px solid ${DIVIDER}` }}>
                <FactIcon path={f.icon} />
              </div>
              <p className="text-sm font-semibold" style={{ color: TEXT }}>{f.label}</p>
              <p className="text-xs leading-relaxed" style={{ color: TEXT_SECONDARY }}>Lorem ipsum dolor sit amet consectetur adipiscing.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Impressionen: ein großes Highlight-Bild + kleinere, die zusammen ein exaktes Rechteck bilden ──
const IMPRESSIONEN_BENTO = {
  highlight: { src: "/lake-house-sky.webp", alt: "Lorem ipsum dolor sit amet", label: "Lorem Ipsum" },
  small: [
    { src: "/lake-aerial.webp", alt: "Consectetur adipiscing elit", label: "Dolor Sit Amet" },
    { src: "/lake-coast-villa.webp", alt: "Sed do eiusmod tempor", label: "Consectetur" },
    { src: "/lake-terrace-detail.webp", alt: "Incididunt ut labore", label: "Adipiscing Elit" },
    { src: "/lake-boardwalk.webp", alt: "Et dolore magna aliqua", label: "Sed Do Eiusmod" },
  ],
};

function BentoTile({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 768px) 33vw, 50vw" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(45,49,52,0.55) 0%, transparent 100%)" }} />
      <span className="absolute bottom-3 inset-x-0 px-2 text-center text-sm font-semibold text-white">{label}</span>
    </div>
  );
}

function ImpressSection({ openQuiz }: { openQuiz: () => void }) {
  const { highlight, small } = IMPRESSIONEN_BENTO;
  return (
    <section id="impressionen" className="reveal-right w-full scroll-mt-20 overflow-hidden" style={{ backgroundColor: SECTION_BG }}>
      <div className="mx-auto w-full max-w-6xl px-6 pt-16">
        <div className="reveal-up flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl md:text-4xl" style={{ color: TEXT }}>Lorem Ipsum</h2>
          <p className="mt-2 text-sm" style={{ color: TEXT_SECONDARY }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
        </div>
      </div>

      {/* Desktop / Tablet: 4 Spalten x 2 Zeilen — Highlight belegt 2x2, die 4 kleinen je 1x1. Volle Section-Breite. */}
      <div className="hidden md:grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(2, 300px)" }}>
        <div className="reveal-up" style={{ gridColumn: "1 / 3", gridRow: "1 / 3" }}>
          <BentoTile {...highlight} />
        </div>
        {small.map((img, i) => (
          <div key={img.src} className={`reveal-up reveal-delay-${i + 1}`} style={{ gridColumn: `${3 + (i % 2)} / ${4 + (i % 2)}`, gridRow: `${Math.floor(i / 2) + 1} / ${Math.floor(i / 2) + 2}` }}>
            <BentoTile {...img} />
          </div>
        ))}
      </div>

      {/* Mobile: Highlight oben volle Breite, darunter 2x2-Raster mit den kleinen Bildern — volle Section-Breite. */}
      <div className="md:hidden grid gap-3" style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "260px 170px 170px" }}>
        <div className="reveal-up" style={{ gridColumn: "1 / 3", gridRow: "1 / 2" }}>
          <BentoTile {...highlight} />
        </div>
        {small.map((img, i) => (
          <div key={img.src} className={`reveal-up reveal-delay-${i + 1}`} style={{ gridColumn: `${(i % 2) + 1} / ${(i % 2) + 2}`, gridRow: `${Math.floor(i / 2) + 2} / ${Math.floor(i / 2) + 3}` }}>
            <BentoTile {...img} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Route ──
const STATIONS = [
  { city: "Lorem Ipsum", detail: "Standort der Seeresidenz", dist: "direkt vor Ort", pos: 8, image: "/lake-terrace-detail.webp" },
  { city: "Dolor Sit Amet", detail: "Lorem ipsum dolor sit", dist: "ca. 10 min", pos: 28, image: "/lake-boardwalk.webp" },
  { city: "Consectetur", detail: "Adipiscing elit sed do", dist: "ca. 15 min", pos: 48, image: "/lake-house-sky.webp" },
  { city: "Eiusmod Tempor", detail: "Incididunt ut labore", dist: "ca. 15 min", pos: 70, image: "/lake-coast-villa.webp" },
  { city: "Magna Aliqua", detail: "Ausflugsziel in der Region", dist: "ca. 15 min", pos: 90, image: "/lake-villa-portrait.webp" },
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
    <div style={{ backgroundColor: "white", border: `1px solid ${DIVIDER}`, boxShadow: "0 2px 12px rgba(84,117,135,0.10)", overflow: "hidden", width: "220px" }}>
      <div style={{ width: "220px", height: "94px", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.image} alt={s.city} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ padding: "10px 14px" }}>
        <p className="font-semibold text-sm" style={{ color: TEXT }}>{s.city}</p>
        <p className="text-xs" style={{ color: TEXT_SECONDARY }}>{s.detail}</p>
        <p className="text-xs font-semibold mt-0.5" style={{ color: PRIMARY }}>{s.dist}</p>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="w-full py-16" style={{ backgroundColor: SECTION_BG }}>
      <div className="reveal-left mx-auto w-full max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl" style={{ color: TEXT }}>Lorem Ipsum Dolor Sit Amet</h2>
        </div>
        {/* Mobile */}
        <div className="md:hidden relative flex gap-0" style={{ minHeight: "1080px" }}>
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
                  <div style={{ width: "10px", height: "10px", backgroundColor: visible ? PRIMARY : "rgba(84,117,135,0.25)", border: "2px solid white", boxShadow: visible ? `0 0 0 3px rgba(84,117,135,0.22)` : "none", transition: "all 0.4s ease" }} />
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
        <div className="hidden md:block relative" style={{ minHeight: "760px" }}>
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
                <div style={{ position: "absolute", top: "50%", left: "0", transform: "translate(-50%, -50%)", width: "12px", height: "12px", backgroundColor: visible ? PRIMARY : "rgba(84,117,135,0.25)", border: "2px solid white", boxShadow: visible ? `0 0 0 3px rgba(84,117,135,0.22)` : "none", transition: "all 0.4s ease", zIndex: 10 }} />
                <div className="absolute pointer-events-none" style={{ top: "50%", transform: "translateY(-50%)", whiteSpace: "nowrap", ...(isRight ? { left: "120px", right: "auto", textAlign: "left" } : { right: "120px", left: "auto", textAlign: "right" }) }}>
                  <StationCard s={s} />
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
    <section className="w-full bg-center bg-cover bg-scroll md:bg-fixed" style={{ backgroundImage: "url(/lake-horizon.webp)" }}>
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
              padding: "40px 36px",
            }}
          >
            <h2 className="text-3xl md:text-5xl leading-tight" style={{ color: TEXT }}>
              Lorem Ipsum Dolor
            </h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed" style={{ color: TEXT_SECONDARY }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="mt-7 flex justify-center">
              <PillCTA onClick={openQuiz}>Lorem Ipsum</PillCTA>
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
        <OverlapFeature image="/lake-house-portrait.webp" alt="Lorem ipsum dolor sit amet" imgSide="right">
          <h2 className="text-2xl md:text-3xl leading-tight mb-5" style={{ color: TEXT }}>
            Lorem Ipsum Dolor Sit Amet
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: TEXT_SECONDARY }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.
          </p>
          <p className="text-sm leading-relaxed mb-5" style={{ color: TEXT_SECONDARY }}>
            Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat, duis aute irure dolor in reprehenderit.
          </p>
          <div className="mb-5">
            <p className="text-sm font-semibold" style={{ color: TEXT }}>Seeresidenz</p>
            <p className="text-xs" style={{ color: TEXT_SECONDARY }}>Musterstraße 1, 10115 Berlin · +49 30 000 000</p>
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
            <div key={item.date} className={`reveal-up reveal-delay-${(item as any).delay}`} style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", padding: "32px" }}>
              <p className="text-2xl md:text-3xl font-semibold mb-3 text-white">{item.date}</p>
              <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Über uns (unten): 16:9 Foto mit seitlichem Fade und Trust-Text ──
function AboutSection() {
  return (
    <section className="w-full" style={{ backgroundColor: TEXT }}>
      <div className="relative w-full overflow-hidden aspect-[4/5] md:aspect-[16/9]">
        <Image
          src="/lake-house-portrait.webp"
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
              <p className="text-sm md:text-base leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.
              </p>
              <p className="hidden md:block text-base leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.75)" }}>
                Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat — duis aute irure dolor in reprehenderit in voluptate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Gespiegelte Variante der Über-uns-Sektion (oben): Fade von rechts, Text rechtsbündig ──
function AboutSectionTop() {
  return (
    <section className="w-full" style={{ backgroundColor: TEXT }}>
      <div className="relative w-full overflow-hidden aspect-[4/5] md:aspect-[16/9]">
        <Image
          src="/lake-coast-villa.webp"
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
        {/* Desktop: fade from right (mirrored) */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{ background: "linear-gradient(to left, rgba(45,49,52,0.90) 0%, rgba(45,49,52,0.65) 32%, rgba(45,49,52,0.10) 58%, transparent 75%)" }}
        />

        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="mx-auto w-full max-w-6xl px-6 pb-8 md:pb-0">
            <div className="reveal-right ml-auto text-left md:text-right" style={{ maxWidth: "480px" }}>
              <h2 className="text-2xl md:text-4xl leading-tight mb-4 text-white">
                Lorem Ipsum Dolor Sit
              </h2>
              <p className="text-sm md:text-base leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.
              </p>
              <p className="hidden md:block text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat — duis aute irure dolor in reprehenderit in voluptate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// ── Abschluss-Sektion: zentrierter Text, Sonnenaufgang am unteren Sektionsrand ──
function ClosingSunriseSection({ openQuiz }: { openQuiz: () => void }) {
  return (
    <section className="w-full relative overflow-hidden" style={{ backgroundColor: "#FBFAF7" }}>
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center" style={{ paddingTop: "120px", paddingBottom: "160px" }}>
        <h2 className="reveal-up text-3xl md:text-5xl leading-tight mb-5" style={{ color: TEXT }}>
          Lorem Ipsum Dolor Sit Amet
        </h2>
        <p className="reveal-up reveal-delay-1 text-base leading-relaxed mb-8" style={{ color: TEXT_SECONDARY }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="reveal-up reveal-delay-2 flex justify-center">
          <PillCTA onClick={openQuiz}>Lorem Ipsum</PillCTA>
        </div>
      </div>

      {/* Sonnenuntergang: Halbkreis, weiter unten versenkt, mit weichem mehrstufigem Verlauf */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2"
        style={{
          bottom: 0,
          transform: "translate(-50%, 82%)",
          width: "min(1300px, 190vw)",
          height: "min(1300px, 190vw)",
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(250,222,120,0.65) 0%, rgba(249,214,92,0.52) 12%, rgba(246,203,75,0.40) 24%, rgba(244,197,66,0.30) 36%, rgba(238,188,62,0.20) 48%, rgba(232,178,58,0.12) 60%, rgba(232,178,58,0.06) 72%, rgba(232,178,58,0.02) 85%, rgba(232,178,58,0) 100%)",
          filter: "blur(2px)",
        }}
      />
      {/* zusätzlicher weicher Schein, sorgt für sanfteren Übergang in den Hintergrund */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2"
        style={{
          bottom: 0,
          transform: "translate(-50%, 55%)",
          width: "min(1700px, 220vw)",
          height: "min(900px, 120vw)",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 50% 50%, rgba(249,214,92,0.16) 0%, rgba(249,214,92,0.08) 40%, rgba(249,214,92,0) 75%)",
        }}
      />
      {/* Horizontlinie exakt am unteren Sektionsrand */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0" style={{ height: "1px", background: "rgba(45,49,52,0.12)" }} />
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
            <Image src="/lake-aerial.webp" alt="Seeresidenz" fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: "90px", background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)" }} />
          </div>
          <div className="relative w-full px-5 py-8" style={{ backgroundColor: "#FBFAF7" }}>
            <div className="reveal-left">
              <h1 className="leading-tight" style={{ fontSize: "clamp(2rem, 8vw, 2.6rem)" }}>
                <span className="block" style={{ color: TEXT }}>Lorem Ipsum Dolor Sit Amet.</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit — sed do eiusmod tempor incididunt ut labore et dolore magna.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {["Lorem Ipsum", "Dolor Sit Amet", "Ab XXX.000 €"].map((pill) => (
                  <span key={pill} style={{ display: "inline-flex", alignItems: "center", padding: "6px 14px", background: SECTION_BG, border: `1px solid ${DIVIDER}`, color: TEXT, fontSize: "12px", fontWeight: 700 }}>{pill}</span>
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
          <Image src="/lake-aerial.webp" alt="Seeresidenz" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: "160px", background: "linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: "55%", background: "linear-gradient(180deg, transparent 0%, rgba(251,250,247,0.15) 40%, rgba(251,250,247,0.72) 100%)" }} />

          <div className="absolute inset-x-0 bottom-0 z-10 pb-10 lg:pb-14">
            <div className="mx-auto w-full max-w-6xl px-6 flex items-end justify-between gap-10">
              <div className="reveal-left flex-1 min-w-0">
                <div className="flex flex-wrap gap-2.5 mb-4">
                  {["Lorem Ipsum", "Dolor Sit Amet", "Ab XXX.000 €"].map((pill) => (
                    <span key={pill} style={{ display: "inline-flex", alignItems: "center", padding: "6px 14px", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", border: `1px solid ${DIVIDER}`, color: TEXT, fontSize: "12px", fontWeight: 700 }}>{pill}</span>
                  ))}
                </div>
                <h1 className="text-left leading-tight" style={{ fontSize: "clamp(2.2rem, 5vw, 4.6rem)" }}>
                  <span className="block" style={{ color: TEXT }}>Lorem Ipsum Dolor Sit Amet.</span>
                </h1>
              </div>
              <div className="reveal-right text-right flex flex-col items-end gap-5 shrink-0" style={{ maxWidth: "320px" }}>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit — sed do eiusmod tempor incididunt ut labore et dolore magna.
                </p>
                <Button onClick={openQuiz} size="lg">Lorem Ipsum</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  <p className="font-semibold text-sm leading-snug" style={{ color: TEXT }}>{item.title}</p>
                </div>
                <p className="text-xs leading-relaxed pl-7" style={{ color: TEXT_SECONDARY }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start md:items-center md:justify-center reveal-up reveal-delay-4">
            <Button onClick={openQuiz}>Lorem Ipsum</Button>
          </div>
        </div>
      </section>

      {/* HERO MARQUEE */}
      <HeroMarquee />

      {/* ÜBER UNS (gespiegelt, oben) */}
      <AboutSectionTop />

      {/* FACTS GRID */}
      <FactsGrid />

      {/* OBJEKT DETAIL */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 scroll-mt-20">
        <div className="flex flex-col gap-12">
          {[
            {
              src: "/lake-terrace-detail.webp",
              alt: "Lorem ipsum dolor sit amet",
              title: "Lorem Ipsum Dolor Sit",
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit — sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              reverse: false,
            },
            {
              src: "/lake-boardwalk.webp",
              alt: "Consectetur adipiscing elit",
              title: "Ut Enim Ad Minim",
              text: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat — duis aute irure dolor in reprehenderit.",
              reverse: true,
            },
            {
              src: "/lake-villa-portrait.webp",
              alt: "Sed do eiusmod tempor",
              title: "Voluptate Velit Esse",
              text: "Cillum dolore eu fugiat nulla pariatur, excepteur sint occaecat cupidatat non proident sunt in culpa qui officia.",
              reverse: false,
            },
          ].map((card, i) => (
            <div key={card.title} className={`${i % 2 === 0 ? "reveal-left" : "reveal-right"} grid grid-cols-1 md:grid-cols-2 items-stretch`} style={{ border: `1px solid ${DIVIDER}`, overflow: "hidden" }}>
              <div className={`relative w-full overflow-hidden ${card.reverse ? "md:order-2" : ""}`} style={{ aspectRatio: "21/9" }}>
                <Image src={card.src} alt={card.alt} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
              </div>
              <div className={`flex flex-col justify-center p-6 md:p-10 ${card.reverse ? "md:order-1" : ""}`}>
                <h3 className="text-xl md:text-2xl font-semibold mb-3" style={{ color: TEXT }}>{card.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: TEXT_SECONDARY }}>{card.text}</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { number: 500, unit: " m²", label: "Lorem Ipsum" },
              { number: 104, unit: " m²", label: "Dolor Sit Amet" },
              { label: "2 Einheiten", isText: true },
              { number: 499, unit: "T€", label: "Consectetur" },
            ].map((stat, i) => (
              <div key={i}
                className={`reveal-up reveal-delay-${i + 1} flex flex-col items-center justify-center py-10 px-4 text-center`}
                style={{ borderTop: `1px solid ${DIVIDER}`, borderBottom: `1px solid ${DIVIDER}`, borderRight: i < 3 ? `1px solid ${DIVIDER}` : "none" }}>
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
          <p className="text-sm leading-relaxed mb-4" style={{ color: TEXT_SECONDARY }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p className="text-sm leading-relaxed mb-5" style={{ color: TEXT_SECONDARY }}>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <Button onClick={openQuiz}>Lorem Ipsum Dolor</Button>
        </OverlapFeature>
      </section>

      {/* PROJEKTDATEN */}
      <section id="projektdaten" className="w-full scroll-mt-20" style={{ backgroundColor: SECTION_BG }}>
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <OverlapFeature image="/lake-villa-portrait.webp" alt="Lorem ipsum dolor sit amet" imgSide="left">
            <h2 className="text-2xl md:text-3xl leading-tight mb-5" style={{ color: TEXT }}>
              Lorem Ipsum Dolor Sit.
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: TEXT_SECONDARY }}>
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

      {/* ABSCHLUSS: zentrierter Text, Sonnenaufgang am unteren Rand */}
      <ClosingSunriseSection openQuiz={openQuiz} />
    </main>
  );
}
