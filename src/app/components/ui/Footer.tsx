"use client";

import Image from "next/image";

const NAV_COLS = [
  {
    heading: "Lorem Ipsum",
    links: [
      { label: "Dolor Sit Amet", href: "#vorteile", isScroll: true },
      { label: "Consectetur", href: "#impressionen", isScroll: true },
      { label: "Adipiscing Elit", href: "#lage", isScroll: true },
      { label: "Sed Do Eiusmod", href: "#projektdaten", isScroll: true },
    ],
  },
  {
    heading: "Kontakt",
    links: [
      { label: "Anfrage stellen", href: "#quiz-trigger", isScroll: true },
      { label: "info@seeresidenz.example", href: "mailto:info@seeresidenz.example" },
      { label: "+49 30 000 000", href: "tel:+4930000000" },
    ],
  },
  {
    heading: "Rechtliches",
    links: [
      { label: "Impressum", href: "#", external: true },
      { label: "Datenschutz", href: "#", external: true },
    ],
  },
];

export default function Footer() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.slice(1);
      if (id === 'quiz-trigger') {
        window.dispatchEvent(new CustomEvent('open-quiz'));
        return;
      }
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer style={{ backgroundColor: "#547587", color: "#ffffff", fontFamily: "var(--font-body), system-ui, sans-serif" }}>
      <div className="mx-auto max-w-6xl px-6" style={{ paddingTop: "80px", paddingBottom: "56px" }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1 flex flex-col gap-5">
            <div>
              <Image
                src="/logo.svg"
                alt="Seeresidenz"
                width={160}
                height={31}
                className="h-7 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>
          </div>

          {NAV_COLS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={(link as any).external ? "_blank" : undefined}
                      rel={(link as any).external ? "noopener noreferrer" : undefined}
                      onClick={(link as any).isScroll ? (e) => handleScroll(e, link.href) : undefined}
                      className="text-sm transition-colors duration-150 cursor-pointer"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#ffffff")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.75)")}
                    >{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.18)" }}>
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] tracking-wide" style={{ color: "rgba(255,255,255,0.55)" }}>
            © {new Date().getFullYear()} Seeresidenz. Alle Rechte vorbehalten.
          </p>
          <p className="text-[11px] tracking-wide" style={{ color: "rgba(255,255,255,0.55)" }}>
            Lorem ipsum dolor sit amet
          </p>
        </div>
      </div>
    </footer>
  );
}
