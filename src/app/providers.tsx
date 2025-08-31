'use client'

import { SidebarProvider } from '@/context/SidebarContext'
import ConfigurationProvider from '@/providers/configuration/ConfigurationProvider'
import FilterProvider from '@/providers/filters/FilterProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigurationProvider>
      <FilterProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </FilterProvider>
    </ConfigurationProvider>
  )
} 