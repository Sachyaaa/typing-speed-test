import { forwardRef } from 'react'

export const ShareCard = forwardRef(function ShareCard({ results, best }, ref) {
  const date = new Date().toLocaleDateString(undefined, {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div
      ref={ref}
      style={{
        width: '480px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '20px',
        padding: '32px',
        fontFamily: '"Segoe UI", sans-serif',
        color: '#e2e8f0',
        border: '1px solid rgba(255,255,255,0.08)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.28em', color: '#22d3ee', margin: 0 }}>
            React Typing Speed Test
          </p>
          <p style={{ fontSize: '22px', fontWeight: 700, margin: '6px 0 0', color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Typing Results
          </p>
        </div>
        <p style={{ fontSize: '11px', color: '#64748b', margin: 0, paddingTop: '4px' }}>{date}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: '12px', padding: '16px' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#67e8f9', margin: '0 0 6px' }}>WPM</p>
          <p style={{ fontSize: '40px', fontWeight: 800, color: '#22d3ee', margin: 0, lineHeight: 1, letterSpacing: '-0.03em' }}>{results.wpm}</p>
        </div>
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '16px' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#6ee7b7', margin: '0 0 6px' }}>Accuracy</p>
          <p style={{ fontSize: '40px', fontWeight: 800, color: '#34d399', margin: 0, lineHeight: 1, letterSpacing: '-0.03em' }}>{results.accuracy}%</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
        {[
          { label: 'Errors', value: results.errorsCount },
          { label: 'Correct', value: results.correctCharacters },
          { label: 'Chars', value: results.totalTypedCharacters },
          { label: 'Completion', value: `${results.completionPercentage}%` },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 8px', textAlign: 'center' }}>
            <p style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748b', margin: '0 0 4px' }}>{label}</p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0', margin: 0, lineHeight: 1 }}>{value}</p>
          </div>
        ))}
      </div>

      {best.wpm > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#64748b', margin: 0 }}>Personal Best</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#22d3ee' }}>🏆 {best.wpm} WPM</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399' }}>🎯 {best.accuracy}% acc</span>
          </div>
        </div>
      )}

      <p style={{ fontSize: '10px', color: '#334155', margin: 0, textAlign: 'center', letterSpacing: '0.06em' }}>
        Created with React Typing Speed Test
      </p>
    </div>
  )
})
