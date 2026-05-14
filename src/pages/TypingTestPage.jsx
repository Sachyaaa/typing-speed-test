import { useEffect, useRef, useState } from 'react'
import { isErrorMuted, isSuccessMuted, toggleErrorMute, toggleSuccessMute } from '../utils/sound'
import { formatTime } from '../utils/time'
import { PassageDisplay } from '../components/PassageDisplay'
import { PassageSelector } from '../components/PassageSelector'
import { ProgressBar } from '../components/ProgressBar'
import { ResultModal } from '../components/ResultModal'
import { TestHistory } from '../components/TestHistory'
import { SectionCard } from '../components/SectionCard'
import { StatsGrid } from '../components/StatsGrid'
import { TimerSelector } from '../components/TimerSelector'
import { TypingArea } from '../components/TypingArea'
import { usePersonalBest } from '../hooks/usePersonalBest'
import { useTestHistory } from '../hooks/useTestHistory'
import { useTheme } from '../hooks/useTheme'
import { useTypingTest } from '../hooks/useTypingTest'

export function TypingTestPage() {
  const textareaRef = useRef(null)
  const metricsSentinelRef = useRef(null)
  const metricsPanelRef = useRef(null)
  const [metricsStuck, setMetricsStuck] = useState(false)
  const [metricsVisible, setMetricsVisible] = useState(false)
  const [metricsCollapsed, setMetricsCollapsed] = useState(false)
  const [errorMuted, setErrorMuted] = useState(isErrorMuted)
  const [successMuted, setSuccessMuted] = useState(isSuccessMuted)
  const [fontSize, setFontSize] = useState(18)
  const minFontSize = 14
  const maxFontSize = 26
  const { history, addResult, clearHistory } = useTestHistory()
  const { best, checkAndUpdate } = usePersonalBest()
  const [newRecords, setNewRecords] = useState({ wpm: false, accuracy: false })
  const { theme, toggleTheme } = useTheme()
  const {
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
    streak,
    bestStreak,
    keyErrors,
    setMode,
    setSelectedPassageId,
    setCustomPassage,
    setTimeLimit,
    setTypedText,
    saveCustomPassage,
    restartTest,
    pauseTest,
    resumeTest,
    submitTest,
  } = useTypingTest()

  useEffect(() => {
    function handleKeyboardShortcuts(event) {
      if (event.key === 'Escape') {
        restartTest()
      }

      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault()
        textareaRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyboardShortcuts)

    return () => window.removeEventListener('keydown', handleKeyboardShortcuts)
  }, [restartTest])

  useEffect(() => {
    if (status !== 'finished') return
    addResult({
      wpm: comparison.wpm,
      accuracy: comparison.accuracy,
      errors: comparison.errorsCount,
      characters: comparison.totalTypedCharacters,
      timeLimit,
      elapsedSeconds,
      passageTitle: currentTitle,
    })
    const { newWpmRecord, newAccuracyRecord } = checkAndUpdate(comparison.wpm, comparison.accuracy)
    setNewRecords({ wpm: newWpmRecord, accuracy: newAccuracyRecord })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  useEffect(() => {
    const sentinel = metricsSentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setMetricsStuck(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const panel = metricsPanelRef.current
    if (!panel) return
    const observer = new IntersectionObserver(
      ([entry]) => setMetricsVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(panel)
    return () => observer.disconnect()
  }, [])

  function handlePasteAttempt(event) {
    event.preventDefault()
  }

  const currentTitle =
    mode === 'preset'
      ? passages.find((passage) => passage.id === selectedPassageId)?.title ?? 'Selected passage'
      : 'Custom passage'

  const hasPassage = Boolean(activePassage)
  const focusMode = status === 'running' || status === 'paused'
  const isLowTime = timeLeft > 0 && timeLeft <= Math.max(1, Math.ceil(timeLimit * 0.15))

  return (
    <main className="app-shell px-4 py-6 text-slate-900 transition-colors dark:text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="page-container">
        <header className={`hero-panel mb-6 grid gap-6 lg:mb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end focus-collapsible${focusMode ? ' is-hidden' : ''}`}>
          <div className="max-w-3xl text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-800 dark:text-cyan-300">
              React Typing Speed Test
            </p>
            <h1 className="theme-heading mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Practice faster with a cleaner, easier-to-read typing dashboard.
            </h1>
            <p className="theme-muted mt-4 max-w-2xl text-base leading-7">
              Choose a passage, set your timer, and track speed, accuracy, and
              mistakes in real time with a straightforward layout.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-self-end">
            <button
              type="button"
                onClick={() => {
                  restartTest()
                  textareaRef.current?.focus()
                }}
                className="primary-button inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
              >
                Restart
              </button>
          </div>
        </header>

        <section className="page-stack">
          <div className={`setup-grid focus-collapsible${focusMode ? ' is-hidden' : ''}`}>
            <PassageSelector
              mode={mode}
              customPassage={customPassage}
              disabled={status === 'running' || status === 'paused'}
              passages={passages}
              selectedPassageId={selectedPassageId}
              onModeChange={setMode}
              onPassageSelect={setSelectedPassageId}
              onCustomPassageChange={setCustomPassage}
              onSaveCustomPassage={saveCustomPassage}
            />

            <SectionCard
              title="How It Works"
              description="Set a passage first, then start typing in the large workspace below."
            >
              <ul className="grid gap-3 text-sm dark:text-slate-300" style={{ color: '#1e293b' }}>
                <li>Typing begins the timer automatically on the first key press.</li>
                <li>Paste is disabled inside the test textarea.</li>
                <li>Wrong characters turn red, correct characters turn green.</li>
                <li>Extra characters beyond the passage count as mistakes.</li>
              </ul>
            </SectionCard>
          </div>

          <div className={`mx-auto w-full max-w-3xl focus-collapsible${focusMode ? ' is-hidden' : ''}`}>
            <TimerSelector
              selectedTimeLimit={timeLimit}
              disabled={status === 'running' || status === 'paused'}
              onTimeLimitChange={setTimeLimit}
            />
          </div>

          <div ref={metricsSentinelRef} className="h-px" />
          <div ref={metricsPanelRef} className={`metrics-sticky${metricsStuck ? ' is-stuck' : ''}${metricsCollapsed ? ' is-collapsed' : ''}`}>
            {!metricsCollapsed && (
              <SectionCard className="metrics-shell">
                <StatsGrid
                  wpm={comparison.wpm}
                  accuracy={comparison.accuracy}
                  totalTypedCharacters={comparison.totalTypedCharacters}
                  errorsCount={comparison.errorsCount}
                  completionPercentage={comparison.completionPercentage}
                  streak={streak}
                  bestStreak={bestStreak}
                />
                <div className="metrics-progress">
                  <ProgressBar percentage={comparison.completionPercentage} />
                </div>
              </SectionCard>
            )}
          </div>


          {hasPassage ? (
            <>
              <section className="workspace-layout">
              <PassageDisplay
                className="workspace-card h-full min-h-0 lg:h-[calc(100vh-16rem)] lg:min-h-[44rem] lg:flex lg:flex-col"
                characters={comparison.highlightedCharacters}
                extraCharacters={comparison.extraCharacters}
                title={currentTitle}
                fontSize={fontSize}
              />

              <TypingArea
                className="workspace-card h-full min-h-0 lg:h-[calc(100vh-16rem)] lg:min-h-[44rem] lg:flex lg:flex-col"
                value={typedText}
                disabled={!canStart || status === 'finished' || status === 'paused'}
                canStart={canStart}
                status={status}
                textareaRef={textareaRef}
                onChange={setTypedText}
                onPasteAttempt={handlePasteAttempt}
                fontSize={fontSize}
              />
              </section>

            </>
          ) : null}

          {!activePassage && (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Add a custom passage or switch back to a predefined one before starting.
            </p>
          )}

          <div className={`focus-collapsible${focusMode ? ' is-hidden' : ''}`}>
            <TestHistory history={history} onClear={clearHistory} />
          </div>
        </section>

        <ResultModal
          isOpen={status === 'finished'}
          results={comparison}
          keyErrors={keyErrors}
          best={best}
          newRecords={newRecords}
          onRestart={() => {
            restartTest()
            setNewRecords({ wpm: false, accuracy: false })
            textareaRef.current?.focus()
          }}
        />
      </div>

      <p className="footer-credit">Created by Sachin</p>

      <div className="action-sidebar">
          {(status === 'running' || status === 'paused') && (
            <div className={`action-timer${isLowTime ? ' action-timer--warning' : ''}`}>
              <span className="action-timer-value">{formatTime(timeLeft)}</span>
            </div>
          )}
          {hasPassage && status === 'idle' && canStart && (
            <button type="button" onClick={() => textareaRef.current?.focus()} className="action-btn action-btn--cyan">
              <span className="action-btn-icon">▶</span>
              <span className="action-btn-label">Start</span>
            </button>
          )}
          {hasPassage && status === 'running' && (
            <button type="button" onClick={pauseTest} className="action-btn action-btn--amber">
              <span className="action-btn-icon">⏸</span>
              <span className="action-btn-label">Pause</span>
            </button>
          )}
          {hasPassage && status === 'paused' && (
            <button type="button" onClick={resumeTest} className="action-btn action-btn--green">
              <span className="action-btn-icon">▶</span>
              <span className="action-btn-label">Resume</span>
            </button>
          )}
          {hasPassage && (status === 'running' || status === 'paused') && (
            <button type="button" onClick={submitTest} className="action-btn action-btn--cyan">
              <span className="action-btn-icon">✓</span>
              <span className="action-btn-label">Submit</span>
            </button>
          )}
          {hasPassage && (status === 'running' || status === 'paused') && (
            <button type="button" onClick={() => { restartTest(); textareaRef.current?.focus() }} className="action-btn action-btn--slate">
              <span className="action-btn-icon">↺</span>
              <span className="action-btn-label">Restart</span>
            </button>
          )}
          {metricsVisible && (
            <>
              <div className="action-sidebar-divider" />
              <button
                type="button"
                onClick={() => setMetricsCollapsed((v) => !v)}
                className="action-btn action-btn--slate"
              >
                <span className="action-btn-icon">{metricsCollapsed ? '▤' : '▣'}</span>
                <span className="action-btn-label">{metricsCollapsed ? 'Show bar' : 'Hide bar'}</span>
              </button>
            </>
          )}
          <div className="action-sidebar-divider" />
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.min(maxFontSize, s + 1))}
            disabled={fontSize >= maxFontSize}
            className="action-btn action-btn--slate"
          >
            <span className="action-btn-icon" style={{ fontSize: '0.85rem', fontWeight: 700 }}>A+</span>
            <span className="action-btn-label">Larger</span>
          </button>
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.max(minFontSize, s - 1))}
            disabled={fontSize <= minFontSize}
            className="action-btn action-btn--slate"
          >
            <span className="action-btn-icon" style={{ fontSize: '0.7rem', fontWeight: 700 }}>A-</span>
            <span className="action-btn-label">Smaller</span>
          </button>
          <div className="action-sidebar-divider" />
          <button
            type="button"
            onClick={() => setErrorMuted(toggleErrorMute())}
            className={`action-btn ${errorMuted ? 'action-btn--slate' : 'action-btn--amber'}`}
          >
            <span className="action-btn-icon">{errorMuted ? '🔇' : '🔊'}</span>
            <span className="action-btn-label">{errorMuted ? 'Error off' : 'Error on'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSuccessMuted(toggleSuccessMute())}
            className={`action-btn ${successMuted ? 'action-btn--slate' : 'action-btn--green'}`}
          >
            <span className="action-btn-icon">{successMuted ? '🔕' : '🎵'}</span>
            <span className="action-btn-label">{successMuted ? 'Success off' : 'Success on'}</span>
          </button>
          <div className="action-sidebar-divider" />
          <button
            type="button"
            onClick={toggleTheme}
            className="action-btn action-btn--slate"
          >
            <span className="action-btn-icon">{theme === 'dark' ? '☀' : '☾'}</span>
            <span className="action-btn-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
    </main>
  )
}
