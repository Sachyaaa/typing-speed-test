import { memo } from 'react'

export const SectionCard = memo(function SectionCard({
  title,
  description,
  children,
  className = '',
}) {
  return (
    <section className={`section-card ${className}`}>
      {(title || description) && (
        <header className="mb-4">
          {title && (
            <h2 className="theme-heading font-display text-xl font-semibold tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="theme-muted mt-1 text-sm">{description}</p>
          )}
        </header>
      )}
      {children}
    </section>
  )
})
