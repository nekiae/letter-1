import React from 'react'
import { motion } from 'framer-motion'
import type { GalleryPhoto } from '../../types'

interface PhotoCardProps {
  photo: GalleryPhoto
  index: number
  onClick: (photo: GalleryPhoto) => void
}

const aspectRatios: Record<GalleryPhoto['aspect'], string> = {
  square:    'aspect-square',
  portrait:  'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, index, onClick }) => {
  const rotate = photo.rotation
  const isVideo = photo.type === 'video'

  // Что показываем как превью в карточке:
  // - видео с poster → <img poster>
  // - видео без poster но с src → <video preload="metadata"> (браузер показывает первый кадр)
  // - видео без src → цветная заглушка с play-иконкой
  // - фото с src → <img src>
  // - фото без src → цветная заглушка с camera-иконкой

  return (
    <motion.div
      className="photo-card-wrap"
      initial={{ opacity: 0, y: 20, rotate: rotate * 0.5 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.55,
        delay: (index % 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        scale: 1.04,
        rotate: rotate * 0.6,
        y: -4,
        zIndex: 10,
        transition: { duration: 0.22 },
      }}
      style={{ zIndex: 1, position: 'relative' }}
    >
      <button
        onClick={() => onClick(photo)}
        className={[
          'w-full text-left',
          'bg-paper-white rounded-sm',
          'p-2.5 pb-5 sm:p-3 sm:pb-6',
          'shadow-photo',
          'cursor-pointer',
          'transition-shadow duration-200 hover:shadow-photo-hover',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        ].join(' ')}
        aria-label={`Открыть ${isVideo ? 'видео' : 'фото'}: ${photo.caption}`}
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {/* Лента-скотч */}
        <div className="relative flex justify-center -mt-5 sm:-mt-6 mb-2 sm:mb-2.5">
          <div
            className="tape w-10 h-4 sm:w-12 sm:h-5 rounded-sm"
            style={{ transform: `rotate(${-rotate * 0.8}deg)` }}
            aria-hidden="true"
          />
        </div>

        {/* Медиа-область */}
        <div className={`${aspectRatios[photo.aspect]} w-full overflow-hidden rounded-sm relative`}>

          {/* Превью */}
          {isVideo ? (
            photo.poster ? (
              <img
                src={photo.poster}
                alt={photo.caption}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : photo.src ? (
              <video
                src={photo.src}
                preload="metadata"
                muted
                playsInline
                className="w-full h-full object-cover pointer-events-none"
                tabIndex={-1}
                onLoadedMetadata={(e) => {
                  (e.target as HTMLVideoElement).currentTime = 0.1
                }}
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-1"
                style={{ backgroundColor: photo.placeholderColor }}
              >
                <FilmIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white/50" />
                <span className="text-white/40 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest">
                  видео
                </span>
              </div>
            )
          ) : (
            photo.src ? (
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-1"
                style={{ backgroundColor: photo.placeholderColor }}
              >
                <CameraIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white/50" />
                <span className="text-white/40 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest">
                  фото
                </span>
              </div>
            )
          )}

          {/* Оверлей с кнопкой play — только для видео */}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink-blue/20 hover:bg-ink-blue/30 transition-colors duration-200">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-paper-white/80 flex items-center justify-center shadow-md">
                <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 text-ink-blue ml-0.5" />
              </div>
            </div>
          )}

          {/* Значок видео в углу */}
          {isVideo && (
            <span
              className="absolute top-1.5 right-1.5 bg-ink-blue/70 text-paper-white rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
              aria-hidden="true"
            >
              ▶ видео
            </span>
          )}
        </div>

        {/* Подпись */}
        <div className="mt-2.5 sm:mt-3 px-0.5">
          <p className="font-handwritten text-[15px] sm:text-[16px] text-ink-dark leading-tight text-center">
            {photo.caption}
          </p>
          <p className="font-mono text-[10px] sm:text-[11px] text-ink-brown/50 text-center mt-1">
            {photo.date}
          </p>
        </div>
      </button>
    </motion.div>
  )
}

// ─── Иконки ──────────────────────────────────────────────────────────────────

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
)

const FilmIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.3}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" />
    <line x1="17" y1="17" x2="22" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
  </svg>
)

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
    />
  </svg>
)
