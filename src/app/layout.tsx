import type { Metadata } from 'next';
import '@/app/globals.css';
import { manrope, dmSans } from '@/app/fonts';

import Footer from '@/components/ui/Footer';
import { ConsentProvider } from '@/app/providers/ConsentProvider';
import CookieBanner from '@/components/CookieBanner';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Seeresidenz | Lorem Ipsum Dolor Sit Amet',
  description: 'Seeresidenz – Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${manrope.variable} ${dmSans.variable}`}>
      <body>
        <ConsentProvider>
          <CookieBanner />
          {children}
          <Footer />
          <WhatsAppButton />
        </ConsentProvider>
      </body>
    </html>
  );
}
