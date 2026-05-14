import { memo, useState } from 'react'
import { SectionCard } from './SectionCard'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export const TestHistory = memo(function TestHistory({ history, onClear }) {
  const [open, setOpen] = useState(false)

  if (history.length === 0) return null

  return (
    <SectionCard title="Test History" description={`${history.length} attempt${history.length === 1 ? '' : 's'} recorded`}>
      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-2xl border px-4 py-2.5 text-sm font-semibold transition hover:border-cyan-400"
          style={{ borderColor: 'var(--surface-border)', background: 'var(--surface-muted)', color: 'var(--page-heading)' }}
        >
          <span>{open ? 'Hide history' : 'Show history'}</span>
          <span className="text-base">{open ? '▲' : '▼'}</span>
        </button>

        {open && (
          <>
            <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--surface-border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--surface-muted)', color: 'var(--page-muted)' }}>
                    <th className="px-4 py-2.5 text-left font-semibold">#</th>
                    <th className="px-4 py-2.5 text-left font-semibold">Date</th>
                    <th className="px-4 py-2.5 text-right font-semibold">WPM</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Accuracy</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Errors</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Chars</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Time</th>
                    <th className="px-4 py-2.5 text-left font-semibold">Passage</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, i) => (
                    <tr
                      key={entry.id}
                      style={{
                        background: i % 2 === 0 ? 'var(--surface-bg)' : 'var(--surface-muted)',
                        color: 'var(--page-text)',
                      }}
                    >
                      <td className="px-4 py-2.5 font-medium" style={{ color: 'var(--page-muted)' }}>{history.length - i}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap" style={{ color: 'var(--page-muted)' }}>{formatDate(entry.date)}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-cyan-600 dark:text-cyan-400">{entry.wpm}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">{entry.accuracy}%</td>
                      <td className="px-4 py-2.5 text-right text-rose-600 dark:text-rose-400">{entry.errors}</td>
                      <td className="px-4 py-2.5 text-right">{entry.characters}</td>
                      <td className="px-4 py-2.5 text-right whitespace-nowrap">{entry.elapsedSeconds}s / {entry.timeLimit}s</td>
                      <td className="px-4 py-2.5 max-w-[12rem] truncate" title={entry.passageTitle}>{entry.passageTitle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClear}
                className="rounded-full px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                Clear history
              </button>
            </div>
          </>
        )}
      </div>
    </SectionCard>
  )
})
