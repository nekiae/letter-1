// ─────────────────────────────────────────────
// Тимлид (team leader)
// ─────────────────────────────────────────────
export interface Timlid {
  /** Slug для URL и имён файлов чатов: "aleksei" */
  id: string
  /** Полное имя: "Алексей Петров" */
  name: string
  /** Короткое имя для UI: "Алексей" */
  shortName: string
  /** Должность: "Тимлид направления Android" */
  role: string
  /** Инициалы для аватара-заглушки: "АП" */
  avatarInitials: string
  /** Цвет фона аватара (hex): "#1C2A48" */
  avatarColor: string
}

// ─────────────────────────────────────────────
// Сообщение в чате
// ─────────────────────────────────────────────
export type MessageSender = 'me' | 'timlid'

export interface ChatMessage {
  /** Уникальный ID: "msg-001" */
  id: string
  sender: MessageSender
  /** Текст сообщения */
  text: string
  /** ISO 8601: "2024-05-15T14:23:00" */
  timestamp: string
  /** Эмоциональные сообщения — шрифт Great Vibes, крупнее */
  isEmotional?: boolean
}

// ─────────────────────────────────────────────
// Структура файла чата: /data/chats/[id].json
// ─────────────────────────────────────────────
export interface ChatData {
  timlidId: string
  messages: ChatMessage[]
}

// ─────────────────────────────────────────────
// Группа сообщений по дате (производная, не хранится в JSON)
// Используется ChatWindow для рендера разделителей дат
// ─────────────────────────────────────────────
export interface MessageGroup {
  /** "15 мая 2024" */
  date: string
  /** "2024-05-15" — используется как React key */
  dateISO: string
  messages: ChatMessage[]
}

// ─────────────────────────────────────────────
// Фотография в галерее
// Лежит в /data/gallery.json
// ─────────────────────────────────────────────
export interface GalleryPhoto {
  /** Уникальный ID: "photo-001" */
  id: string
  /**
   * Тип медиа. По умолчанию "photo".
   * "video" — отобразит плей-кнопку в карточке и <video> в лайтбоксе.
   */
  type?: 'photo' | 'video'
  /**
   * Путь к файлу (относительно /public):
   *   фото  → "/assets/gallery/photo1.jpg"
   *   видео → "/assets/gallery/video1.mp4"
   * Оставь пустым "" — покажется цветная заглушка.
   */
  src: string
  /**
   * Только для видео: путь к обложке-превью (jpg/png).
   * Если не указана, используется цветная заглушка.
   */
  poster?: string
  /** Подпись от руки под карточкой */
  caption: string
  /** "Март 2024" — отображается мелко под подписью */
  date: string
  /** Цвет заглушки, когда src пустой: "#B8C9E0" */
  placeholderColor: string
  /** Поворот карточки в градусах: -3..3 */
  rotation: number
  /** Вертикальное соотношение сторон: "square" | "portrait" | "landscape" */
  aspect: 'square' | 'portrait' | 'landscape'
}
