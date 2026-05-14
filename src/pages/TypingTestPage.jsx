import { useEffect, useRef, useState } from 'react'
import { PassageDisplay } from '../components/PassageDisplay'
import { PassageSelector } from '../components/PassageSelector'
import { ProgressBar } from '../components/ProgressBar'
import { ResultModal } from '../components/ResultModal'
import { SectionCard } from '../components/SectionCard'
import { StatsGrid } from '../components/StatsGrid'
import { ThemeToggle } from '../components/ThemeToggle'
import { TimerSelector } from '../components/TimerSelector'
import { TypingArea } from '../components/TypingArea'
import { useTheme } from '../hooks/useTheme'
import { useTypingTest } from '../hooks/useTypingTest'

export function TypingTestPage() {
  const textareaRef = useRef(null)
  const metricsSentinelRef = useRef(null)
  const [metricsStuck, setMetricsStuck] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const {
    mode,
    status,
    timeLimit,
    timeLeft,
    typedText,
    customPassage,
    selectedPassageId,
    activePassage,
    canStart,
    comparison,
    passages,
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
    const sentinel = metricsSentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setMetricsStuck(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
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

  return (
    <main className="app-shell px-4 py-6 text-slate-900 transition-colors dark:text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="page-container">
        <header className="hero-panel mb-6 grid gap-6 lg:mb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
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
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
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
          <div className="setup-grid">
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

          <div className="mx-auto w-full max-w-3xl">
            <TimerSelector
              selectedTimeLimit={timeLimit}
              disabled={status === 'running' || status === 'paused'}
              onTimeLimitChange={setTimeLimit}
            />
          </div>

          <div ref={metricsSentinelRef} className="h-px" />
          <div className={`metrics-sticky${metricsStuck ? ' is-stuck' : ''}`}>
            <SectionCard className="metrics-shell">
              <StatsGrid
                wpm={comparison.wpm}
              accuracy={comparison.accuracy}
              totalTypedCharacters={comparison.totalTypedCharacters}
              errorsCount={comparison.errorsCount}
              timeLeft={timeLeft}
              timeLimit={timeLimit}
              completionPercentage={comparison.completionPercentage}
            />
              <div className="metrics-progress">
                <ProgressBar percentage={comparison.completionPercentage} />
              </div>
            </SectionCard>
          </div>


          {hasPassage ? (
            <>
              <section className="workspace-layout">
              <PassageDisplay
                className="workspace-card h-full min-h-0 lg:h-[calc(100vh-16rem)] lg:min-h-[44rem] lg:flex lg:flex-col"
                characters={comparison.highlightedCharacters}
                extraCharacters={comparison.extraCharacters}
                title={currentTitle}
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
              />
              </section>

            </>
          ) : null}

          {!activePassage && (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Add a custom passage or switch back to a predefined one before starting.
            </p>
          )}
        </section>

        <ResultModal
          isOpen={status === 'finished'}
          results={comparison}
          onRestart={() => {
            restartTest()
            textareaRef.current?.focus()
          }}
        />
      </div>

      <p className="footer-credit">Created by Sachin with help of Codex</p>

      {hasPassage && (
        <div className="action-sidebar">
          {status === 'idle' && canStart && (
            <button type="button" onClick={() => textareaRef.current?.focus()} className="action-btn action-btn--cyan">
              <span className="action-btn-icon">▶</span>
              <span className="action-btn-label">Start</span>
            </button>
          )}
          {status === 'running' && (
            <button type="button" onClick={pauseTest} className="action-btn action-btn--amber">
              <span className="action-btn-icon">⏸</span>
              <span className="action-btn-label">Pause</span>
            </button>
          )}
          {status === 'paused' && (
            <button type="button" onClick={resumeTest} className="action-btn action-btn--green">
              <span className="action-btn-icon">▶</span>
              <span className="action-btn-label">Resume</span>
            </button>
          )}
          {(status === 'running' || status === 'paused') && (
            <button type="button" onClick={submitTest} className="action-btn action-btn--cyan">
              <span className="action-btn-icon">✓</span>
              <span className="action-btn-label">Submit</span>
            </button>
          )}
          {(status === 'running' || status === 'paused') && (
            <button type="button" onClick={() => { restartTest(); textareaRef.current?.focus() }} className="action-btn action-btn--slate">
              <span className="action-btn-icon">↺</span>
              <span className="action-btn-label">Restart</span>
            </button>
          )}
        </div>
      )}
    </main>
  )
}
