'use client'

import React, { useState } from 'react'
import InputField from './components/InputField'
import Button from './components/Button'
import PasswordToggle from './components/PasswordToggle'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
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
  }

  return (
    <div className='w-full h-full flex items-center justify-center bg-gray-50 py-8'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-4 my-auto'>
        <h1 className='text-2xl font-semibold mb-6'>Log in to your account</h1>
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          <InputField
            label="Email"
            type="email"
            id="email"
            placeholder="Enter your email"
            onChange={handleChange}
          />

          <InputField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Enter password"
            onChange={handleChange}
            icon={
              <PasswordToggle
                show={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Button type="submit">
            Sign in
          </Button>
        </form>

        <p className='mt-4 text-center text-sm text-gray-600'>
          Dont have an account?{' '}
          <a href='#' className='text-blue-600 hover:underline'>
            Sign up now
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login