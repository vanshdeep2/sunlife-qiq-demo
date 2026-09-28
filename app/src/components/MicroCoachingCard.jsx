import { CARD_SHAPE_LABELS, CONTENT_TYPE_LABELS } from '../data/agentMetrics'

const KPI_LABELS = {
  csat: 'CSAT',
  fcr: 'FCR',
  aht: 'AHT',
  repeat_contact_rate: 'Repeat contacts',
}

/**
 * Agent-facing Micro Coaching card, built to the Micro Coaching Generation
 * Agent card contract.
 *
 * Field order is fixed: positive opening, coaching focus, practical guidance,
 * mini challenge, encouraging close. Short cards carry focus and guidance only.
 * Nothing here references a contact, a transcript, a QA score or any internal
 * system, by design.
 */
export default function MicroCoachingCard({ card, expanded = false, onToggle }) {
  const panelId = `mc-body-${card.cardId}`

  return (
    <article className={`mc-card${expanded ? ' mc-card-open' : ''}`}>
      <button
        type="button"
        className="mc-card-toggle"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="mc-rank">{card.priorityRank}</span>
        <div className="mc-head-text">
          <h3 className="mc-topic">{card.title}</h3>
          <div className="mc-meta">
            <span className="mc-shape">{CARD_SHAPE_LABELS[card.cardShape]}</span>
            <span className="mc-meta-sep">·</span>
            <span>{CONTENT_TYPE_LABELS[card.contentType]}</span>
            <span className="mc-meta-sep">·</span>
            <span>{Math.round(card.estimatedDurationSeconds)}s</span>
          </div>
          {card.personalNote && (
            <div className="mc-personal-note">
              <span className="mc-personal-note-label">Your numbers</span>
              <span>{card.personalNote}</span>
            </div>
          )}
        </div>
        <div className="mc-kpis">
          {card.affectedKpis.map((k) => (
            <span key={k} className="mc-kpi-chip">
              {KPI_LABELS[k] || k}
            </span>
          ))}
        </div>
        <span className="mc-card-chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      {expanded && (
        <div className="mc-card-body" id={panelId}>
          {card.positiveOpening && <p className="mc-opening">{card.positiveOpening}</p>}

          <p className="mc-focus">{card.coachingFocus}</p>

          <p className="mc-guidance">{card.practicalGuidance}</p>

          <div className="mc-challenge">
            <span className="mc-challenge-label">Try it</span>
            <span>{card.miniChallenge}</span>
          </div>

          {card.encouragingClose && <p className="mc-close">{card.encouragingClose}</p>}
        </div>
      )}
    </article>
  )
}
