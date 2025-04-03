import React from 'react'
import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Copyright */}
        <div className="border-t border-gray-200 py-4">
          <p className="text-sm text-gray-600 text-center">
            © {currentYear} EDIHub. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 