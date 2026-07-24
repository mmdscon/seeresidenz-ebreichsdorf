'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import { IMPRESSION_IMAGES } from '@/lib/images';

type Step = 'intro' | 'q1' | 'q2' | 'loading' | 'contact' | 'done';

type Answers = {
  usage?: string;
  timeframe?: string;
  name?: string;
  email?: string;
  phone?: string;
};

const PRIMARY = "#547587";
const TEXT = "#2D3134";
const TEXT_SECONDARY = "#6C757A";

function IconArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ModernLoader() {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-3 h-3"
          style={{
            backgroundColor: PRIMARY,
            animation: `loaderPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function OptionCard({ label, sublabel, letter, onClick, selected, align = 'center' }: {
  label: string;
  sublabel?: string;
  letter?: string;
  onClick: () => void;
  selected?: boolean;
  align?: 'left' | 'center';
}) {
  const isLeft = align === 'left';
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-start gap-4 p-4 border-2 transition-all duration-150 focus:outline-none"
      style={{
        borderColor: selected ? PRIMARY : 'rgba(45,49,52,0.14)',
        backgroundColor: selected ? `${PRIMARY}0D` : 'white',
        borderRadius: '999px',
        textAlign: isLeft ? 'left' : 'center',
        justifyContent: isLeft ? 'flex-start' : 'center',
      }}
    >
      {letter && (
        <span className="shrink-0 w-7 h-7 flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: selected ? PRIMARY : '#F4F1EB', color: selected ? 'white' : TEXT_SECONDARY, borderRadius: '999px' }}>
          {letter}
        </span>
      )}
      <div style={{ textAlign: isLeft ? 'left' : 'center' }}>
        <p className="font-semibold text-sm leading-snug normal-case" style={{ color: TEXT }}>{label}</p>
        {sublabel && <p className="mt-0.5 text-xs leading-relaxed normal-case" style={{ color: TEXT_SECONDARY }}>{sublabel}</p>}
      </div>
      {selected && (
        <svg className="ml-auto shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill={PRIMARY} />
          <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function ProgressDots({ step }: { step: Step }) {
  const steps: Step[] = ['intro', 'q1', 'q2', 'contact'];
  const idx = steps.indexOf(step);
  if (idx < 0) return null;
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((s, i) => (
        <div key={s} className="h-1.5 transition-all duration-300"
          style={{ width: i === idx ? '24px' : '8px', backgroundColor: i <= idx ? PRIMARY : '#E7E6E2' }} />
      ))}
    </div>
  );
}

interface QuizProps {
  onClose?: () => void;
}

export default function Quiz({ onClose }: QuizProps) {
  const [step, setStep] = useState<Step>('intro');
  const [answers, setAnswers] = useState<Answers>({});
  const sentLeadRef = useRef(false);
  const loadingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) window.clearTimeout(loadingTimeoutRef.current);
    };
  }, []);

  const goToLoading = (data: Partial<Answers>) => {
    setAnswers((a) => ({ ...a, ...data }));
    setStep('loading');
    loadingTimeoutRef.current = window.setTimeout(() => {
      setStep('contact');
      loadingTimeoutRef.current = null;
    }, 1800);
  };

  const back = () => {
    if (step === 'q1') setStep('intro');
    else if (step === 'q2') setStep('q1');
    else if (step === 'contact') setStep('q2');
    else if (step === 'loading') { if (loadingTimeoutRef.current) { window.clearTimeout(loadingTimeoutRef.current); } setStep('q2'); }
  };

  const submitLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      usage: answers.usage ?? '',
      timeframe: answers.timeframe ?? '',
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      hp: String(form.get('hp') || '').trim(),
    };
    if (!payload.name || !payload.email || !payload.phone) { alert('Bitte fülle alle Felder aus.'); return; }
    if (!sentLeadRef.current) {
      try { (window as any).fbq?.('track', 'Lead', payload); sentLeadRef.current = true; } catch {}
    }
    try {
      await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch {}
    window.location.href = '/danke';
  };

  const inputClass = "h-12 border px-5 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#547587]/20 text-sm text-center";
  const inputStyle = { borderColor: 'rgba(45,49,52,0.16)', color: TEXT, borderRadius: '0px' };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 right-0 w-9 h-9 flex items-center justify-center transition-colors hover:bg-gray-100"
          aria-label="Schließen"
          style={{ color: TEXT_SECONDARY, borderRadius: '999px' }}
        >
          <X size={18} />
        </button>
      )}

      <ProgressDots step={step} />

      {/* INTRO */}
      {step === 'intro' && (
        <div className="space-y-6 text-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: PRIMARY }}>Lorem Ipsum Dolor</p>
            <h3 className="text-2xl leading-snug" style={{ color: TEXT }}>
              Lorem Ipsum Dolor Sit Amet
            </h3>
          </div>
          <div className="space-y-4 text-left">
            {[
              { n: '1', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
              { n: '2', text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna.' },
              { n: '3', text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
              { n: '4', text: 'Nisi ut aliquip ex ea commodo consequat duis aute irure dolor.' },
            ].map(({ n, text }) => (
              <div key={n} className="flex items-start gap-4">
                <span className="shrink-0 w-7 h-7 flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: PRIMARY, marginTop: '2px' }}>{n}</span>
                <p className="text-sm leading-relaxed normal-case" style={{ color: TEXT_SECONDARY }}>{text}</p>
              </div>
            ))}
          </div>
          {/* Bold centered note under step 4 */}
          <p className="text-sm font-bold text-center normal-case" style={{ color: TEXT }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <Button onClick={() => setStep('q1')} className="w-full" size="lg">
            Lorem Ipsum
          </Button>
          <p className="text-center text-xs normal-case" style={{ color: TEXT_SECONDARY }}>
            Oder rufen Sie uns gerne direkt an: <a href="tel:+4930000000" className="font-semibold" style={{ color: PRIMARY }}>+49 30 000 000</a>
          </p>
        </div>
      )}

      {/* Q1 */}
      {step === 'q1' && (
        <div className="space-y-5">
          <div className="text-center">
            <h3 className="text-xl leading-snug" style={{ color: TEXT }}>
              Lorem Ipsum Dolor Sit Amet?
            </h3>
          </div>
          <div className="space-y-3">
            <OptionCard label="Lorem Ipsum" sublabel="Dolor sit amet consectetur" onClick={() => { setAnswers(a => ({ ...a, usage: 'Lorem Ipsum' })); setStep('q2'); }} selected={answers.usage === 'Lorem Ipsum'} />
            <OptionCard label="Dolor Sit Amet" sublabel="Consectetur adipiscing elit" onClick={() => { setAnswers(a => ({ ...a, usage: 'Dolor Sit Amet' })); setStep('q2'); }} selected={answers.usage === 'Dolor Sit Amet'} />
          </div>
          <div className="flex justify-center">
            <button onClick={back} type="button" className="mt-2 inline-flex items-center gap-2 text-sm hover:opacity-70" style={{ color: TEXT_SECONDARY }}>
              <IconArrowLeft /> Zurück
            </button>
          </div>
        </div>
      )}

      {/* Q2 */}
      {step === 'q2' && (
        <div className="space-y-5">
          <div className="text-center">
            <h3 className="text-xl leading-snug" style={{ color: TEXT }}>
              Lorem Ipsum Dolor Sit Amet?
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { letter: 'A', label: 'Lorem Ipsum', sublabel: 'Dolor sit amet consectetur' },
              { letter: 'B', label: 'Dolor Sit Amet', sublabel: '' },
              { letter: 'C', label: 'Consectetur Elit', sublabel: '' },
              { letter: 'D', label: 'Sed Do Eiusmod', sublabel: '' },
            ].map(({ letter, label, sublabel }) => (
              <OptionCard
                key={letter}
                letter={letter}
                label={label}
                sublabel={sublabel || undefined}
                onClick={() => goToLoading({ timeframe: label })}
                selected={answers.timeframe === label}
                align="left"
              />
            ))}
          </div>
          <div className="flex justify-center">
            <button onClick={back} type="button" className="mt-2 inline-flex items-center gap-2 text-sm hover:opacity-70" style={{ color: TEXT_SECONDARY }}>
              <IconArrowLeft /> Zurück
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {step === 'loading' && (
        <div className="flex flex-col items-center gap-6 py-10 text-center">
          <ModernLoader />
          <p className="text-sm font-medium normal-case" style={{ color: TEXT_SECONDARY }}>Ihre Angaben werden vorbereitet …</p>
        </div>
      )}

      {/* Contact */}
      {step === 'contact' && (
        <div className="space-y-5">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div
                className="relative overflow-hidden flex items-center justify-center"
                style={{ width: '72px', height: '72px', border: `2px solid ${PRIMARY}`, backgroundColor: '#F4F1EB' }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={PRIMARY} strokeWidth="1.6">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
                </svg>
              </div>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: PRIMARY }}>Ihr persönlicher Ansprechpartner</p>
            <p className="text-sm font-semibold mb-3 normal-case" style={{ color: TEXT }}>Team Seeresidenz</p>
            <h3 className="text-xl leading-snug" style={{ color: TEXT }}>
              Lorem Ipsum Dolor Sit Amet?
            </h3>
            <p className="mt-2 text-sm normal-case" style={{ color: TEXT_SECONDARY }}>100% unverbindlich und kostenlos für Sie. Wir melden uns persönlich bei Ihnen.</p>
          </div>

          <form onSubmit={submitLead} className="space-y-3">
            <input type="hidden" name="usage" value={answers.usage || ''} />
            <input type="hidden" name="timeframe" value={answers.timeframe || ''} />
            <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" />
            <input className={inputClass} style={inputStyle} name="name" placeholder="Ihr Name" required />
            <input className={inputClass} style={inputStyle} type="email" name="email" placeholder="Ihre E-Mail-Adresse" required />
            <input className={inputClass} style={inputStyle} type="tel" name="phone" placeholder="Ihre Telefonnummer" required />
            <Button type="submit" className="w-full" size="lg">
              Lorem Ipsum Dolor
            </Button>
            <p className="text-center text-xs leading-relaxed normal-case" style={{ color: TEXT_SECONDARY }}>
              Mit dem Absenden erklären Sie sich mit der Verarbeitung Ihrer Angaben einverstanden.
            </p>
          </form>
          <div className="flex justify-center">
            <button onClick={back} type="button" className="inline-flex items-center gap-2 text-sm hover:opacity-70" style={{ color: TEXT_SECONDARY }}>
              <IconArrowLeft /> Zurück
            </button>
          </div>
        </div>
      )}

      {/* ── Image marquee strip ── */}
      <div className="mt-8 -mx-8 overflow-hidden" style={{ borderTop: "1px solid rgba(45,49,52,0.08)", paddingTop: "20px" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            animation: "quizMarquee 28s linear infinite",
            width: "max-content",
          }}
        >
          {[...Array(2)].flatMap(() =>
            IMPRESSION_IMAGES
            .map((src, i) => (
              <div key={`${src}-${i}`} style={{ width: "96px", height: "64px", flexShrink: 0, overflow: "hidden", borderRadius: "0px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.78, display: "block" }} />
              </div>
            ))
          )}
        </div>
        <style>{`@keyframes quizMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      </div>
    </div>
  );
}
