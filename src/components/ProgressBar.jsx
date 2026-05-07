import { memo } from 'react'

export const ProgressBar = memo(function ProgressBar({ percentage }) {
  return (
    <div className="h-1 w-full overflow-hidden bg-slate-200/80 dark:bg-white/10">
      <div
        className="h-full bg-[linear-gradient(90deg,#06b6d4,#10b981)] transition-[width] duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
})
