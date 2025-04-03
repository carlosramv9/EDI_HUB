import React from 'react'

interface InputFieldProps {
  label: string
  type: string
  id: string
  placeholder: string
  icon?: React.ReactNode
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputField = ({ label, type, id, placeholder, icon, onChange }: InputFieldProps) => {
  return (
    <div className='space-y-2'>
      <label htmlFor={id} className='block text-sm text-gray-600'>
        {label}
      </label>
      <div className='relative'>
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          onChange={onChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        {icon && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default InputField 