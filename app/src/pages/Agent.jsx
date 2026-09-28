import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Nav from '../components/Nav'
import FlowBar from '../components/FlowBar'
import MicroCoachingCard from '../components/MicroCoachingCard'
import SparklineChart from '../components/charts/SparklineChart'
import {
  AGENT_ORDER,
  AGENTS,
  COACHING_WEEK_INDEX,
  DEFAULT_SLUG,
  TEAM_AGGREGATES,
  WK_LABELS,
} from '../data/agents'
import { CALLS_PILL, LIVE_LABEL } from '../data/executiveConstants'
import { formatAht } from '../utils/format'
import '../styles/agent.css'
import '../styles/executive.css'

const fmtCsat = (v) => v.toFixed(2)
const fmtPct = (v) => `${v.toFixed(1)}%`

/** Agent-facing KPIs only. Quality-side scoring is not surfaced here. */
function kpiTiles(agent) {
  return [
    {
      key: 'aht',
      label: 'Average Handle Time',
      value: formatAht(agent.ahtSeconds),
      series: agent.ahtSeries,
      format: formatAht,
      team: `Team ${formatAht(TEAM_AGGREGATES.ahtSeconds)}`,
      better: agent.ahtSeconds <= TEAM_AGGREGATES.ahtSeconds,
      color: '#2a4fa8',
    },
    {
      key: 'fcr',
      label: 'First Contact Resolution',
      value: fmtPct(agent.fcrPct),
      series: agent.fcrSeries,
      format: (v) => `${v}%`,
      team: `Team ${fmtPct(TEAM_AGGREGATES.fcrPct)}`,
      better: agent.fcrPct >= TEAM_AGGREGATES.fcrPct,
      color: '#1a7a4a',
    },
    {
      key: 'csat',
      label: 'CSAT',
      value: fmtCsat(agent.csat),
      series: agent.csatSeries,
      format: (v) => v.toFixed(2),
      team: `Team ${fmtCsat(TEAM_AGGREGATES.csat)}`,
      better: agent.csat >= TEAM_AGGREGATES.csat,
      color: '#d97706',
    },
  ]
}

export default function Agent() {
  const { agentSlug } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isTlMode =
    searchParams.get('from') === 'teamlead' || searchParams.get('from') === 'operations'
  const slug = agentSlug && AGENTS[agentSlug] ? agentSlug : DEFAULT_SLUG
  const agent = AGENTS[slug]

  useEffect(() => {
    if (agentSlug && !AGENTS[agentSlug]) {
      navigate(`/agent/${DEFAULT_SLUG}`, { replace: true })
    }
  }, [agentSlug, navigate])

  const pack = agent.coachingPack
  const tiles = kpiTiles(agent)
  const coachingLabel = WK_LABELS[COACHING_WEEK_INDEX]
  const packMinutes = Math.max(1, Math.round(pack.estimatedPackDurationSeconds / 60))
  const firstCardId = pack.cards[0]?.cardId

  const [openCardIds, setOpenCardIds] = useState(() =>
    firstCardId ? new Set([firstCardId]) : new Set(),
  )
  const [openCardsSlug, setOpenCardsSlug] = useState(slug)
  if (slug !== openCardsSlug) {
    setOpenCardsSlug(slug)
    setOpenCardIds(firstCardId ? new Set([firstCardId]) : new Set())
  }

  const toggleCard = (cardId) => {
    setOpenCardIds((prev) => {
      const next = new Set(prev)
      if (next.has(cardId)) next.delete(cardId)
      else next.add(cardId)
      return next
    })
  }

  const roleSelect = (
    <label className="nav-role-wrap">
      <span className="nav-role-label">Viewing as:</span>
      <select
        className="nav-role-select"
        aria-label="View role"
        value="agent"
        onChange={(e) => {
          if (e.target.value === 'operations') navigate('/operations')
        }}
      >
        <option value="agent">Agent</option>
        <option value="operations">Operations Overview</option>
      </select>
    </label>
  )

  return (
    <>
      <Nav currentPage="agent" liveLabel={LIVE_LABEL} callsPill={CALLS_PILL} navExtra={roleSelect} />
      <div className="page">
        <header className="agent-header" id={`agent-${slug}`}>
          <div className="agent-header-toolbar">
            {isTlMode ? (
              <Link to="/operations" className="back-btn">
                ← Back to Operations Overview
              </Link>
            ) : (
              <div className="agent-select-wrap">
                <select
                  className="agent-select"
                  aria-label="Select agent"
                  value={slug}
                  onChange={(e) => navigate(`/agent/${e.target.value}`)}
                >
                  {AGENT_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {AGENTS[s].name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div>
            <h1 className="agent-name">{agent.name}</h1>
            <div className="agent-meta">
              <span>{agent.role}</span>
              <span className="agent-meta-sep">·</span>
              <span>
                Team lead: <strong>{agent.team}</strong>
              </span>
              <span className="agent-meta-sep">·</span>
              <span>{agent.volume} contacts this period</span>
            </div>
          </div>
        </header>

        <div className="connector">My numbers · 5 weeks</div>
        <p className="section-sublabel">
          Your handle time, resolution rate and satisfaction score, against the team average.
        </p>
        <div className="agent-kpi-grid">
          {tiles.map((t) => (
            <div key={t.key} className="agent-kpi-card">
              <div className="agent-kpi-label">{t.label}</div>
              <div className={`agent-kpi-val ${t.better ? 'val-green' : 'val-amber'}`}>{t.value}</div>
              <div className="agent-kpi-team">
                {t.team}
                <span className={t.better ? 'agent-kpi-flag-good' : 'agent-kpi-flag-watch'}>
                  {t.better ? 'At or better' : 'Below team'}
                </span>
              </div>
              <div className="agent-kpi-chart">
                <SparklineChart
                  labels={WK_LABELS}
                  data={t.series}
                  color={t.color}
                  height={104}
                  formatValue={t.format}
                  coachingWeekLabel={coachingLabel}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="connector">Your Cheat Codes</div>
        <div className="mc-pack-head">
          <div>
            <p className="mc-pack-summary">{pack.packSummary}</p>
            <p className="mc-pack-reason">{pack.packReason}</p>
          </div>
          <div className="mc-pack-meta">
            <span className="mc-pack-count">{pack.cardCount} cards</span>
            <span className="mc-pack-time">About {packMinutes} minutes</span>
          </div>
        </div>
        <div className="mc-stack">
          {pack.cards.map((card) => (
            <MicroCoachingCard
              key={card.cardId}
              card={card}
              expanded={openCardIds.has(card.cardId)}
              onToggle={() => toggleCard(card.cardId)}
            />
          ))}
        </div>

        <FlowBar activePage="agent" />
      </div>
    </>
  )
}
