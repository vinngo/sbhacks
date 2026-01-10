'use client'

import { cn } from '@/lib/utils'
import { Wifi, WifiOff, Loader2 } from 'lucide-react'

type ConnectionStatusProps = {
  status: 'connected' | 'disconnected' | 'loading' | 'error'
  message?: string
}

export function ConnectionStatus({ status, message }: ConnectionStatusProps) {
  const statusConfig = {
    connected: {
      icon: Wifi,
      text: message || 'Calendar connected',
      className: 'text-green-600 bg-green-50',
    },
    disconnected: {
      icon: WifiOff,
      text: message || 'Calendar disconnected',
      className: 'text-muted-foreground bg-muted',
    },
    loading: {
      icon: Loader2,
      text: message || 'Connecting...',
      className: 'text-blue-600 bg-blue-50',
    },
    error: {
      icon: WifiOff,
      text: message || 'Connection error',
      className: 'text-red-600 bg-red-50',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
        config.className
      )}
    >
      <Icon
        className={cn('h-3 w-3', status === 'loading' && 'animate-spin')}
      />
      {config.text}
    </div>
  )
}
