import React, { useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { GallerySection } from './components/gallery/GallerySection'
import { ChatSection } from './components/chat/ChatSection'

// ═══════════════════════════════════════════════════════════════════════════
// ✏️  РЕДАКТИРУЙ ТОЛЬКО ЭТУ СЕКЦИЮ — письмо №1
// ═══════════════════════════════════════════════════════════════════════════
const LETTER = {
  // ID → имя файла public/data/chats/person-1.json
  timlidId: 'person-1',

  // Имя тимлида (в шапке и в окне чата)
  timlidName: 'Неки',

  // Обращение в шапке
  greeting: 'Мой первый и любимый тимлидер,',

  // Дата и место
  date: '26 февраля 2026',
  place: 'Национальный детский технопарк',

  // Твоя подпись
  author: 'Владик Гавнюк Неки',

  // Вступительные абзацы (каждая строка = отдельный абзац)
  intro: [
    'Если Вселенная бесконечна действительно,\nЗначит, есть куча копий нашей планеты:\nГде-то щас происходят те же события —\nКопия меня пишет копию песни этой',
    'Если Вселенная бесконечна и вправду,\nТо прямо следует из этого факта,\nЧто ты точно так же ждёшь, когда я вернусь обратно —\nГде-то там, в коридорах Технопарка',
    'То есть, не ты, конечно, а твоя копия,\nИ не меня, а мою копию, конечно —\nГде Настя Андреевна снова мой тимлид, не утопия,\nЕсли Вселенная действительно бесконечна',
  ],

  // Заключение перед подписью
  closing:
    'Мой самый любимый рыжий тимлидер.',

  // Первое слово подписи
  signature: 'Всегда твой вонючий,',
}
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// Вспомогательные компоненты
// ─────────────────────────────────────────────────────────────────────────────

/** Золотой разделитель между секциями */
const SectionDivider: React.FC = () => (
  <div className="flex items-center gap-4 max-w-xl mx-auto my-10 sm:my-14 px-6">
    <motion.div
      className="flex-1 h-px origin-left"
      style={{
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.45), transparent)',
      }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    />
    <motion.span
      className="text-gold text-base select-none"
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.4 }}
      aria-hidden="true"
    >
      ✦
    </motion.span>
    <motion.div
      className="flex-1 h-px origin-right"
      style={{
        background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.45), transparent)',
      }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    />
  </div>
)

