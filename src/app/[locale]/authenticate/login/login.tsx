'use client'

import React, { useEffect, useState } from 'react'
import InputField from './components/InputField'
import Button from './components/Button'
import PasswordToggle from './components/PasswordToggle'
import LoaderPage from '../../../../components/ui/LoaderPage' // Importar el nuevo componente
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslations } from 'next-intl'
import { useAppSelector } from '@/app/store'
import { useAuth } from '@/providers/Authenticate/AuthProvider'
import { useRouter } from '@/navigation'
import Head from 'next/head'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Log In "
};
const Login = () => {
  const t = useTranslations("auth.login");
  const userData = useAppSelector(state => state.auth.user)
  const loading = useAppSelector(state => state.auth.loading)
  const navigate = useRouter()

  useEffect(() => {
    if (userData) {
      // window.location.href = '/dashboard'
      navigate.push('/test')
    }
  }, [userData])

  const { handleSubmit, login, register } = useAuth();

  const { toggleLanguage, isSpanish } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)

  const processData = handleSubmit(async (data) => {
    const { username, password } = data

    console.log('username', username);
    console.log('password', password);

    await login(username, password);
  })

  if (loading) {
    return <LoaderPage />;
  }

  return (<>
    <Head>
      <title>{t('loginTitle')}</title>
      <meta name="description" content={t('description')} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className='w-full h-full flex items-center justify-center bg-gray-50 py-8'>
      <div className='max-w-md w-full px-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-semibold'>{t('title')}</h1>
          <button
            onClick={toggleLanguage}
            className='px-3 py-1 text-sm border rounded-md hover:bg-gray-100'
          >
            {isSpanish ? 'EN' : 'ES'}
          </button>
        </div>

        <form onSubmit={processData} className='space-y-4'>
          <InputField
            label={t('username')}
            type="text"
            id="username"
            placeholder={t('usernamePlaceholder')}
            register={register}
            isRequired={true}
          />

          <InputField
            label={t('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder={t('passwordPlaceholder')}
            register={register}
            isRequired={true}
            icon={
              <PasswordToggle
                show={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Button type="submit">
            {t('signIn')}
          </Button>
        </form>
      </div>
    </div>
  </>)
}
export default Login