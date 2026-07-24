import { Manrope, DM_Sans } from 'next/font/google'

// Heading / display face — light weight, used uppercase per brand identity.
export const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['300', '400', '500'],
})

// Body / UI face.
export const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600'],
})

// Kept as aliases so existing layout/component imports (var(--font-montserrat) etc.
// have been replaced project-wide) keep a valid fallback if referenced anywhere.
export const montserrat = manrope
export const lora = manrope
export const monaSans = dmSans
