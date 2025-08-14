"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Notification } from '@/components/ui/notification'

export interface NotificationItem {
  id: string
  title?: string
  description?: string
  variant: 'default' | 'success' | 'error' | 'warning' | 'info'
  autoClose?: boolean
  duration?: number
}

interface NotificationContextType {
  notifications: NotificationItem[]
  showNotification: (notification: Omit<NotificationItem, 'id'>) => void
  showSuccess: (title: string, description?: string) => void
  showError: (title: string, description?: string) => void
  showWarning: (title: string, description?: string) => void
  showInfo: (title: string, description?: string) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const showNotification = useCallback((notification: Omit<NotificationItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])
  }, [])

  const showSuccess = useCallback((title: string, description?: string) => {
    showNotification({ title, description, variant: 'success' })
  }, [showNotification])

  const showError = useCallback((title: string, description?: string) => {
    showNotification({ title, description, variant: 'error' })
  }, [showNotification])

  const showWarning = useCallback((title: string, description?: string) => {
    showNotification({ title, description, variant: 'warning' })
  }, [showNotification])

  const showInfo = useCallback((title: string, description?: string) => {
    showNotification({ title, description, variant: 'info' })
  }, [showNotification])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeNotification,
        clearAll,
      }}
    >
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            variant={notification.variant}
            title={notification.title}
            description={notification.description}
            autoClose={notification.autoClose}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
