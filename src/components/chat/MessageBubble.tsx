import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { ChatMessage } from '../../types'
import { formatTimeRu } from '../../utils/chatHelpers'
import { useTypewriter } from '../../hooks/useTypewriter'

interface MessageBubbleProps {
  message: ChatMessage
  index: number
  animate?: boolean
  scrollTrigger?: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  index,
  animate = false,
  scrollTrigger = false,
}) => {
  const isMe = message.sender === 'me'
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })

  const isActive = scrollTrigger ? inView : true

  const { displayedText, isDone } = useTypewriter({
    text: message.text,
    speed: 20,
    startDelay: animate ? index * 100 : 0,
    enabled: scrollTrigger ? inView : animate,
  })

  const slideVariants = {
    hidden: {
      opacity: 0,
      x: isMe ? 14 : -14,
      filter: 'blur(1.5px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.32,
        delay: animate ? index * 0.06 : 0,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={`flex mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}
      variants={slideVariants}
      initial="hidden"
      animate={scrollTrigger ? (inView ? 'visible' : 'hidden') : 'visible'}
    >
      <div
        className={[
          'relative max-w-[78%] sm:max-w-[70%] px-4 py-3',
          'rounded-2xl shadow-paper',
          isMe
            ? 'bg-paper-dark border border-ink-blue/15 text-ink-blue rounded-tr-sm'
            : 'bg-paper-white border border-ink-dark/12 text-ink-dark rounded-tl-sm',
        ].join(' ')}
      >
        {/* Текст */}
        <p
          className={
            message.isEmotional
              ? 'font-elegant text-[24px] sm:text-[26px] leading-relaxed tracking-wide text-ink-brown'
              : 'font-handwritten text-[19px] sm:text-[20px] leading-[1.55]'
          }
        >
          {displayedText}
          {(animate || scrollTrigger) && !isDone && isActive && (
            <span
              aria-hidden="true"
              className="inline-block w-[2px] h-[0.9em] bg-current opacity-60 animate-pulse ml-0.5 align-middle"
            />
          )}
        </p>

        {/* Время */}
        <span
          className={`block mt-1.5 text-[11px] font-mono opacity-35 ${
            isMe ? 'text-right' : 'text-left'
          }`}
        >
          {formatTimeRu(message.timestamp)}
        </span>

        {/* Хвостик пузыря */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '14px',
            width: 0,
            height: 0,
            borderTop: '7px solid transparent',
            borderBottom: '7px solid transparent',
            ...(isMe
              ? { right: '-6px', borderLeft: '7px solid #EAD9C5' }
              : { left: '-6px', borderRight: '7px solid #FFFDF6' }),
          }}
        />
      </div>
    </motion.div>
  )
}
