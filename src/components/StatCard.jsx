import { memo } from 'react'

export const StatCard = memo(function StatCard({
  label,
  value,
  tone = 'default',
  emphasized = false,
}) {
  const styles = {
    default: {
      borderColor: 'rgba(99, 102, 241, 0.35)',
      background: 'rgba(99, 102, 241, 0.10)',
      labelColorLight: '#4338ca',
      valueColorLight: '#312e81',
      labelColorDark: '#c7d2fe',
      valueColorDark: '#eef2ff',
    },
    success: {
      borderColor: 'rgba(16, 185, 129, 0.35)',
      background: 'rgba(16, 185, 129, 0.10)',
      labelColorLight: '#047857',
      valueColorLight: '#065f46',
      labelColorDark: '#a7f3d0',
      valueColorDark: '#ecfdf5',
    },
    danger: {
      borderColor: 'rgba(244, 63, 94, 0.35)',
      background: 'rgba(244, 63, 94, 0.10)',
      labelColorLight: '#be123c',
      valueColorLight: '#9f1239',
      labelColorDark: '#fecdd3',
      valueColorDark: '#fff1f2',
    },
    accent: {
      borderColor: 'var(--surface-accent-border)',
      background: 'var(--surface-accent)',
      labelColorLight: '#0f766e',
      valueColorLight: '#134e4a',
      labelColorDark: '#a5f3fc',
      valueColorDark: '#ecfeff',
    },
    warning: {
      borderColor: 'rgba(239, 68, 68, 0.6)',
      background: 'rgba(239, 68, 68, 0.16)',
      labelColorLight: '#b91c1c',
      valueColorLight: '#7f1d1d',
      labelColorDark: '#fecaca',
      valueColorDark: '#fff1f2',
    },
  }

  const isDarkTheme =
    typeof document !== 'undefined' &&
    (document.documentElement.classList.contains('dark') ||
      document.documentElement.dataset.theme === 'dark')

  const activeStyle = styles[tone]
  const labelColor = isDarkTheme ? activeStyle.labelColorDark : activeStyle.labelColorLight
  const valueColor = isDarkTheme ? activeStyle.valueColorDark : activeStyle.valueColorLight

  return (
    <article
      className={`rounded-lg border px-2.5 py-1.5 ${emphasized ? 'time-warning-card' : ''}`}
      style={{
        borderColor: activeStyle.borderColor,
        background: activeStyle.background,
      }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.16em] leading-none"
        style={{ color: labelColor }}
      >
        {label}
      </p>
      <p
        className={`mt-1 font-display text-lg tracking-tight leading-none ${emphasized ? 'font-bold' : 'font-semibold'}`}
        style={{ color: valueColor }}
      >
        {value}
      </p>
    </article>
  )
})
