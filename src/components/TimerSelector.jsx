import { memo, useEffect, useState } from 'react'
import { SectionCard } from './SectionCard'

const TIME_OPTIONS = [
  { label: '30 sec', value: 30 },
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
]

export const TimerSelector = memo(function TimerSelector({
  selectedTimeLimit,
  disabled,
  onTimeLimitChange,
  className = '',
}) {
  const [customSeconds, setCustomSeconds] = useState(String(selectedTimeLimit))

  useEffect(() => {
    setCustomSeconds(String(selectedTimeLimit))
  }, [selectedTimeLimit])

  function applyCustomTime() {
    const parsedValue = Number(customSeconds)

    if (!Number.isFinite(parsedValue)) {
      return
    }

    const nextTimeLimit = Math.min(3600, Math.max(5, Math.round(parsedValue)))
    onTimeLimitChange(nextTimeLimit)
  }

  return (
    <SectionCard
      className={className}
      title="Time Limit"
      description="Pick a preset or set a custom timer in seconds."
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {TIME_OPTIONS.map((option) => {
            const isActive = selectedTimeLimit === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onTimeLimitChange(option.value)}
                disabled={disabled}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'shadow-sm'
                    : 'hover:border-cyan-400 hover:text-slate-950 dark:hover:border-cyan-500 dark:hover:text-white'
                } disabled:cursor-not-allowed disabled:opacity-60`}
                style={
                  isActive
                    ? {
                        borderColor: 'var(--surface-accent-border)',
                        background: 'var(--surface-accent)',
                        color: 'var(--page-heading)',
                      }
                    : {
                        borderColor: 'var(--surface-border)',
                        background: 'var(--surface-muted)',
                        color: 'var(--page-heading)',
                      }
                }
              >
                {option.label}
              </button>
            )
          })}
        </div>

        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="grid gap-2">
            <span className="theme-heading text-sm font-medium">Custom timer in seconds</span>
            <input
              type="number"
              min="5"
              max="3600"
              step="1"
              value={customSeconds}
              onChange={(event) => setCustomSeconds(event.target.value)}
              disabled={disabled}
              className="h-12 rounded-2xl border px-4 outline-none transition focus:border-cyan-400 dark:focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                borderColor: 'var(--surface-border)',
                background: 'var(--surface-bg)',
                color: 'var(--page-heading)',
              }}
              placeholder="Enter seconds"
            />
          </label>

          <button
            type="button"
            onClick={applyCustomTime}
            disabled={disabled || !customSeconds.trim()}
            className="self-end rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: 'var(--page-heading)',
              color: '#ffffff',
            }}
          >
            Apply Custom
          </button>
        </div>
      </div>
    </SectionCard>
  )
})
