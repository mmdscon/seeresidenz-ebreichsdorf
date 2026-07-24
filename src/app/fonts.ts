import { Marcellus, DM_Sans } from 'next/font/google'

// Heading / display face — distinctive serif, used in normal case per brand identity.
export const marcellus = Marcellus({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400'],
})

// Body / UI face.
export const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600'],
})

// Kept as aliases so existing component imports keep a valid fallback.
export const montserrat = marcellus
export const manrope = marcellus
export const lora = marcellus
export const monaSans = dmSans
