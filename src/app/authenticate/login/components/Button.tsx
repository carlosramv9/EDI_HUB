import React from 'react'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const Button = ({ type = 'button', children, onClick, className = '' }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

export default Button 