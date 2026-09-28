import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import InsightModal from './InsightModal'
import {
  CHEAT_CODE_LABELS,
  FRUSTRATION_KEYWORDS,
  improvementOpportunities,
  interpolate,
  outcomeSummaryTemplate,
  recommendedActions,
} from '../data/qualityConstants'
import { parseTranscript } from '../utils/contactSearch'
import { loadContactDetail } from '../utils/shardLoader'
import {
  coachingCardCounts,
  formatHandlingTime,
  topCounts,
} from '../utils/qualityMatrix'

function csatTitle(band) {
  if (band === 'positive') return 'Positive CSAT'
  if (band === 'neutral') return 'Neutral CSAT'
  return 'Negative CSAT'
}

function resolutionTitle(row) {
  return row === 0 || row === 2 ? 'Resolution Achieved' : 'Resolution Not Achieved'
}

function processTitle(row) {
  return row === 0 || row === 1 ? 'Process Followed' : 'Process Not Followed'
}

function behaviourTitle(band) {
  return band === 'good' ? 'Good Behaviour' : 'Poor Behaviour'
}

function pickQuote(transcript) {
  const turns = parseTranscript(transcript)
  const memberTurns = turns.filter((t) => t.role === 'customer')
  const frustrated = memberTurns.find((t) => {
    const lower = t.text.toLowerCase()
    return FRUSTRATION_KEYWORDS.some((kw) => lower.includes(kw))
  })
  const chosen = frustrated || memberTurns[0] || turns.find((t) => t.role === 'agent') || turns[0]
  if (!chosen?.text) return null
  const text = chosen.text.trim()
  if (text.length <= 140) return text
  return `${text.slice(0, 137).trim()}...`
}

export default function MatrixCellModal({ open, onClose, cell, weekTotal }) {
  const [evidence, setEvidence] = useState([])
  const [loadingEvidence, setLoadingEvidence] = useState(false)

  const contacts = useMemo(() => cell?.contacts ?? [], [cell])
  const row = cell?.row ?? 0
  const csatBand = cell?.csatBand || 'negative'
  const behaviourBand = cell?.behaviourBand || 'poor'

  const categories = useMemo(() => topCounts(contacts, 'call_category', 4), [contacts])
  const drivers = useMemo(() => topCounts(contacts, 'call_subcategory', 4), [contacts])
  const coaching = useMemo(() => coachingCardCounts(contacts), [contacts])

  const meanQa =
    cell?.meanQa != null ? cell.meanQa.toFixed(1) : 'n/a'
  const summary = interpolate(outcomeSummaryTemplate(row, csatBand, behaviourBand), {
    pct: cell ? cell.pct.toFixed(2) : '0.00',
    count: cell?.count ?? 0,
    total: weekTotal ?? 0,
    meanQa,
    categories: categories.map((c) => `${c.value} (${c.count})`).join(', ') || 'n/a',
  })

  const improvements = improvementOpportunities(row, csatBand, behaviourBand)
  const actions = recommendedActions(row, csatBand, behaviourBand)

  useEffect(() => {
    if (!open || !cell) return undefined

    let cancelled = false
    const sample = contacts.slice(0, 4)

    async function load() {
      setLoadingEvidence(true)
      setEvidence([])
      const results = await Promise.all(
        sample.map(async (light) => {
          try {
            const full = await loadContactDetail(light)
            const quote = pickQuote(full.transcript)
            if (!quote) return null
            return {
              contact_id: light.contact_id,
              agent_name: light.agent_name,
              handling_time: light.handling_time,
              quote,
            }
          } catch {
            return null
          }
        }),
      )
      if (!cancelled) {
        setEvidence(results.filter(Boolean))
        setLoadingEvidence(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [open, cell, contacts])

  if (!cell) return null

  const title = `Diagnostic Insights: ${csatTitle(csatBand)} | ${resolutionTitle(row)} | ${processTitle(row)} (${behaviourTitle(behaviourBand)})`

  return (
    <InsightModal open={open} onClose={onClose} title={title}>
      <div className="qa-modal-stats">
        <div className="qa-modal-stat">
          <div className="qa-modal-stat-label">Percentage</div>
          <div className="qa-modal-stat-value">{cell.pct.toFixed(2)}%</div>
        </div>
        <div className="qa-modal-stat">
          <div className="qa-modal-stat-label">Calls in this cell</div>
          <div className="qa-modal-stat-value">{cell.count}</div>
        </div>
        <div className="qa-modal-stat">
          <div className="qa-modal-stat-label">Total weekly calls</div>
          <div className="qa-modal-stat-value">{weekTotal}</div>
        </div>
      </div>

      <div className="qa-inset">
        <div className="qa-inset-title">Outcome Summary</div>
        <p>{summary}</p>
      </div>

      <div className="qa-context-grid">
        <div className="qa-inset">
          <div className="qa-inset-title">Contact Types</div>
          <ul>
            {categories.length === 0 && <li>No category data</li>}
            {categories.map((c) => (
              <li key={c.value}>
                {c.value} ({c.count})
              </li>
            ))}
          </ul>
        </div>
        <div className="qa-inset">
          <div className="qa-inset-title">Contact Drivers</div>
          <ul>
            {drivers.length === 0 && <li>No driver data</li>}
            {drivers.map((c) => (
              <li key={c.value}>
                {c.value} ({c.count})
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="qa-section-label">Sampled Evidence</div>
      {loadingEvidence && <p className="insight-modal-text">Loading transcript evidence...</p>}
      {!loadingEvidence && evidence.length === 0 && (
        <p className="insight-modal-text">No transcript evidence available for this cell.</p>
      )}
      <div className="qa-evidence-list">
        {evidence.map((item) => (
          <Link
            key={item.contact_id}
            to={`/search?call=${encodeURIComponent(item.contact_id)}`}
            className="qa-evidence-card"
          >
            <div className="qa-evidence-meta">
              {item.contact_id} · {formatHandlingTime(item.handling_time)} · {item.agent_name}
            </div>
            <p className="qa-evidence-quote">&ldquo;{item.quote}&rdquo;</p>
          </Link>
        ))}
      </div>

      <div className="qa-inset">
        <div className="qa-inset-title">Improvement Opportunities</div>
        <ul>
          {improvements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="qa-actions-grid">
        <div className="qa-inset">
          <div className="qa-inset-title">Contact-Centre Actions</div>
          <ul>
            {actions.contactCentre.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="qa-inset">
          <div className="qa-inset-title">Prevention Actions</div>
          <ul>
            {actions.prevention.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {coaching.length > 0 && (
        <div className="qa-inset">
          <div className="qa-inset-title">Micro Coaching Linkage</div>
          <ul>
            {coaching.map((item) => (
              <li key={item.id}>
                {CHEAT_CODE_LABELS[item.id] || item.id} · {item.count} contact
                {item.count === 1 ? '' : 's'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </InsightModal>
  )
}
