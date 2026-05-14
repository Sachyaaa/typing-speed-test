import { memo, useState } from 'react'
import { createPortal } from 'react-dom'
import { playErrorSound } from '../utils/sound'
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
  fontSize,
}) {
  const [capsLockOn, setCapsLockOn] = useState(false)

  const placeholder = canStart
    ? 'Start typing here. Paste is disabled so the test stays fair.'
    : 'Choose a predefined passage or add your own custom text first.'

  return (
    <SectionCard
      className={className}
      title="Typing Area"
      description={
        status === 'running'
          ? 'Backspace and Delete are disabled during the test. Use Escape to restart.'
          : 'Type naturally and use Escape to restart the session.'
      }
    >
      <div className="flex h-full flex-1 flex-col gap-3">
        {capsLockOn && createPortal(
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 shadow-lg dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
            <span>⇪</span>
            <span>Caps Lock is on — this will affect your typing accuracy.</span>
          </div>,
          document.body
        )}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onPaste={(event) => {
            event.preventDefault()
            playErrorSound()
            onPasteAttempt(event)
          }}
          onKeyDown={(event) => {
            setCapsLockOn(event.getModifierState('CapsLock'))
            if (status === 'running' && (event.key === 'Backspace' || event.key === 'Delete')) {
              event.preventDefault()
              playErrorSound()
            }
          }}
          onKeyUp={(event) => {
            setCapsLockOn(event.getModifierState('CapsLock'))
          }}
          disabled={disabled}
          rows={8}
          spellCheck={false}
          placeholder={placeholder}
          style={fontSize ? { fontSize: `${fontSize}px` } : undefined}
          className={`workspace-panel typing-textarea typing-copy min-h-[32rem] flex-1 resize-none overflow-y-auto rounded-3xl border px-5 py-4 caret-black outline-none transition placeholder:text-slate-400 dark:caret-white dark:placeholder:text-slate-500 ${
            status === 'running'
              ? 'border-cyan-400 shadow-[0_0_0_4px_rgba(34,211,238,0.12)]'
              : 'border-slate-200 focus:border-cyan-400 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]'
          } disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-white/10 dark:bg-slate-900 dark:disabled:bg-slate-950`}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Shortcut: Ctrl/Cmd + Enter focuses the typing box.</span>
          <span>{status === 'running' ? 'Test in progress' : 'Ready when you are'}</span>
        </div>
      </div>
    </SectionCard>
  )
})
