import { memo } from 'react'

export const ResultModal = memo(function ResultModal({ isOpen, results, onRestart }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/40">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Session Complete</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              Final typing results
            </h2>
          </div>
          <button
            type="button"
            onClick={onRestart}
            className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
          >
            Restart Test
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ResultMetric label="Final WPM" value={results.wpm} />
          <ResultMetric label="Accuracy" value={`${results.accuracy}%`} />
          <ResultMetric label="Mistakes" value={results.errorsCount} />
          <ResultMetric label="Correct" value={results.correctCharacters} />
          <ResultMetric label="Incorrect" value={results.incorrectCharacters} />
        </div>
      </div>
    </div>
  )
})

function ResultMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  )
}
