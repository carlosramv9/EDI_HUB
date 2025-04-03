import { Inter } from 'next/font/google';
import '@/styles/globals.scss';
import Footer from '@/components/shared/Footer';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale} from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();
  return (
    <html lang={locale} className="h-full">
      <NextIntlClientProvider>
      <body className={`${inter.className} h-full`}>
        <div className="h-full flex flex-col">         
          <main className="flex-1 h-full">
            {children}
          </main>
          <Footer />
        </div>
      </body>
      </NextIntlClientProvider>
    </html>
  );
}
