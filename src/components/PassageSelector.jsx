import { memo } from 'react'
import { SectionCard } from './SectionCard'

export const PassageSelector = memo(function PassageSelector({
  mode,
  customPassage,
  disabled,
  passages,
  selectedPassageId,
  onModeChange,
  onPassageSelect,
  onCustomPassageChange,
  onSaveCustomPassage,
}) {
  return (
    <SectionCard
      title="Passage Setup"
      description="Choose one of the built-in passages or paste your own challenge."
    >
      <div className="grid gap-5">
        <div
          className="grid w-full grid-cols-2 rounded-2xl border p-1"
          style={{
            borderColor: 'var(--surface-border)',
            background: 'var(--surface-muted)',
          }}
        >
          {[
            { id: 'preset', label: 'Predefined passage' },
            { id: 'custom', label: 'Custom passage' },
          ].map((option) => {
            const isActive = mode === option.id

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onModeChange(option.id)}
                disabled={disabled}
                className={`rounded-[14px] px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isActive
                    ? 'shadow-sm'
                    : ''
                }`}
                style={
                  isActive
                    ? {
                        background: 'var(--page-heading)',
                        color: '#ffffff',
                      }
                    : {
                        color: 'var(--page-heading)',
                      }
                }
              >
                {option.label}
              </button>
            )
          })}
        </div>

        {mode === 'preset' ? (
          <label className="grid gap-2">
            <span className="theme-heading text-sm font-medium">Select passage</span>
            <select
              value={selectedPassageId}
              onChange={(event) => onPassageSelect(event.target.value)}
              disabled={disabled}
              className="h-12 rounded-2xl border px-4 outline-none transition focus:border-cyan-400 dark:focus:border-cyan-500"
              style={{
                borderColor: 'var(--surface-border)',
                background: 'var(--surface-bg)',
                color: 'var(--page-heading)',
              }}
            >
              {passages.map((passage) => (
                <option key={passage.id} value={passage.id}>
                  {passage.isUserSaved ? `${passage.title} (Saved)` : passage.title}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="grid gap-3">
            <label className="grid gap-2">
              <span className="theme-heading text-sm font-medium">Paste your custom passage</span>
              <textarea
                value={customPassage}
                onChange={(event) => onCustomPassageChange(event.target.value)}
                disabled={disabled}
                rows={6}
                placeholder="Paste any paragraph you want to practice with..."
                className="min-h-36 rounded-2xl border px-4 py-3 outline-none transition focus:border-cyan-400 dark:focus:border-cyan-500"
                style={{
                  borderColor: 'var(--surface-border)',
                  background: 'var(--surface-bg)',
                  color: 'var(--page-heading)',
                }}
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="theme-muted text-sm">
                Save this custom passage so it appears in your predefined list on this browser.
              </p>
              <button
                type="button"
                onClick={onSaveCustomPassage}
                disabled={disabled || !customPassage.trim()}
                className="rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: 'var(--page-heading)',
                  color: '#ffffff',
                }}
              >
                Save Passage
              </button>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  )
})
