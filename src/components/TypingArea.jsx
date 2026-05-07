import { memo } from 'react'
import { SectionCard } from './SectionCard'

export const TypingArea = memo(function TypingArea({
  value,
  disabled,
  canStart,
  status,
  textareaRef,
  onChange,
  onPasteAttempt,
  className = '',
}) {
  const placeholder = canStart
    ? 'Start typing here. Paste is disabled so the test stays fair.'
    : 'Choose a predefined passage or add your own custom text first.'

  return (
    <SectionCard
      className={className}
      title="Typing Area"
      description="Type naturally, fix mistakes with backspace, and use Escape to restart the session."
    >
      <div className="flex h-full flex-1 flex-col gap-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onPaste={onPasteAttempt}
          disabled={disabled}
          rows={8}
          spellCheck={false}
          placeholder={placeholder}
          className={`workspace-panel min-h-[32rem] flex-1 resize-none overflow-y-auto rounded-3xl border px-5 py-4 text-lg leading-8 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
            status === 'running'
              ? 'border-cyan-400 shadow-[0_0_0_4px_rgba(34,211,238,0.12)]'
              : 'border-slate-200 focus:border-cyan-400 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]'
          } disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-950`}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Shortcut: Ctrl/Cmd + Enter focuses the typing box.</span>
          <span>{status === 'running' ? 'Test in progress' : 'Ready when you are'}</span>
        </div>
      </div>
    </SectionCard>
  )
})
