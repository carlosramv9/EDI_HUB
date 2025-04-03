import { Inter } from 'next/font/google';
import '@/styles/globals.scss';
import Footer from '@/components/shared/Footer';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} h-full`}>
        <div className="h-full flex flex-col">         
          <main className="flex-1 h-full">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
