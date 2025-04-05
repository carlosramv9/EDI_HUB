'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function RedirectPage() {
  const router = useRouter();
  const { locale } = useParams();

  useEffect(() => {
    // Redirigir a la página principal
    router.push(`/${locale}`);
  }, [router, locale]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirigiendo...</p>
    </div>
  );
} 