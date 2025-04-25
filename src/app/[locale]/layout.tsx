import { GeistSans } from 'geist/font/sans';
import '@/styles/globals.scss';
import Footer from '@/components/shared/Footer';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { ToastContainer } from "react-toastify";
import { AuthProvider } from '../../providers/Authenticate/AuthProvider';
import '@/services/api/axiosConfig';
import { Metadata } from 'next';
import { Providers } from '../providers';

export const metadata: Metadata = {
  title: {
    default: 'EDI HUB MANAGEMENT',
    template: '%s | EDI HUB MANAGEMENT',
  },
  description: 'EDI HUB Management',
  icons: {
    icon: '/favicon.ico',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({ children, params: { locale } }: RootLayoutProps) {
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body className={`${GeistSans.className} h-full`}>
        <ReduxProvider>
          <NextIntlClientProvider messages={messages}>
            <AuthProvider>
              <Providers>
                <div className="h-full flex flex-col">
                  <main className="flex-1">
                    {children}
                  </main>
                </div>
              </Providers>
            </AuthProvider>
          </NextIntlClientProvider>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss={false} draggable pauseOnHover />
        </ReduxProvider>
      </body>
    </html>
  );
}
