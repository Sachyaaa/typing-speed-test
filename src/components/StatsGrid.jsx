import { memo } from 'react'
import { StatCard } from './StatCard'

export const StatsGrid = memo(function StatsGrid({
  wpm,
  accuracy,
  totalTypedCharacters,
  errorsCount,
  completionPercentage,
  streak,
  bestStreak,
}) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-4 lg:grid-cols-7">
      <StatCard label="WPM" value={wpm} tone="accent" />
      <StatCard label="Accuracy" value={`${accuracy}%`} tone="success" />
      <StatCard label="Characters" value={totalTypedCharacters} />
      <StatCard label="Errors" value={errorsCount} tone="danger" />
      <StatCard label="Completion" value={`${completionPercentage}%`} />
      <StatCard label="Streak" value={streak} tone="accent" />
      <StatCard label="Best Streak" value={bestStreak} tone="success" />
    </div>
  )
})
