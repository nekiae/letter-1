import React, { useRef, useEffect } from 'react'
import { useChatData } from '../../hooks/useChatData'
import { groupMessagesByDate } from '../../utils/chatHelpers'
import { MessageBubble } from './MessageBubble'
import { DateStamp } from './DateStamp'

interface ChatWindowProps {
  timlidId: string
  timlidName: string
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ timlidId, timlidName }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { chatData, isLoading, error } = useChatData(timlidId)
  const groups = chatData ? groupMessagesByDate(chatData.messages) : []
  const totalMessages = chatData?.messages.length ?? 0

  let globalIndex = 0

  // Прокрутить вниз после загрузки (свежие сообщения снизу)
  useEffect(() => {
    if (scrollRef.current && chatData) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatData])

  return (
    <div
      className={[
        'flex flex-col',
        // Высота: меньше на мобильном
        'h-[420px] sm:h-[500px]',
        'bg-lined-paper bg-paper paper-grain',
        'border border-gold/28 rounded-sm shadow-paper',
        'ring-1 ring-inset ring-ink-blue/5',
        'overflow-hidden',
      ].join(' ')}
    >
      {/* Шапка */}
      <div className="flex items-center justify-between px-4 py-2.5 sm:py-3 border-b border-gold/28 bg-paper-dark/55 shrink-0">
        <div className="flex items-center gap-2">
          <EnvelopeIcon className="w-4 h-4 text-ink-brown/60" />
          <h3 className="font-serif text-[13px] sm:text-sm font-semibold text-ink-brown tracking-wide">
            Переписка с {timlidName}
          </h3>
        </div>
        <span className="text-[10px] sm:text-[11px] font-mono text-ink-blue/30">
          {totalMessages} сообщений
        </span>
      </div>

      {/* Сообщения */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 chat-scroll"
      >
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <p className="font-handwritten text-[20px] text-ink-blue/45 animate-pulse">
              Перебираю письма…
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <p className="font-handwritten text-[18px] text-stamp/65 text-center px-4">
              {error}
            </p>
          </div>
        )}

        {!isLoading && !error && groups.map((group) => {
          const groupStart = globalIndex
          globalIndex += group.messages.length

          return (
            <div key={group.dateISO}>
              <DateStamp label={group.date} />
              {group.messages.map((msg, localIdx) => {
                const globalIdx = groupStart + localIdx
                // Typewriter только для последних 4 сообщений
                const shouldAnimate = globalIdx >= totalMessages - 4

                return (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    index={localIdx}
                    animate={shouldAnimate}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
)
