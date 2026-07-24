"use client";

import * as React from "react";
import Header from "@/components/ui/Header";

export default function DankePage() {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <main style={{ background: "#FBFAF7", fontFamily: "var(--font-body), system-ui, sans-serif" }}>
      <Header />

      <section className="w-full">
        <div className="relative w-full overflow-hidden" style={{ height: "clamp(260px, 38vw, 480px)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lake-aerial.webp" alt="Seeresidenz – Danke" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(84,117,135,0.30) 0%, rgba(84,117,135,0.68) 100%)" }} />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-6xl px-6 pb-10 md:pb-14">
              <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(18px)", transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 14px", background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.30)", borderRadius: "0px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: "12px" }}>Anfrage bestätigt</span>
                <h1 style={{ fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)", fontWeight: 400, color: "white", lineHeight: 1.05, margin: 0, fontFamily: "var(--font-heading), Georgia, serif", letterSpacing: "-0.01em" }}>
                  Lorem Ipsum.<br />Dolor Sit Amet.
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="text-base leading-relaxed mb-10" style={{ color: "#6C757A" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.
          </p>
          <h2 className="text-2xl md:text-3xl mb-8" style={{ color: "#2D3134" }}>
            Wie geht's jetzt weiter?
          </h2>
          <ol className="space-y-7">
            {[
              { n: "01", title: "Lorem Ipsum Dolor", text: "Sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
              { n: "02", title: "Ut Enim Ad Minim", text: "Veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute." },
              { n: "03", title: "Irure Dolor In", text: "Reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat." },
            ].map(({ n, title, text }) => (
              <li key={n} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: "36px", height: "36px", background: "rgba(84,117,135,0.08)", border: "1px solid rgba(84,117,135,0.20)", borderRadius: "0px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#547587", letterSpacing: "0.04em", marginTop: "1px" }}>{n}</span>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#2D3134", margin: "0 0 5px" }}>{title}</p>
                  <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#6C757A", margin: 0 }}>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
