import dynamic from 'next/dynamic';

const LoginView = dynamic(() => import('./login'), { ssr: false });

export default function Page() {
  return <LoginView />;
}