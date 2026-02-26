import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GalleryPhoto } from '../../types'
import { PhotoCard } from './PhotoCard'

interface GalleryData {
  photos: GalleryPhoto[]
}

export const GallerySection: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [selected, setSelected] = useState<GalleryPhoto | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/gallery.json`)
      .then((r) => r.json())
      .then((data: GalleryData) => setPhotos(data.photos))
      .catch((e: unknown) => console.error('Не удалось загрузить галерею:', e))
  }, [])

  // Закрыть лайтбокс: паузим видео перед unmount чтобы не было слышно звука
  const closeLightbox = useCallback(() => {
    videoRef.current?.pause()
    setSelected(null)
  }, [])

  // Закрываем лайтбокс по Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeLightbox])

  const isVideo = (p: GalleryPhoto) => p.type === 'video'

  return (
    <section
      className="w-full max-w-2xl mx-auto my-14 px-5 sm:px-6"
      aria-label="Наши моменты"
    >
      {/* Заголовок */}
      <motion.h2
        className="font-elegant text-[34px] sm:text-[42px] text-ink-brown text-center leading-tight mb-1"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Наши моменты
      </motion.h2>

      <motion.p
        className="font-handwritten text-[17px] sm:text-[18px] text-ink-blue/60 text-center mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.25 }}
      >
        которые я буду помнить всегда
      </motion.p>

      {/* Masonry-сетка */}
      <div className="photo-masonry pt-4">
        {photos.map((photo, i) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={i}
            onClick={setSelected}
          />
        ))}
      </div>

      {/* ── Лайтбокс ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeLightbox}
            aria-modal="true"
            role="dialog"
            aria-label={selected.caption}
          >
            {/* Тёмный фон */}
            <div className="absolute inset-0 bg-ink-blue/78 backdrop-blur-sm" />

            {/* Карточка-поляроид / видео-фрейм */}
            <motion.div
              className={[
                'relative w-full',
                // Видео шире чтобы удобно смотреть
                isVideo(selected) ? 'max-w-lg sm:max-w-xl' : 'max-w-sm sm:max-w-md',
                'bg-paper-white rounded-sm',
                'p-3',
                isVideo(selected) ? 'pb-4' : 'pb-7',
                'shadow-photo-hover',
              ].join(' ')}
              // Видео показывается ровно (без наклона), фото — с лёгким наклоном
              initial={{
                scale: 0.72,
                opacity: 0,
                rotate: isVideo(selected) ? 0 : selected.rotation * 2,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: isVideo(selected) ? 0 : selected.rotation * 0.4,
              }}
              exit={{
                scale: 0.72,
                opacity: 0,
                rotate: isVideo(selected) ? 0 : selected.rotation,
              }}
              transition={{ type: 'spring', duration: 0.42, bounce: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
              {/* ── Медиа-контент ── */}
              <div className="w-full overflow-hidden rounded-sm bg-black/5">
                {isVideo(selected) ? (
                  /* ── Видео-плеер ── */
                  selected.src ? (
                    <video
                      ref={videoRef}
                      src={selected.src}
                      poster={selected.poster || undefined}
                      controls
                      autoPlay
                      playsInline
                      className="w-full rounded-sm max-h-[58vh] bg-black"
                      aria-label={selected.caption}
                    />
                  ) : (
                    /* Заглушка для видео без src */
                    <div
                      className="w-full aspect-video flex flex-col items-center justify-center gap-3"
                      style={{ backgroundColor: selected.placeholderColor }}
                    >
                      <div className="w-14 h-14 rounded-full bg-paper-white/20 flex items-center justify-center">
                        <PlayFillIcon className="w-6 h-6 text-white/70 ml-0.5" />
                      </div>
                      <span className="font-handwritten text-white/60 text-xl">
                        Видео скоро будет
                      </span>
                    </div>
                  )
                ) : (
                  /* ── Фото ── */
                  selected.src ? (
                    <img
                      src={selected.src}
                      alt={selected.caption}
                      className="w-full object-contain max-h-[58vh] rounded-sm"
                    />
                  ) : (
                    /* Заглушка для фото без src */
                    <div
                      className="w-full aspect-square flex flex-col items-center justify-center gap-2"
                      style={{ backgroundColor: selected.placeholderColor }}
                    >
                      <span className="font-handwritten text-white/60 text-xl">
                        Фото скоро будет
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* Подпись */}
              <div className="mt-3 px-1 text-center">
                <p className="font-handwritten text-[18px] text-ink-dark leading-snug">
                  {selected.caption}
                </p>
                <p className="font-mono text-[11px] text-ink-brown/50 mt-1">
                  {selected.date}
                  {isVideo(selected) && (
                    <span className="ml-2 text-ink-blue/40">· видео</span>
                  )}
                </p>
              </div>

              {/* Кнопка закрытия */}
              <button
                onClick={closeLightbox}
                className={[
                  'absolute -top-3 -right-3',
                  'w-8 h-8 rounded-full',
                  'bg-ink-brown text-paper-white',
                  'flex items-center justify-center',
                  'shadow-paper',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                  'transition-transform hover:scale-110 active:scale-95',
                ].join(' ')}
                aria-label="Закрыть"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── SVG-иконки ──────────────────────────────────────────────────────────────

const PlayFillIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
)

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)
