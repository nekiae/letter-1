import React from 'react'
import { motion } from 'framer-motion'
import { useChatData } from '../../hooks/useChatData'
import { groupMessagesByDate } from '../../utils/chatHelpers'
import { MessageBubble } from './MessageBubble'
import { DateStamp } from './DateStamp'

interface ChatSectionProps {
  timlidId: string
  timlidName: string
}

/**
 * Секция переписки — полноценный поток сообщений в общем UI.
 * Каждое сообщение появляется с typewriter-эффектом по мере скролла.
 */
export const ChatSection: React.FC<ChatSectionProps> = ({ timlidId, timlidName }) => {
  const { chatData, isLoading, error } = useChatData(timlidId)
  const groups = chatData ? groupMessagesByDate(chatData.messages) : []

  return (
    <section
      className="w-full max-w-2xl mx-auto my-14 px-5 sm:px-6"
      aria-label="Переписка"
    >
      {/* Заголовок */}
      <motion.h2
        className="font-elegant text-[34px] sm:text-[42px] text-ink-brown text-center leading-tight mb-1"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Я часто перечитываю наши сообщения…
      </motion.h2>

      <motion.p
        className="font-handwritten text-[17px] sm:text-[18px] text-ink-blue/60 text-center mb-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.25 }}
      >
        и каждый раз улыбаюсь
      </motion.p>

      <motion.p
        className="font-serif text-[11px] sm:text-xs text-ink-brown/40 text-center uppercase tracking-[0.2em] mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.45 }}
      >
        Переписка с {timlidName}
      </motion.p>

      {/* Состояние загрузки */}
      {isLoading && (
        <p className="font-handwritten text-[20px] text-ink-blue/45 text-center animate-pulse">
          Перебираю письма…
        </p>
      )}

      {error && (
        <p className="font-handwritten text-[18px] text-stamp/65 text-center px-4">
          {error}
        </p>
      )}

      {/* Поток сообщений */}
      {!isLoading && !error && groups.map((group) => (
        <div key={group.dateISO}>
          <DateStamp label={group.date} />
          {group.messages.map((msg, localIdx) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              index={localIdx}
              animate={false}
              scrollTrigger
            />
          ))}
        </div>
      ))}
    </section>
  )
}
