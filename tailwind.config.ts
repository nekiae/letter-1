import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F5EDE0',
          dark:    '#EAD9C5',
          aged:    '#DEC9A8',
          white:   '#FFFDF6',
        },
        ink: {
          blue:  '#1C2A48',
          dark:  '#2C2C2C',
          brown: '#4A2C1F',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8C97A',
          dark:    '#9A7A2E',
        },
        stamp: '#8B2020',
      },
      fontFamily: {
        handwritten: ['Caveat', 'cursive'],
        elegant:     ['"Great Vibes"', 'cursive'],
        serif:       ['"Playfair Display"', 'Georgia', 'serif'],
        mono:        ['"Courier New"', 'monospace'],
      },
      fontSize: {
        'letter': ['21px', { lineHeight: '1.9', letterSpacing: '0.01em' }],
        'letter-lg': ['23px', { lineHeight: '1.85', letterSpacing: '0.01em' }],
      },
      backgroundImage: {
        'lined-paper':
          'repeating-linear-gradient(transparent, transparent 27px, rgba(201,168,76,0.12) 28px)',
        'vignette':
          'radial-gradient(ellipse at center, transparent 55%, rgba(74,44,31,0.12) 100%)',
      },
      boxShadow: {
        'paper':       '0 2px 8px rgba(74,44,31,0.14), 0 1px 3px rgba(74,44,31,0.08)',
        'envelope':    '2px 2px 6px rgba(28,42,72,0.18)',
        'stamp':       'inset 0 0 0 2px rgba(139,32,32,0.40)',
        'photo':       '0 4px 18px rgba(74,44,31,0.18), 0 2px 6px rgba(74,44,31,0.10)',
        'photo-hover': '0 10px 32px rgba(74,44,31,0.24), 0 4px 12px rgba(74,44,31,0.14)',
        'seal':        '0 4px 20px rgba(201,168,76,0.40), inset 0 1px 2px rgba(255,255,255,0.30)',
      },
      keyframes: {
        inkDry: {
          '0%':   { opacity: '0', filter: 'blur(2px)' },
          '40%':  { opacity: '0.7', filter: 'blur(0.5px)' },
          '100%': { opacity: '1', filter: 'blur(0px)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        stampPress: {
          '0%':   { opacity: '0', transform: 'scale(1.4) rotate(-6deg)' },
          '55%':  { opacity: '0.9', transform: 'scale(0.96) rotate(-2deg)' },
          '75%':  { transform: 'scale(1.02) rotate(-2deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(-2deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':      { transform: 'translateY(-5px) rotate(0.5deg)' },
          '66%':      { transform: 'translateY(-3px) rotate(-0.5deg)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        drawLine: {
          '0%':   { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'ink-dry':     'inkDry 0.8s ease-out forwards',
        'slide-right': 'slideInRight 0.4s ease-out forwards',
        'slide-left':  'slideInLeft 0.4s ease-out forwards',
        'stamp-press': 'stampPress 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
        'float':       'float 5s ease-in-out infinite',
        'float-slow':  'float 7s ease-in-out infinite',
        'fade-up':     'fadeUp 0.7s ease-out forwards',
        'draw-line':   'drawLine 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
