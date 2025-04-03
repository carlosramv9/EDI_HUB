import { getDictionary } from '@/lib/dictionary';

export default async function HomePage({ params: { lang } }: { params: { lang: string } }) {
  // Usamos el idioma por defecto (español)
  const dict = await getDictionary('es');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">
          {dict.common.welcome}
        </h1>
        <p className="text-lg mb-8">
          Bienvenido a EDIHub - Tu plataforma de gestión EDI
        </p>
      </div>
    </div>
  );
}
