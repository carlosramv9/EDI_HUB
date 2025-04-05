'use client'

import React, { useState } from 'react'
import InputField from './components/InputField'
import Button from './components/Button'
import PasswordToggle from './components/PasswordToggle'
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/navigation'
import { useAppDispatch } from '@/app/store'
import { setCredentials } from '@/store/features/auth/authSlice'

type TranslationKey =
  | 'title'
  | 'email'
  | 'emailPlaceholder'
  | 'password'
  | 'passwordPlaceholder'
  | 'signIn'
  | 'noAccount'
  | 'signUp';

type Translations = {
  [key in TranslationKey]: string;
};

const Login = () => {
  const { toggleLanguage, isSpanish } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useAppDispatch();
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de inicio de sesión
    console.log('Form submitted:', formData)

    dispatch(setCredentials({
      user: {
        id: '1',
        email: formData.email,
        name: 'John Doe'
      },
      token: '1234567890'
    }))
  }

  const t = useTranslations("auth.login");

  return (
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

        <form onSubmit={handleSubmit} className='space-y-4'>
          <InputField
            label={t('email')}
            type="email"
            id="email"
            placeholder={t('emailPlaceholder')}
            onChange={handleChange}
          />

          <InputField
            label={t('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder={t('passwordPlaceholder')}
            onChange={handleChange}
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
  )
}
export default Login