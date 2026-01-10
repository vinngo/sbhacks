'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SchedulerProvider } from '@/context/scheduler-context'
import { useState, type ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <SchedulerProvider>{children}</SchedulerProvider>
    </QueryClientProvider>
  )
}
