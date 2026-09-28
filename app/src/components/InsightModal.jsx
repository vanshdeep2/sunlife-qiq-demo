import { useEffect } from 'react'

/**
 * Shared centred-modal shell for the Executive page drill-downs (driver
 * breakdown, cross-KPI pattern root cause). Same interaction pattern as
 * AgentTlModal, generalised so it isn't coupled to the Team Lead page.
 */
export default function InsightModal({ open, onClose, title, subtitle, children }) {
  useEffect(() => {
    if (!open) return undefined
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="insight-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="insight-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="insight-modal-title"
      >
        <div className="insight-modal-header">
          <div>
            <div id="insight-modal-title" className="insight-modal-title">{title}</div>
            {subtitle && <div className="insight-modal-subtitle">{subtitle}</div>}
          </div>
          <button type="button" className="insight-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="insight-modal-body">{children}</div>
      </div>
    </div>
  )
}
