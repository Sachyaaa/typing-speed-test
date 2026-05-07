import { memo } from 'react'

export const ThemeToggle = memo(function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-400 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-500 dark:hover:text-white"
      aria-label="Toggle color theme"
    >
      <span className="text-base" aria-hidden="true">
        {theme === 'dark' ? '☀' : '☾'}
      </span>
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  )
})
