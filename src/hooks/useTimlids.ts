import { useState, useEffect } from 'react'
import type { Timlid } from '../types'

/**
 * Загружает список тимлидов из public/data/timlids.json
 */
export function useTimlids(): Timlid[] {
  const [timlids, setTimlids] = useState<Timlid[]>([])

  useEffect(() => {
    fetch('/data/timlids.json')
      .then((r) => r.json())
      .then((data: Timlid[]) => setTimlids(data))
      .catch((err: unknown) => {
        console.error('Не удалось загрузить список тимлидов:', err)
      })
  }, [])

  return timlids
}
