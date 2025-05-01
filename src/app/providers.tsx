'use client'

import { SidebarProvider } from '@/context/SidebarContext'
import ConfigurationProvider from '@/providers/configuration/ConfigurationProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigurationProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </ConfigurationProvider>
  )
} 