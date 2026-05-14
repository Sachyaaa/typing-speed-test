import { useState } from 'react'

const HISTORY_KEY = 'typing-test-history'
const MAX_ENTRIES = 50

function loadHistory() {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(entries) {
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries))
}

export function useTestHistory() {
  const [history, setHistory] = useState(loadHistory)

  function addResult(result) {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...result,
    }
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, MAX_ENTRIES)
      saveHistory(next)
      return next
    })
  }

  function clearHistory() {
    setHistory([])
    window.localStorage.removeItem(HISTORY_KEY)
  }

  return { history, addResult, clearHistory }
}
