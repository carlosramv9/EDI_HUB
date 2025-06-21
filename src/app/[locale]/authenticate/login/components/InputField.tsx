import React from 'react'
import { UseFormRegister } from 'react-hook-form'

interface InputFieldProps {
  label: string
  type: string
  id: string
  placeholder: string
  isRequired?: boolean
  icon?: React.ReactNode
  // onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register?: UseFormRegister<any>;
  error?: string
}

const InputField = ({ label, type, id, placeholder, icon, register, isRequired = false, error, ...rest }: InputFieldProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className='space-y-2'>
      <label htmlFor={id} className='block text-sm text-gray-600'>
        {label}
      </label>
      <div className='relative'>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          {...(register ? register(id, { required: { value: isRequired, message: 'This field is required' } }) : {})}
          {...rest}
        />
        {icon && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
            {icon}
          </div>
        )}
      </div>
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  )
}

export default InputField 