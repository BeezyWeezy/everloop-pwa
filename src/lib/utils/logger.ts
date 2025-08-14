// Система логирования с уведомлениями
// Заменяет console.log/error/warn на красивые уведомления

import { useNotifications } from '@/context/NotificationContext'

// Типы логов
export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug'

// Интерфейс для лога
export interface LogEntry {
  level: LogLevel
  title: string
  message?: string
  data?: any
  timestamp: Date
  source?: string
}

// Хук для использования логгера
export function useLogger(source?: string) {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications()
  const isDevelopment = process.env.NODE_ENV === 'development'

  const log = (level: LogLevel, title: string, message?: string, data?: any) => {
    const entry: LogEntry = {
      level,
      title,
      message,
      data,
      timestamp: new Date(),
      source
    }

    // В разработке показываем в консоли
    if (isDevelopment) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log'
      const prefix = source ? `[${source}]` : ''
      console[consoleMethod](`${prefix} ${title}`, message || '', data || '')
    }

    // В продакшене показываем только уведомления для важных событий
    if (!isDevelopment || level === 'error' || level === 'warning') {
      switch (level) {
        case 'success':
          showSuccess(title, message)
          break
        case 'error':
          showError(title, message)
          break
        case 'warning':
          showWarning(title, message)
          break
        case 'info':
          showInfo(title, message)
          break
        case 'debug':
          if (isDevelopment) {
            showInfo(`Debug: ${title}`, message)
          }
          break
      }
    }
  }

  return {
    // Основные методы логирования
    info: (title: string, message?: string, data?: any) => log('info', title, message, data),
    success: (title: string, message?: string, data?: any) => log('success', title, message, data),
    warning: (title: string, message?: string, data?: any) => log('warning', title, message, data),
    error: (title: string, message?: string, data?: any) => log('error', title, message, data),
    debug: (title: string, message?: string, data?: any) => log('debug', title, message, data),

    // Специальные методы для API
    api: {
      success: (endpoint: string, message?: string, data?: any) => 
        log('success', `API Success: ${endpoint}`, message, data),
      
      error: (endpoint: string, error: any) => 
        log('error', `API Error: ${endpoint}`, error?.message || error?.error || 'Unknown error', error),
      
      warning: (endpoint: string, message: string, data?: any) => 
        log('warning', `API Warning: ${endpoint}`, message, data),
      
      info: (endpoint: string, message: string, data?: any) => 
        log('info', `API Info: ${endpoint}`, message, data)
    },

    // Специальные методы для валидации
    validation: {
      error: (field: string, message: string) => 
        log('error', `Validation Error: ${field}`, message),
      
      warning: (field: string, message: string) => 
        log('warning', `Validation Warning: ${field}`, message)
    },

    // Специальные методы для пользовательских действий
    user: {
      action: (action: string, details?: string) => 
        log('info', `User Action: ${action}`, details),
      
      error: (action: string, error: string) => 
        log('error', `User Error: ${action}`, error),
      
      success: (action: string, details?: string) => 
        log('success', `User Success: ${action}`, details)
    },

    // Специальные методы для доменов
    domain: {
      search: (query: string, results: number) => 
        log('info', 'Domain Search', `Found ${results} domains for "${query}"`),
      
      purchase: (domain: string, success: boolean, error?: string) => {
        if (success) {
          log('success', 'Domain Purchased', `Successfully purchased ${domain}`)
        } else {
          log('error', 'Domain Purchase Failed', error || `Failed to purchase ${domain}`)
        }
      },
      
      error: (operation: string, error: string) => 
        log('error', `Domain Error: ${operation}`, error)
    },

    // Специальные методы для PWA
    pwa: {
      created: (name: string) => 
        log('success', 'PWA Created', `Successfully created PWA: ${name}`),
      
      updated: (name: string) => 
        log('success', 'PWA Updated', `Successfully updated PWA: ${name}`),
      
      deleted: (name: string) => 
        log('warning', 'PWA Deleted', `PWA deleted: ${name}`),
      
      error: (operation: string, error: string) => 
        log('error', `PWA Error: ${operation}`, error)
    }
  }
}

// Глобальный логгер для использования вне компонентов
class GlobalLogger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  log(level: LogLevel, title: string, message?: string, data?: any) {
    if (this.isDevelopment) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log'
      console[consoleMethod](`[Global] ${title}`, message || '', data || '')
    }
  }

  info = (title: string, message?: string, data?: any) => this.log('info', title, message, data)
  success = (title: string, message?: string, data?: any) => this.log('success', title, message, data)
  warning = (title: string, message?: string, data?: any) => this.log('warning', title, message, data)
  error = (title: string, message?: string, data?: any) => this.log('error', title, message, data)
  debug = (title: string, message?: string, data?: any) => this.log('debug', title, message, data)
}

// Расширяем GlobalLogger для API методов
const baseLogger = new GlobalLogger()

export const globalLogger = {
  ...baseLogger,
  api: {
    success: (endpoint: string, message?: string, data?: any) => 
      baseLogger.success(`API Success: ${endpoint}`, message, data),
    
    error: (endpoint: string, error: any) => 
      baseLogger.error(`API Error: ${endpoint}`, error?.message || error?.error || 'Unknown error', error),
    
    warning: (endpoint: string, message: string, data?: any) => 
      baseLogger.warning(`API Warning: ${endpoint}`, message, data),
    
    info: (endpoint: string, message: string, data?: any) => 
      baseLogger.info(`API Info: ${endpoint}`, message, data)
  }
}

// Примеры использования:
/*
import { useLogger } from '@/lib/utils/logger'

function MyComponent() {
  const logger = useLogger('MyComponent')

  const handleApiCall = async () => {
    try {
      const response = await fetch('/api/data')
      const data = await response.json()
      
      if (response.ok) {
        logger.api.success('/api/data', 'Data loaded successfully', data)
        logger.user.success('Data Load', 'User data loaded')
      } else {
        logger.api.error('/api/data', data)
      }
    } catch (error) {
      logger.api.error('/api/data', error)
    }
  }

  const handleValidation = (field: string, value: string) => {
    if (!value) {
      logger.validation.error(field, 'Field is required')
    }
  }

  return <div>...</div>
}
*/
