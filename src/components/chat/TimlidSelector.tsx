import React from 'react'
import { motion } from 'framer-motion'
import type { Timlid } from '../../types'

interface TimlidSelectorProps {
  timlids: Timlid[]
  /** ID тимлида, чей чат сейчас открыт */
  activeTimlidId: string
  /** ID тимлида, чьё письмо мы читаем — только его кнопка кликабельна */
  currentLetterTimlidId: string
  onSelect: (timlidId: string) => void
}

/**
 * Ряд кнопок-конвертиков для выбора чата.
 * Активна только кнопка текущего тимлида письма,
 * остальные — задизейблены (у других тимлидов — своя страница).
 */
export const TimlidSelector: React.FC<TimlidSelectorProps> = ({
  timlids,
  activeTimlidId,
  currentLetterTimlidId,
  onSelect,
}) => {
  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      role="group"
      aria-label="Выбор переписки"
    >
      {timlids.map((timlid, i) => {
        const isActive = timlid.id === activeTimlidId
        const isCurrentLetter = timlid.id === currentLetterTimlidId
        const isDisabled = !isCurrentLetter

        return (
          <motion.button
            key={timlid.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            onClick={() => {
              if (!isDisabled) onSelect(timlid.id)
            }}
            disabled={isDisabled}
            title={
              isDisabled
                ? `Письмо написано для ${timlid.shortName}`
                : `Открыть переписку с ${timlid.shortName}`
            }
            aria-label={`Переписка с ${timlid.name}`}
            aria-pressed={isActive}
            className={[
              'relative flex items-center justify-center gap-1.5',
              'px-3 py-1.5 rounded-sm',
              'text-xs font-handwritten',
              'transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1 focus-visible:ring-offset-paper',
              // Активный (текущий чат открыт)
              isActive
                ? 'bg-ink-blue text-paper shadow-envelope scale-[1.03]'
                : '',
              // Кликабельный, но не активный
              !isActive && isCurrentLetter
                ? 'bg-paper-dark text-ink-blue border border-gold/50 hover:border-gold hover:shadow-envelope cursor-pointer'
                : '',
              // Задизейбленный
              isDisabled
                ? 'bg-paper-dark/40 text-ink-dark/30 border border-ink-dark/10 cursor-not-allowed opacity-50'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {/* Иконка конверта */}
            <EnvelopeIcon className="w-4 h-4 shrink-0" />
            {/* Имя тимлида */}
            <span className="text-[15px] leading-none">{timlid.shortName}</span>

            {/* Золотая точка — индикатор активного */}
            {isActive && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold shadow-sm" />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

/** SVG-конверт без внешних зависимостей */
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
