import { useEffect, useRef, useState } from 'react'
import { predefinedPassages } from '../data/passages'
import { playErrorSound } from '../utils/sound'
import { compareText } from '../utils/textComparison'

const DEFAULT_TIME_LIMIT = 60
const SAVED_PASSAGES_KEY = 'typing-saved-passages'

function getSavedPassages() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const savedValue = window.localStorage.getItem(SAVED_PASSAGES_KEY)

    if (!savedValue) {
      return []
    }

    const parsedValue = JSON.parse(savedValue)

    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

function createPassageTitle(content, fallbackIndex) {
  const words = content.split(/\s+/).filter(Boolean).slice(0, 4)

  if (words.length === 0) {
    return `Custom Passage ${fallbackIndex}`
  }

  return words.join(' ').slice(0, 32)
}

export function useTypingTest() {
  const [mode, setMode] = useState('preset')
  const [selectedPassageId, setSelectedPassageId] = useState(predefinedPassages[0].id)
  const [customPassage, setCustomPassage] = useState('')
  const [savedPassages, setSavedPassages] = useState(getSavedPassages)
  const [timeLimit, setTimeLimit] = useState(DEFAULT_TIME_LIMIT)
  const [typedText, setTypedText] = useState('')
  const [status, setStatus] = useState('idle')
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_LIMIT)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const startTimestampRef = useRef(null)
  const endTimestampRef = useRef(null)
  const pausedMsRemainingRef = useRef(null)
  const passages = [...predefinedPassages, ...savedPassages]

  const selectedPassage =
    passages.find((passage) => passage.id === selectedPassageId) ?? passages[0]

  const activePassage =
    mode === 'custom' ? customPassage.trim().replace(/\s+/g, ' ') : selectedPassage.content

  const comparison = compareText(activePassage, typedText, elapsedSeconds)
  const canStart = activePassage.length > 0

  function resetTest(nextTimeLimit = timeLimit) {
    startTimestampRef.current = null
    endTimestampRef.current = null
    pausedMsRemainingRef.current = null
    setTypedText('')
    setStatus('idle')
    setElapsedSeconds(0)
    setTimeLeft(nextTimeLimit)
  }

  function pauseTest() {
    if (status !== 'running') return
    pausedMsRemainingRef.current = (endTimestampRef.current ?? 0) - Date.now()
    setStatus('paused')
  }

  function resumeTest() {
    if (status !== 'paused') return
    const remainingMs = pausedMsRemainingRef.current ?? 0
    const now = Date.now()
    startTimestampRef.current = now - (timeLimit * 1000 - remainingMs)
    endTimestampRef.current = now + remainingMs
    pausedMsRemainingRef.current = null
    setStatus('running')
  }

  function submitTest() {
    if (status !== 'running' && status !== 'paused') return
    const elapsed = startTimestampRef.current
      ? Math.min(timeLimit, Math.max(0, Math.round((Date.now() - startTimestampRef.current) / 1000)))
      : 0
    setElapsedSeconds(elapsed)
    setTimeLeft(0)
    setStatus('finished')
  }

  function handlePassageModeChange(nextMode) {
    setMode(nextMode)
    resetTest()
  }

  function handleSelectPassage(nextPassageId) {
    setSelectedPassageId(nextPassageId)
    resetTest()
  }

  function handleCustomPassageChange(nextCustomPassage) {
    setCustomPassage(nextCustomPassage)
    setMode('custom')
    resetTest()
  }

  function handleTimeLimitChange(nextTimeLimit) {
    setTimeLimit(nextTimeLimit)
    resetTest(nextTimeLimit)
  }

  function saveCustomPassage() {
    const normalizedContent = customPassage.trim().replace(/\s+/g, ' ')

    if (!normalizedContent) {
      return false
    }

    const existingPassage = passages.find((passage) => passage.content === normalizedContent)

    if (existingPassage) {
      setMode('preset')
      setSelectedPassageId(existingPassage.id)
      resetTest()
      return true
    }

    const nextSavedPassage = {
      id: `saved-${Date.now()}`,
      title: createPassageTitle(normalizedContent, savedPassages.length + 1),
      content: normalizedContent,
      isUserSaved: true,
    }

    setSavedPassages((currentPassages) => [...currentPassages, nextSavedPassage])
    setMode('preset')
    setSelectedPassageId(nextSavedPassage.id)
    setCustomPassage(normalizedContent)
    resetTest()

    return true
  }

  function startTest() {
    const now = Date.now()
    startTimestampRef.current = now
    endTimestampRef.current = now + timeLimit * 1000
    setStatus('running')
    setElapsedSeconds(0)
    setTimeLeft(timeLimit)
  }

  function handleTypedTextChange(nextValue) {
    if (!canStart || status === 'finished' || status === 'paused') {
      return
    }

    if (status === 'idle' && nextValue.length > 0) {
      startTest()
    }

    setTypedText(nextValue)

    const lastIndex = nextValue.length - 1
    if (lastIndex >= 0) {
      if (lastIndex >= activePassage.length || nextValue[lastIndex] !== activePassage[lastIndex]) {
        playErrorSound()
      }
    }

    if (activePassage.length > 0 && nextValue.length >= activePassage.length) {
      const elapsed = startTimestampRef.current
        ? Math.min(timeLimit, Math.max(0, Math.round((Date.now() - startTimestampRef.current) / 1000)))
        : 0
      setElapsedSeconds(elapsed)
      setTimeLeft(0)
      setStatus('finished')
    }
  }

  useEffect(() => {
    if (status !== 'running') {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      const remainingMilliseconds = (endTimestampRef.current ?? 0) - Date.now()

      if (remainingMilliseconds <= 0) {
        const finalElapsedSeconds = startTimestampRef.current
          ? Math.min(
              timeLimit,
              Math.max(0, Math.round((Date.now() - startTimestampRef.current) / 1000)),
            )
          : 0

        setElapsedSeconds(finalElapsedSeconds)
        setTimeLeft(0)
        setStatus('finished')
        return
      }

      const nextElapsedSeconds = Math.min(
        timeLimit,
        Math.floor((Date.now() - (startTimestampRef.current ?? Date.now())) / 1000),
      )

      setElapsedSeconds(nextElapsedSeconds)
      setTimeLeft(Math.ceil(remainingMilliseconds / 1000))
    }, 100)

    return () => window.clearInterval(intervalId)
  }, [status, timeLimit])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(SAVED_PASSAGES_KEY, JSON.stringify(savedPassages))
  }, [savedPassages])

  return {
    mode,
    status,
    timeLimit,
    timeLeft,
    elapsedSeconds,
    typedText,
    customPassage,
    selectedPassageId,
    activePassage,
    canStart,
    comparison,
    passages,
    setMode: handlePassageModeChange,
    setSelectedPassageId: handleSelectPassage,
    setCustomPassage: handleCustomPassageChange,
    setTimeLimit: handleTimeLimitChange,
    setTypedText: handleTypedTextChange,
    saveCustomPassage,
    restartTest: () => resetTest(),
    pauseTest,
    resumeTest,
    submitTest,
  }
}
