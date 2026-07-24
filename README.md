# Seeresidenz – Landingpage

Next.js 14 Landingpage für die Vermarktung der Seeresidenz. Diese Version basiert auf einer bestehenden Landingpage-Struktur und wurde auf die neue Marke "Seeresidenz" umgestellt: alle Inhalte sind aktuell Platzhalter (Lorem Ipsum) und müssen vor Go-Live durch echte Texte ersetzt werden.

## Setup

```bash
npm install
npm run dev
```

## Deployment (Vercel)

```bash
npm install -g vercel
vercel deploy
```

Setze folgende Environment Variables in Vercel:
- `MAKE_WEBHOOK_URL` → Dein Make.com Webhook (Google Sheet Backup)
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` → Supabase-Projekt für Lead-Speicherung
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` → optional, für Meta-Pixel-Tracking nach Cookie-Zustimmung

## Bilder

Alle Bilder in `/public/` sind aus der ursprünglichen Vorlage übernommene **Platzhalterfotos** (generische Architektur-, Landschafts- und Baufortschrittsbilder) und zeigen keine reale Seeresidenz. Fotos, die reale Personen aus der vorherigen Vorlage zeigten (Portrait, Signatur, Team-Foto), wurden entfernt. Vor Go-Live bitte durch echtes Bildmaterial der Seeresidenz ersetzen. Logo (`logo.svg`) wurde neu als einfaches Wordmark mit dem Horizont-/Sonnenaufgang-Markenzeichen erstellt und sollte ggf. durch ein finales Logo ersetzt werden.

## Marke

- Headlines: Manrope Light, Großbuchstaben, letter-spacing -0.03em
- Fließtext: DM Sans
- Primärfarbe: #547587 · Sekundärfarbe: #C9E3EC · Akzent: #F4D6B3
- Hintergrund: #FBFAF7 · Section-Hintergrund: #F4F1EB
- Text dunkel: #2D3134 · Text hell: #6C757A · Trennlinien: #E7E6E2
- Buttons: abgerundet (12px), Cards: abgerundet (20px), keine Schlagschatten, keine Farbverläufe in Gold/Glanzoptik

## Texte

Alle Inhalte (Headlines, Fließtexte, Button-Labels, Footer) sind derzeit Lorem-Ipsum-Platzhalter, um die Struktur der Seite unabhängig vom finalen Copywriting zu zeigen. Bitte vor Launch durch redaktionelle Texte ersetzen.
