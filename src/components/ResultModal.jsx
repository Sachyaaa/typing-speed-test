import { memo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { KeyboardHeatmap } from './KeyboardHeatmap'
import { ShareCard } from './ShareCard'

export const ResultModal = memo(function ResultModal({ isOpen, results, keyErrors, best, newRecords, onRestart }) {
  const shareCardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)

  if (!isOpen) return null

  const hasNewRecord = newRecords?.wpm || newRecords?.accuracy

  async function handleDownload() {
    if (!shareCardRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(shareCardRef.current, { pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `typing-result-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  async function handleCopy() {
    if (!shareCardRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(shareCardRef.current, { pixelRatio: 2 })
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/40 my-4">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-5">
          <div>
            {hasNewRecord && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {newRecords.wpm && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/15 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 border border-cyan-400/30">
                    🏆 New WPM Record!
                  </span>
                )}
                {newRecords.accuracy && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-400/30">
                    🎯 New Accuracy Record!
                  </span>
                )}
              </div>
            )}
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Session Complete</p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">Final results</h2>
          </div>
          <button
            type="button"
            onClick={onRestart}
            className="self-start rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 shrink-0"
          >
            Restart
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ResultMetric label="WPM" value={results.wpm} highlight={newRecords?.wpm} />
          <ResultMetric label="Accuracy" value={`${results.accuracy}%`} highlight={newRecords?.accuracy} />
          <ResultMetric label="Mistakes" value={results.errorsCount} />
          <ResultMetric label="Characters" value={results.totalTypedCharacters} />
        </div>

        {best?.wpm > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-xl border border-white/8 bg-white/4 px-3.5 py-2 text-xs">
            <span className="text-slate-500 uppercase tracking-widest text-[9px] font-semibold">Personal Best</span>
            <span className="font-semibold text-cyan-400">🏆 {best.wpm} WPM</span>
            <span className="font-semibold text-emerald-400">🎯 {best.accuracy}% accuracy</span>
          </div>
        )}

        <KeyboardHeatmap keyErrors={keyErrors ?? {}} />

        <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Share result</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={downloading}
              className="rounded-full border border-white/12 bg-white/6 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
            >
              Copy image
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="rounded-full bg-cyan-400 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
            >
              {downloading ? 'Saving…' : 'Download PNG'}
            </button>
          </div>
        </div>

        {/* Hidden share card — rendered off-screen for image capture only */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
          <ShareCard ref={shareCardRef} results={results} best={best} />
        </div>

      </div>
    </div>
  )
})

function ResultMetric({ label, value, highlight }) {
  return (
    <div className={`rounded-xl border p-3 ${highlight ? 'border-cyan-400/50 bg-cyan-400/10' : 'border-white/10 bg-white/5'}`}>
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className={`mt-1.5 font-display text-2xl font-semibold tracking-tight ${highlight ? 'text-cyan-300' : ''}`}>{value}</p>
    </div>
  )
}
