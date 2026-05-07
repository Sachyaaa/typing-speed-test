import { memo } from 'react'
import { SectionCard } from './SectionCard'

export const PassageDisplay = memo(function PassageDisplay({
  characters,
  extraCharacters,
  title,
  className = '',
}) {
  return (
    <SectionCard
      className={className}
      title="Reference Passage"
      description={title ? `Currently loaded: ${title}` : 'Your custom practice passage'}
    >
      <div className="workspace-panel flex-1 overflow-y-auto rounded-3xl border bg-slate-50 p-5 text-left text-lg leading-8 dark:border-white/10 dark:bg-white/5">
        {characters.length > 0 ? (
          <>
            {characters.map((character) => {
              const styles = {
                pending: 'text-slate-400 dark:text-slate-500',
                current:
                  'rounded bg-amber-300/60 text-slate-950 shadow-[0_0_0_1px_rgba(245,158,11,0.35)] dark:bg-amber-400/70',
                correct: 'text-emerald-600 dark:text-emerald-400',
                incorrect: 'rounded bg-rose-500/15 text-rose-600 dark:text-rose-300',
              }

              return (
                <span key={character.id} className={`${styles[character.status]} transition-colors`}>
                  {character.value}
                </span>
              )
            })}

            {extraCharacters.length > 0 && (
              <span className="ml-1 rounded bg-rose-500/15 px-1 text-rose-600 dark:text-rose-300">
                {extraCharacters.join('')}
              </span>
            )}
          </>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">
            Add or select a passage to begin your typing session.
          </p>
        )}
      </div>
    </SectionCard>
  )
})
