import type { ChatMessage, MessageGroup } from '../types'

/**
 * ISO-строку → русская дата: "15 мая 2024"
 */
export function formatDateRu(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * ISO-строку → время: "14:23"
 */
export function formatTimeRu(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Извлечь часть даты для группировки: "2024-05-15T14:23:00" → "2024-05-15"
 */
function getDateKey(isoString: string): string {
  return isoString.split('T')[0]!
}

/**
 * Сгруппировать сообщения по календарной дате (от старых к новым).
 * Возвращает массив групп, каждая с меткой даты и сообщениями.
 */
export function groupMessagesByDate(messages: ChatMessage[]): MessageGroup[] {
  // Сортируем от старых к новым
  const sorted = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  const groupsMap = new Map<string, MessageGroup>()

  for (const msg of sorted) {
    const key = getDateKey(msg.timestamp)
    if (!groupsMap.has(key)) {
      groupsMap.set(key, {
        date: formatDateRu(msg.timestamp),
        dateISO: key,
        messages: [],
      })
    }
    groupsMap.get(key)!.messages.push(msg)
  }

  return Array.from(groupsMap.values())
}
