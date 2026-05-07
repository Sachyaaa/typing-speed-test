import { memo } from 'react'

export const StatCard = memo(function StatCard({ label, value, tone = 'default' }) {
  const tones = {
    default: '',
    success: '',
    danger: '',
    accent: '',
  }

  const styles = {
    default: {
      borderColor: 'var(--surface-border-soft)',
      background: 'var(--surface-muted)',
      labelColor: '#334155',
      valueColor: '#020617',
    },
    success: {
      borderColor: 'rgba(16, 185, 129, 0.35)',
      background: 'rgba(16, 185, 129, 0.10)',
      labelColor: '#047857',
      valueColor: '#065f46',
    },
    danger: {
      borderColor: 'rgba(244, 63, 94, 0.35)',
      background: 'rgba(244, 63, 94, 0.10)',
      labelColor: '#be123c',
      valueColor: '#9f1239',
    },
    accent: {
      borderColor: 'var(--surface-accent-border)',
      background: 'var(--surface-accent)',
      labelColor: '#0f766e',
      valueColor: '#134e4a',
    },
  }

  return (
    <article className={`rounded-lg border px-2.5 py-1.5 ${tones[tone]}`} style={styles[tone]}>
      <p
        className="text-[10px] uppercase tracking-[0.16em] leading-none dark:text-slate-400"
        style={{ color: styles[tone].labelColor }}
      >
        {label}
      </p>
      <p
        className="mt-1 font-display text-lg font-semibold tracking-tight leading-none dark:text-white"
        style={{ color: styles[tone].valueColor }}
      >
        {value}
      </p>
    </article>
  )
})
