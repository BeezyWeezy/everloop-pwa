// Утилиты для работы с уведомлениями
// Используйте эти функции для показа уведомлений в любом месте приложения

import { useNotifications } from '@/context/NotificationContext'

// Хук для использования уведомлений
export function useNotificationUtils() {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications()

  return {
    // Успешные операции
    success: (title: string, description?: string) => {
      showSuccess(title, description)
    },

    // Ошибки
    error: (title: string, description?: string) => {
      showError(title, description)
    },

    // Предупреждения
    warning: (title: string, description?: string) => {
      showWarning(title, description)
    },

    // Информация
    info: (title: string, description?: string) => {
      showInfo(title, description)
    },

    // Специальные уведомления для разработки
    dev: {
      // Ошибки API
      apiError: (endpoint: string, error: any) => {
        showError(
          'API Error',
          `${endpoint}: ${error?.message || error?.error || 'Unknown error'}`
        )
      },

      // Ошибки валидации
      validationError: (field: string, message: string) => {
        showError(
          'Validation Error',
          `${field}: ${message}`
        )
      },

      // Успешные операции
      apiSuccess: (operation: string, details?: string) => {
        showSuccess(
          'Success',
          `${operation}${details ? `: ${details}` : ''}`
        )
      },

      // Информация о разработке
      debug: (message: string, data?: any) => {
        if (process.env.NODE_ENV === 'development') {
          showInfo(
            'Debug Info',
            `${message}${data ? `: ${JSON.stringify(data, null, 2)}` : ''}`
          )
        }
      }
    }
  }
}

// Функции для быстрого доступа (без хука)
export const notificationUtils = {
  // Эти функции нужно использовать внутри компонентов с useNotifications
  showSuccess: (title: string, description?: string) => {
    console.warn('Use useNotificationUtils() hook instead of direct function call')
  },
  
  showError: (title: string, description?: string) => {
    console.warn('Use useNotificationUtils() hook instead of direct function call')
  },
  
  showWarning: (title: string, description?: string) => {
    console.warn('Use useNotificationUtils() hook instead of direct function call')
  },
  
  showInfo: (title: string, description?: string) => {
    console.warn('Use useNotificationUtils() hook instead of direct function call')
  }
}

// Примеры использования:
/*
import { useNotificationUtils } from '@/lib/utils/notifications'
import { useLogger } from '@/lib/utils/logger';

function MyComponent() {
  const { success, error, warning, info, dev } = useNotificationUtils()

  const handleSuccess = () => {
    success('Операция выполнена', 'Данные успешно сохранены')
  }

  const handleError = () => {
    error('Ошибка', 'Не удалось выполнить операцию')
  }

  const handleApiError = (err: any) => {
    dev.apiError('/api/users', err)
  }

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
    </div>
  )
}
*/
