// src/app/api/lead/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── Supabase client (server-side only) ───────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// ── Config (hardcoded per Landingpage-Deployment) ─────────────
const KUNDE   = 'Seeresidenz';
const PROJEKT = 'Seeresidenz-Landingpage';

// ── Make.com Webhook (Google Sheet Backup) ────────────────────
const MAKE_WEBHOOK = process.env.MAKE_WEBHOOK_URL!;

// ── Helpers ───────────────────────────────────────────────────
function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function sanitize(s: unknown, maxLen = 500) {
  return String(s ?? '').trim().slice(0, maxLen);
}

function getUtmParams(req: NextRequest) {
  const sp = req.nextUrl?.searchParams;
  const get = (k: string) => sanitize(sp?.get(k)) || undefined;

  let utm_campaign = get('utm_campaign');
  if (!utm_campaign) {
    try {
      const ref = req.headers.get('referer');
      if (ref) utm_campaign = sanitize(new URL(ref).searchParams.get('utm_campaign')) || undefined;
    } catch { /* ignore */ }
  }

  return {
    utm_source:   get('utm_source'),
    utm_medium:   get('utm_medium'),
    utm_campaign,
    utm_term:     get('utm_term'),
    utm_content:  get('utm_content'),
  };
}

// ── POST handler ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Parse body
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // 2. Honeypot
  if (sanitize(body.hp)) {
    return new NextResponse(null, { status: 204 });
  }

  // 3. Sanitize fields
  const usage     = sanitize(body.usage,     100); // Quiz Q1
  const timeframe = sanitize(body.timeframe, 100); // Quiz Q2
  const name      = sanitize(body.name,      200);
  const email     = sanitize(body.email,     200);
  const phone     = sanitize(body.phone,     100);

  // 4. Validate
  if (!usage || !timeframe) {
    return NextResponse.json(
      { ok: false, error: 'validation', fields: { usage: !!usage, timeframe: !!timeframe } },
      { status: 400 }
    );
  }
  if (!name || !email || !isValidEmail(email) || !phone) {
    return NextResponse.json(
      { ok: false, error: 'validation', fields: { name: !!name, email: isValidEmail(email), phone: !!phone } },
      { status: 400 }
    );
  }

  // 5. Split name into first/last
  const [firstName, ...rest] = name.split(' ');
  const lastName = rest.join(' ') || '-';

  // 6. UTM + Meta
  const utm = getUtmParams(req);
  const meta = {
    ip:      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
    ua:      req.headers.get('user-agent') ?? undefined,
    referer: req.headers.get('referer') ?? undefined,
  };

  // 7. Write to Supabase
  const { data: lead, error: supabaseErr } = await supabase
    .from('leads')
    .insert({
      kunde:          KUNDE,
      projekt:        PROJEKT,
      firstName,
      lastName,
      email,
      phone,
      investmentType: usage,
      timeframe,
      source:         'seeresidenz-quiz',
      status:         'NEU',
      ...utm,
      ...meta,
    })
    .select()
    .single();

  if (supabaseErr) {
    console.error('Supabase insert error:', supabaseErr);
    return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 });
  }

  // Log activity
  await supabase.from('activity_logs').insert({
    leadId:  lead.id,
    type:    'LEAD_CREATED',
    message: 'Lead erstellt via seeresidenz-quiz',
  });

  // 8. Make.com Webhook (Google Sheet Backup) — fire & forget
  if (MAKE_WEBHOOK) {
    const makePayload = {
      // Masterfile columns: Kunde / Projekt / Timestamp / Name / E-Mail / Telefon / Feld1 / Feld2 / Feld3
      Kunde:                  KUNDE,
      Projekt:                PROJEKT,
      Timestamp:              new Date().toISOString(),
      Name:                   name,
      'E-Mail':               email,
      Telefon:                phone,
      'Benutzerdefiniertes Feld 1': usage,      // Ferienhaus / Eigenheim
      'Benutzerdefiniertes Feld 2': timeframe,  // Ab sofort / In 1-3 Monaten …
      'Benutzerdefiniertes Feld 3': utm.utm_campaign ?? '',
    };

    // Non-blocking
    fetch(MAKE_WEBHOOK, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(makePayload),
    }).catch((err) => console.error('Make.com webhook error:', err));
  }

  return NextResponse.json({ ok: true });
}
