import { Inter } from 'next/font/google';
import '@/styles/globals.scss';
import Footer from '@/components/shared/Footer';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReduxProvider } from '@/providers/ReduxProvider';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({ children, params: { locale } }: RootLayoutProps) {
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body className={`${inter.className} h-full`}>
        <ReduxProvider>
          <NextIntlClientProvider messages={messages}>
            <div className="h-full flex flex-col">
              <main className="flex-1 h-full">
                {children}
              </main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
