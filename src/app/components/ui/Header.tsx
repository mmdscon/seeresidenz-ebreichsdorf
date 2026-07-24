"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

const PRIMARY = "#547587";
const BG = "#FBFAF7";
const TEXT = "#2D3134";

export default function Header({ onQuizOpen }: { onQuizOpen?: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }, []);

  const navItems = [
    { id: "vorteile", label: "Lorem Ipsum" },
    { id: "impressionen", label: "Dolor Sit" },
    { id: "lage", label: "Amet Consectetur" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        fontFamily: "var(--font-body), system-ui, sans-serif",
        backgroundColor: scrolled ? BG : "transparent",
        borderBottom: scrolled ? "1px solid #E7E6E2" : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 24px rgba(45,49,52,0.06)" : "none",
        transition: "background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div className="w-full max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" aria-label="Seeresidenz – Startseite" className="shrink-0">
            <Image
              src="/logo.svg"
              alt="Seeresidenz"
              width={180}
              height={35}
              priority
              className="h-7 md:h-8 w-auto"
              style={{ filter: scrolled ? "none" : "brightness(0) invert(1)", transition: "filter 0.3s ease" }}
            />
          </a>

          <div className="hidden md:flex items-center gap-9">
            <nav className="flex items-center gap-8 text-sm font-medium">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)}
                  className="leading-none bg-transparent border-none cursor-pointer p-0 transition-opacity duration-150"
                  style={{ fontFamily: "inherit", color: scrolled ? TEXT : "white", opacity: 0.88 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
                >{item.label}</button>
              ))}
            </nav>
            <button onClick={onQuizOpen}
              className="group/cta shrink-0 inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-full transition-colors duration-300"
              style={{
                background: scrolled ? PRIMARY : "rgba(255,255,255,0.14)",
                backdropFilter: scrolled ? "none" : "blur(10px)",
                color: "white",
                border: scrolled ? `1px solid ${PRIMARY}` : "1px solid rgba(255,255,255,0.35)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#D4AF37"; e.currentTarget.style.borderColor = "#D4AF37"; e.currentTarget.style.color = "white"; e.currentTarget.style.backdropFilter = "none"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = scrolled ? PRIMARY : "rgba(255,255,255,0.14)"; e.currentTarget.style.borderColor = scrolled ? PRIMARY : "rgba(255,255,255,0.35)"; e.currentTarget.style.color = "white"; e.currentTarget.style.backdropFilter = scrolled ? "none" : "blur(10px)"; }}
            >
              Lorem Ipsum
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/cta:translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 focus:outline-none"
            style={{ color: scrolled ? TEXT : "white" }}
            aria-expanded={open}
            aria-label="Menü öffnen"
            onClick={() => setOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="md:hidden fixed inset-0 z-[60]"
        style={{
          background: "rgba(45,49,52,0.45)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Right-side sliding panel */}
      <div
        className="md:hidden fixed top-0 right-0 z-[70] h-full flex flex-col w-[80vw] max-w-[320px]"
        style={{
          backgroundColor: BG,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
          boxShadow: open ? "-8px 0 30px rgba(45,49,52,0.15)" : "none",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E7E6E2" }}>
          <Image src="/logo.svg" alt="Seeresidenz" width={140} height={27} className="h-6 w-auto" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Menü schließen"
            className="inline-flex items-center justify-center p-2"
            style={{ color: TEXT }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-6 pt-6">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className="text-left bg-transparent border-none cursor-pointer text-sm font-medium py-3"
              style={{ fontFamily: "var(--font-body), system-ui, sans-serif", color: TEXT, borderBottom: "1px solid #E7E6E2" }}
            >{item.label}</button>
          ))}
        </nav>
        <div className="mt-auto px-6 py-6">
          <button onClick={() => { onQuizOpen?.(); setOpen(false); }}
            className="group/cta w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-full transition-colors duration-300 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white"
            style={{ background: PRIMARY, color: "white", border: `1px solid ${PRIMARY}` }}
          >
            Lorem Ipsum
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/cta:translate-x-1">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
