import { memo } from 'react'

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

const ROW_OFFSETS = ['0%', '5%', '12%']

function keyStyle(count) {
  if (!count) return { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', color: '#64748b' }
  if (count <= 2) return { bg: 'rgba(251,191,36,0.22)', border: 'rgba(251,191,36,0.55)', color: '#fbbf24' }
  if (count <= 5) return { bg: 'rgba(249,115,22,0.28)', border: 'rgba(249,115,22,0.65)', color: '#fb923c' }
  return { bg: 'rgba(239,68,68,0.35)', border: 'rgba(239,68,68,0.75)', color: '#f87171' }
}

export const KeyboardHeatmap = memo(function KeyboardHeatmap({ keyErrors }) {
  const totalErrors = Object.values(keyErrors).reduce((a, b) => a + b, 0)
  if (totalErrors === 0) return null

  const spaceErrors = keyErrors[' '] || 0
  const spaceStyle = keyStyle(spaceErrors)

  return (
    <div className="mt-6">
      <p className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-400">Key error heatmap</p>
      <div className="flex flex-col gap-1.5">
        {ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1.5" style={{ paddingLeft: ROW_OFFSETS[rowIdx] }}>
            {row.map((key) => {
              const count = keyErrors[key] || 0
              const s = keyStyle(count)
              return (
                <div
                  key={key}
                  title={count ? `${key.toUpperCase()}: ${count} error${count === 1 ? '' : 's'}` : key.toUpperCase()}
                  style={{ background: s.bg, borderColor: s.border, color: s.color }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold uppercase"
                >
                  {key}
                  {count > 0 && (
                    <span className="ml-0.5 text-[9px] leading-none opacity-80">{count}</span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
        <div className="flex gap-1.5" style={{ paddingLeft: '19%' }}>
          <div
            title={spaceErrors ? `Space: ${spaceErrors} error${spaceErrors === 1 ? '' : 's'}` : 'Space'}
            style={{ background: spaceStyle.bg, borderColor: spaceStyle.border, color: spaceStyle.color }}
            className="flex h-9 w-44 items-center justify-center rounded-lg border text-xs font-semibold"
          >
            space{spaceErrors > 0 ? ` (${spaceErrors})` : ''}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-white/12 bg-white/6 inline-block" />
          No errors
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border border-amber-400/55 bg-amber-400/22" />
          1–2
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border border-orange-400/65 bg-orange-400/28" />
          3–5
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border border-rose-400/75 bg-rose-400/35" />
          6+
        </span>
      </div>
    </div>
  )
})
