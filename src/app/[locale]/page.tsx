'use client'
import { redirect } from '@/navigation';

export default function Home() {
  // const pathname = usePathname();

  redirect({
    href: '/authenticate/login',
    locale: 'en'
  });

  // {
  //   pathname.includes('/authenticate') ? (
  //     <>
  //       {children}
  //     </>
  //   ) : (
  //     <MainLayout>
  //       {children}
  //     </MainLayout>
  //   )
  // }
}
