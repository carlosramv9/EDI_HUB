'use client'

import React, { useEffect, useState } from 'react'
import InputField from './components/InputField'
import { Button } from '@/components/ui/Button'
import PasswordToggle from './components/PasswordToggle'
import LoaderPage from '../../../../components/ui/LoaderPage' // Importar el nuevo componente
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslations } from 'next-intl'
import { useAppSelector } from '@/app/store'
import { useAuth } from '@/providers/Authenticate/AuthProvider'
import { useRouter } from '@/navigation'
import Head from 'next/head'
import { Metadata } from 'next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
      navigate.push('/schedules')
    }
  }, [userData])

  const { handleSubmit, login, register, errors } = useAuth();

  const { toggleLanguage, isSpanish } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)

  const processData = handleSubmit(async (data) => {
    console.log('data', data);
    const { username, password } = data

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
    <div className='w-full h-full flex flex-col items-center justify-center bg-gray-50 py-8'>
      <h1 className='text-2xl font-semibold mb-10'>EDI File Management</h1>
      <Card className="w-[400px]">
        <CardHeader>
          <h1 className='text-2xl font-semibold'>{t('title')}</h1>
          {/* <button
            onClick={toggleLanguage}
            className='px-3 py-1 text-sm border rounded-md hover:bg-gray-100'
          >
            {isSpanish ? 'EN' : 'ES'}
          </button> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={processData} className='space-y-4'>
            <InputField
              label={t('username')}
              type="text"
              id="username"
              placeholder={t('usernamePlaceholder')}
              isRequired={true}
              register={register}
              error={errors.username?.message}
            />

            <InputField
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder={t('passwordPlaceholder')}
              isRequired={true}
              register={register}
              error={errors.password?.message}
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
        </CardContent>
      </Card>
    </div >
  </>)
}
export default Login;