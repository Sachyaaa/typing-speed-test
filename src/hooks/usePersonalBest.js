import { useState } from 'react'

const PB_KEY = 'typing-personal-best'

function loadBest() {
  try {
    const raw = localStorage.getItem(PB_KEY)
    return raw ? JSON.parse(raw) : { wpm: 0, accuracy: 0 }
  } catch {
    return { wpm: 0, accuracy: 0 }
  }
}

export function usePersonalBest() {
  const [best, setBest] = useState(loadBest)

  function checkAndUpdate(wpm, accuracy) {
    const newWpmRecord = wpm > best.wpm
    const newAccuracyRecord = accuracy > best.accuracy

    if (newWpmRecord || newAccuracyRecord) {
      const next = {
        wpm: Math.max(wpm, best.wpm),
        accuracy: Math.max(accuracy, best.accuracy),
      }
      setBest(next)
      localStorage.setItem(PB_KEY, JSON.stringify(next))
    }

    return { newWpmRecord, newAccuracyRecord }
  }

  return { best, checkAndUpdate }
}
