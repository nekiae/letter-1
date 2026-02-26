import React from 'react'
import { motion } from 'framer-motion'

interface DateStampProps {
  label: string // "15 мая 2024"
}

/**
 * Разделитель дат в стиле почтового штампа.
 * Чуть повёрнут и оформлен как гашение почты.
 */
export const DateStamp: React.FC<DateStampProps> = ({ label }) => {
  return (
    <div className="flex items-center gap-3 my-5 px-2">
      {/* Левая линия */}
      <div className="flex-1 h-px bg-gold/30" />

      {/* Штамп */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2, rotate: -4 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
        className={[
          'px-3 py-0.5',
          'border border-stamp/50 rounded-sm',
          'text-stamp text-[11px] font-mono uppercase tracking-widest',
          '-rotate-2',
          'bg-stamp/5',
          'select-none whitespace-nowrap',
        ].join(' ')}
        aria-label={`Дата: ${label}`}
        role="separator"
      >
        {label}
      </motion.div>

      {/* Правая линия */}
      <div className="flex-1 h-px bg-gold/30" />
    </div>
  )
}
