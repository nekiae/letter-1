import { useState, useEffect } from 'react'

interface UseTypewriterOptions {
  text: string
  /** Миллисекунд на символ. По умолчанию 28. */
  speed?: number
  /** Задержка перед началом печати (мс). По умолчанию 0. */
  startDelay?: number
  /** false — показать текст сразу без анимации. По умолчанию true. */
  enabled?: boolean
}

export function useTypewriter({
  text,
  speed = 28,
  startDelay = 0,
  enabled = true,
}: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState(enabled ? '' : text)
  const [isDone, setIsDone] = useState(!enabled)

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text)
      setIsDone(true)
      return
    }

    setDisplayedText('')
    setIsDone(false)

    let charIndex = 0
    let startTimer: ReturnType<typeof setTimeout>
    let intervalId: ReturnType<typeof setInterval>

    startTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        charIndex++
        setDisplayedText(text.slice(0, charIndex))

        if (charIndex >= text.length) {
          clearInterval(intervalId)
          setIsDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(startTimer)
      clearInterval(intervalId)
    }
  }, [text, speed, startDelay, enabled])

  return { displayedText, isDone }
}
