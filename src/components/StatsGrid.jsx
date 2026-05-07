import { memo } from 'react'
import { formatTime } from '../utils/time'
import { StatCard } from './StatCard'

export const StatsGrid = memo(function StatsGrid({
  wpm,
  accuracy,
  totalTypedCharacters,
  errorsCount,
  timeLeft,
  completionPercentage,
}) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
      <StatCard label="WPM" value={wpm} tone="accent" />
      <StatCard label="Accuracy" value={`${accuracy}%`} tone="success" />
      <StatCard label="Characters" value={totalTypedCharacters} />
      <StatCard label="Errors" value={errorsCount} tone="danger" />
      <StatCard label="Time Left" value={formatTime(timeLeft)} />
      <StatCard label="Completion" value={`${completionPercentage}%`} />
    </div>
  )
})
