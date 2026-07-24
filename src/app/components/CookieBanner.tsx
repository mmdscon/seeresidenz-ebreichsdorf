'use client';
import { useEffect, useState } from 'react';
import { useConsent } from '@/app/providers/ConsentProvider';

const ACCENT = "#547587";

export default function CookieBanner() {
  const { consent, setMarketing } = useConsent();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(consent.marketing === null);
  }, [consent.marketing]);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4"
      style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}>
      <div
        className="mx-auto max-w-3xl"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(84,117,135,0.18)",
          boxShadow: "0 8px 40px rgba(84,117,135,0.14)",
          borderRadius: "16px",
          padding: "18px 20px",
        }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
              <circle cx="12" cy="12" r="10" stroke={ACCENT} strokeWidth="1.8" />
              <circle cx="9" cy="10" r="1.2" fill={ACCENT} />
              <circle cx="14" cy="8" r="1" fill={ACCENT} />
              <circle cx="15" cy="14" r="1.2" fill={ACCENT} />
              <circle cx="10" cy="15" r="0.9" fill={ACCENT} />
            </svg>
            <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#6C757A", margin: 0 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap" }}>
            <button
              onClick={() => { setMarketing(false); setOpen(false); }}
              style={{
                height: "36px", padding: "0 16px",
                fontSize: "12px", fontWeight: 600,
                color: "#6C757A",
                background: "transparent",
                border: "1px solid rgba(84,117,135,0.35)",
                borderRadius: "10px",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Nur essenziell
            </button>
            <button
              onClick={() => { setMarketing(true); setOpen(false); }}
              style={{
                height: "36px", padding: "0 18px",
                fontSize: "12px", fontWeight: 600,
                color: "white",
                background: ACCENT,
                border: "1px solid transparent",
                borderRadius: "10px",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
