import { useState, useEffect } from 'react'
import type { ChatData } from '../types'

interface UseChatDataResult {
  chatData: ChatData | null
  isLoading: boolean
  error: string | null
}

/**
 * Загружает файл чата для тимлида по его id.
 * JSON-файл должен лежать в public/data/chats/[timlidId].json
 */
export function useChatData(timlidId: string | null): UseChatDataResult {
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!timlidId) {
      setChatData(null)
      return
    }

    let cancelled = false

    async function loadChat() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/data/chats/${timlidId}.json`)

        if (!response.ok) {
          throw new Error(`Чат не найден: ${timlidId}`)
        }

        const data: ChatData = await response.json() as ChatData

        if (!cancelled) {
          setChatData(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Ошибка загрузки')
          setChatData(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadChat()

    // Отменяем обновление стейта если timlidId изменился до завершения запроса
    return () => {
      cancelled = true
    }
  }, [timlidId])

  return { chatData, isLoading, error }
}