/** Абзац письма с ink-dry анимацией */
const LetterParagraph: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => (
  <motion.p
    className="letter-text mb-5 last:mb-0"
    initial={{ opacity: 0, filter: 'blur(1.5px)', y: 8 }}
    whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
    viewport={{ once: true, margin: '-30px' }}
    transition={{ duration: 1.1, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.p>
)

/** Заставка на весь экран — нажми чтобы войти */
const SplashScreen: React.FC<{ onEnter: () => void }> = ({ onEnter }) => (
  <motion.div
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer bg-paper paper-grain"
    onClick={onEnter}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8, ease: 'easeInOut' }}
  >
    {/* Виньетка */}
    <div className="vignette absolute inset-0 pointer-events-none" />

    {/* Декор — плавающие звёзды */}
    <motion.span
      className="absolute top-10 left-12 text-gold/20 text-5xl select-none"
      animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    >✦</motion.span>
    <motion.span
      className="absolute bottom-14 right-14 text-gold/15 text-4xl select-none"
      animate={{ y: [0, 8, 0], rotate: [0, -6, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      aria-hidden="true"
    >✦</motion.span>

    {/* Центральный блок */}
    <motion.div
      className="flex flex-col items-center gap-6 select-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.2, ease: 'easeOut' }}
    >
      {/* Нота */}
      <motion.span
        className="text-gold/60 text-6xl"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        ♪
      </motion.span>

      <p className="font-elegant text-[40px] sm:text-[52px] text-ink-brown leading-none">
        Последнее личное письмо
      </p>

      {/* Золотая черта */}
      <motion.div
        className="w-16 h-px bg-gold/40"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.8 }}
      />

      {/* Кнопка */}
      <motion.div
        className="mt-2 px-8 py-3 rounded-full border border-gold/40 text-gold font-handwritten text-xl tracking-wide bg-paper-dark/20 backdrop-blur-sm"
        animate={{ boxShadow: ['0 0 0px rgba(201,168,76,0)', '0 0 18px rgba(201,168,76,0.25)', '0 0 0px rgba(201,168,76,0)'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        нажми, чтобы открыть
      </motion.div>
    </motion.div>
  </motion.div>
)

/** Маленькая плавающая кнопка паузы (после входа) */
const MusicToggle: React.FC<{ audioRef: React.RefObject<HTMLAudioElement> }> = ({ audioRef }) => {
  const [playing, setPlaying] = useState(true)

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-5 right-5 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border border-gold/30 text-gold bg-paper/80 hover:bg-paper-dark/80 transition-colors"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      title={playing ? 'Пауза' : 'Играть'}
      aria-label={playing ? 'Пауза музыки' : 'Включить музыку'}
    >
      {playing ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <rect x="3" y="2" width="4" height="12" rx="1"/>
          <rect x="9" y="2" width="4" height="12" rx="1"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 2.5l10 5.5-10 5.5V2.5z"/>
        </svg>
      )}
    </motion.button>
  )
}

/** Восковая печать внизу письма */
const WaxSeal: React.FC = () => (
  <motion.div
    className="flex flex-col items-center mt-10 cursor-default select-none"
    initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
    whileInView={{ opacity: 1, scale: 1, rotate: -4 }}
    viewport={{ once: true }}
    transition={{ type: 'spring', duration: 1.4, bounce: 0.38, delay: 0.2 }}
    whileHover={{ scale: 1.07, rotate: -2, transition: { duration: 0.2 } }}
  >
    <div
      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center shadow-seal"
      style={{
        background: 'radial-gradient(circle at 38% 36%, #E8C97A 0%, #C9A84C 45%, #9A7A2E 100%)',
      }}
    >
      <span className="font-serif text-[9px] sm:text-[10px] text-paper/90 font-bold uppercase tracking-[0.15em] text-center leading-tight px-2">
        Навсегда
      </span>
      <span className="font-serif text-[8px] sm:text-[9px] text-paper/70 uppercase tracking-wider text-center">
        в моём сердце
      </span>
      <span className="font-serif text-[11px] sm:text-[12px] text-paper font-bold mt-1 tracking-wide">
        НДТП
      </span>
      <span className="font-mono text-[9px] sm:text-[10px] text-paper/60">2026</span>
    </div>
  </motion.div>
)

// ─────────────────────────────────────────────────────────────────────────────
// Главный компонент
// ─────────────────────────────────────────────────────────────────────────────
function App() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [entered, setEntered] = useState(false)

  const handleEnter = () => {
    audioRef.current?.play().catch(() => {})
    setEntered(true)
  }

  return (
    <main className="min-h-screen bg-paper paper-grain relative">

      {/* Виньетка — лёгкое затемнение по краям */}
      <div className="vignette fixed inset-0 z-10 pointer-events-none" aria-hidden="true" />

      {/* Аудио */}
      <audio ref={audioRef} src="/music/тима музЫка - Звезда.mp3" loop preload="auto" />

      {/* Заставка */}
      <AnimatePresence>
        {!entered && <SplashScreen onEnter={handleEnter} />}
      </AnimatePresence>

      {/* Кнопка паузы (после входа) */}
      {entered && <MusicToggle audioRef={audioRef} />}

      {/* ── Шапка письма ────────────────────────────────────────────────── */}
      <header className="relative pt-12 pb-10 sm:pt-16 sm:pb-14 px-5 text-center border-b border-gold/20 bg-paper-dark/25 overflow-hidden">
        {/* Декоративные плавающие точки */}
        <motion.span
          className="absolute top-6 left-8 text-gold/25 text-4xl select-none"
          animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          ✦
        </motion.span>
        <motion.span
          className="absolute bottom-8 right-10 text-gold/20 text-3xl select-none"
          animate={{ y: [0, 6, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          aria-hidden="true"
        >
          ✦
        </motion.span>

        {/* Дата и место */}
        <motion.p
          className="font-mono text-[11px] sm:text-xs text-ink-brown/45 uppercase tracking-[0.2em] mb-5"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {LETTER.date} · {LETTER.place}
        </motion.p>

        {/* Заголовок */}
        <motion.h1
          className="font-elegant text-[48px] sm:text-[62px] md:text-[72px] text-ink-brown leading-none mb-4"
          initial={{ opacity: 0, y: 16, filter: 'blur(3px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          Последнее личное письмо
        </motion.h1>

        {/* Обращение */}
        <motion.p
          className="font-handwritten text-[24px] sm:text-[28px] text-ink-blue/70 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.65 }}
        >
          {LETTER.greeting}
        </motion.p>

        {/* Золотая черта */}
        <motion.div
          className="w-20 h-px bg-gold/50 mx-auto mt-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        />
      </header>

      {/* ── Вступление ──────────────────────────────────────────────────── */}
      <article className="max-w-xl mx-auto pt-10 pb-2 px-5 sm:px-8">
        {LETTER.intro.map((paragraph, i) => (
          <LetterParagraph key={i} delay={i * 0.15}>
            {paragraph}
          </LetterParagraph>
        ))}
      </article>

      <SectionDivider />

      {/* ── Галерея ─────────────────────────────────────────────────────── */}
      <GallerySection />

      <SectionDivider />

      {/* ── Чат ─────────────────────────────────────────────────────────── */}
      <ChatSection
        timlidId={LETTER.timlidId}
        timlidName={LETTER.timlidName}
      />

      <SectionDivider />

      {/* ── Заключение ──────────────────────────────────────────────────── */}
      <article className="max-w-xl mx-auto py-4 px-5 sm:px-8">
        <LetterParagraph>
          {LETTER.closing}
        </LetterParagraph>
      </article>

      {/* ── Подпись и печать ────────────────────────────────────────────── */}
      <footer className="max-w-xl mx-auto pt-8 pb-16 px-5 sm:px-8 text-center">
        {/* Линия перед подписью */}
        <motion.div
          className="w-14 h-px bg-ink-blue/20 mx-auto mb-6"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        />

        <motion.p
          className="font-elegant text-[32px] sm:text-[36px] text-ink-brown mb-1"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {LETTER.signature}
        </motion.p>

        <motion.p
          className="font-handwritten text-[24px] sm:text-[28px] text-ink-blue mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {LETTER.author}
        </motion.p>

        {/* Маленькая ракета */}
        <motion.span
          className="inline-block text-[28px] mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          animate={{ y: [0, -4, 0] }}
        >
          🚀
        </motion.span>

        {/* Восковая печать */}
        <WaxSeal />
      </footer>
    </main>
  )
}

export default App
