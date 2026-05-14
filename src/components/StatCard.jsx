import { memo } from 'react'

export const StatCard = memo(function StatCard({
  label,
  value,
  tone = 'default',
  emphasized = false,
}) {
  const styles = {
    default: {
      borderLight: 'rgba(99, 102, 241, 0.55)',
      bgLight: 'rgba(99, 102, 241, 0.12)',
      labelLight: '#3730a3',
      valueLight: '#1e1b4b',
      borderDark: 'rgba(99, 102, 241, 0.35)',
      bgDark: 'rgba(99, 102, 241, 0.10)',
      labelDark: '#c7d2fe',
      valueDark: '#eef2ff',
    },
    success: {
      borderLight: 'rgba(16, 185, 129, 0.55)',
      bgLight: 'rgba(16, 185, 129, 0.12)',
      labelLight: '#065f46',
      valueLight: '#022c22',
      borderDark: 'rgba(16, 185, 129, 0.35)',
      bgDark: 'rgba(16, 185, 129, 0.10)',
      labelDark: '#a7f3d0',
      valueDark: '#ecfdf5',
    },
    danger: {
      borderLight: 'rgba(244, 63, 94, 0.55)',
      bgLight: 'rgba(244, 63, 94, 0.12)',
      labelLight: '#9f1239',
      valueLight: '#881337',
      borderDark: 'rgba(244, 63, 94, 0.35)',
      bgDark: 'rgba(244, 63, 94, 0.10)',
      labelDark: '#fecdd3',
      valueDark: '#fff1f2',
    },
    accent: {
      borderLight: '#0891b2',
      bgLight: '#e0f2fe',
      labelLight: '#0e7490',
      valueLight: '#164e63',
      borderDark: 'var(--surface-accent-border)',
      bgDark: 'var(--surface-accent)',
      labelDark: '#a5f3fc',
      valueDark: '#ecfeff',
    },
    warning: {
      borderLight: 'rgba(239, 68, 68, 0.7)',
      bgLight: 'rgba(239, 68, 68, 0.14)',
      labelLight: '#991b1b',
      valueLight: '#7f1d1d',
      borderDark: 'rgba(239, 68, 68, 0.6)',
      bgDark: 'rgba(239, 68, 68, 0.16)',
      labelDark: '#fecaca',
      valueDark: '#fff1f2',
    },
  }

  const isDark =
    typeof document !== 'undefined' &&
    (document.documentElement.classList.contains('dark') ||
      document.documentElement.dataset.theme === 'dark')

  const s = styles[tone]

  return (
    <article
      className={`rounded-lg border px-2.5 py-1 ${emphasized ? 'time-warning-card' : ''}`}
      style={{
        borderColor: isDark ? s.borderDark : s.borderLight,
        background: isDark ? s.bgDark : s.bgLight,
      }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.16em] leading-none"
        style={{ color: isDark ? s.labelDark : s.labelLight }}
      >
        {label}
      </p>
      <p
        className={`mt-0.5 font-display text-base tracking-tight leading-none ${emphasized ? 'font-bold' : 'font-semibold'}`}
        style={{ color: isDark ? s.valueDark : s.valueLight }}
      >
        {value}
      </p>
    </article>
  )
})
