import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AgentTlModal from '../components/AgentTlModal'
import Nav from '../components/Nav'
import DrawerShell from '../components/DrawerShell'
import FlowBar from '../components/FlowBar'
import HealthStatCard from '../components/HealthStatCard'
import KPITile from '../components/KPITile'
import LedgerTable from '../components/LedgerTable'
import SparkAgentCard from '../components/SparkAgentCard'
import SparklineChart from '../components/charts/SparklineChart'
import {
  CALLS_PILL,
  COACHING_WEEK_INDEX,
  CRITICAL_FAILURES,
  CSAT,
  KPIS,
  KPI_TILE_META,
  LIVE_LABEL,
  TREND,
  WK5,
  WK_LABELS,
} from '../data/executiveConstants'
import { SPARK_DATA, SPARK_PREVIEW_SLUGS } from '../data/agents'
import {
  CCM_HERO,
  HERO_CHIPS,
  HERO_STATS,
  getMetricsDrawerSections,
} from '../data/ccmConstants'
import {
  ALERT_AGENTS,
  COACHING_QUEUE,
  COACHING_QUEUE_SUMMARY,
  FLAGGED_CALLS,
  MATRIX_ROWS,
  TEAM_HEALTH_STATS,
} from '../data/teamleadConstants'
import { useContactIndex } from '../context/ContactIndexContext'
import { formatAht, formatVariancePct, fmtPct } from '../utils/format'
import '../styles/operations.css'
import '../styles/ccm.css'
import '../styles/teamlead.css'
import '../styles/executive.css'

const fmtCsat = (v) => v.toFixed(1)
const fmtWhole = (v) => `${v}`

const coachingPeriodStart = WK_LABELS[COACHING_WEEK_INDEX]
const coachingPeriodEnd = WK_LABELS[WK_LABELS.length - 1]

// KPI tile copy is client content (executiveConstants.KPI_TILE_META, the same
// source the Executive page uses). It used to be hardcoded here from an older
// client: "Zero since week 5" (BBB week 5 = 30 auto-fails), "Account Standing
// drag" (not a BBB driver) and "Peak ... in week 1" (Brooklinen/Kyndryl peak in
// weeks 4/3). Fallbacks keep a pack without KPI_TILE_META rendering.
const CF_META = KPI_TILE_META?.criticalFailures ?? {}
const RCR_META = KPI_TILE_META?.rcr ?? {}
const ESC_META = KPI_TILE_META?.escalation ?? {}
const QA_SPREAD = (() => {
  const qa = MATRIX_ROWS.map((r) => r.qaW5).filter((v) => typeof v === 'number')
  if (!qa.length) return null
  return { min: Math.min(...qa), max: Math.max(...qa) }
})()

const chartBandProps = {
  coachingPeriodBand: true,
  coachingPeriodStart,
  coachingPeriodEnd,
}

function DrawerTrendChart({ series, color, formatValue }) {
  return (
    <div className="drawer-chart-wrap">
      <SparklineChart
        labels={WK_LABELS}
        data={series}
        color={color}
        height={130}
        formatValue={formatValue}
        {...chartBandProps}
      />
    </div>
  )
}

export default function OperationsOverview() {
  const navigate = useNavigate()
  const { contacts } = useContactIndex()
  const [metricsDrawerOpen, setMetricsDrawerOpen] = useState(false)
  const [agentsDrawerOpen, setAgentsDrawerOpen] = useState(false)
  const [agentTlModalOpen, setAgentTlModalOpen] = useState(false)
  const [agentTlModalSlug, setAgentTlModalSlug] = useState(null)
  const drawerSections = getMetricsDrawerSections()
  const csatVsTarget = ((CSAT - KPIS.csat.target) / KPIS.csat.target) * 100

  const previewAgents = useMemo(
    () => SPARK_PREVIEW_SLUGS.map((slug) => SPARK_DATA.find((a) => a.slug === slug)).filter(Boolean),
    [],
  )

  const openAgentModal = (slug) => {
    setAgentTlModalSlug(slug)
    setAgentTlModalOpen(true)
  }

  const formatDrawerValue = (section, v) => {
    if (section.format === 'aht') return formatAht(v)
    if (section.format === 'pct') return `${Number(v).toFixed(1)}%`
    if (section.format === 'whole') return fmtWhole(v)
    if (section.format === 'csat') return fmtCsat(Number(v))
    return Number(v).toFixed(2)
  }

  const matrixRows = MATRIX_ROWS.map((row) => {
    const deltaText =
      row.deltaClass === 'delta-flat' ? '0.0' : `${row.delta > 0 ? '+' : ''}${row.delta.toFixed(1)}`
    return (
      <tr
        key={row.slug}
        className={row.contradiction ? 'matrix-contradiction' : undefined}
        onClick={() => openAgentModal(row.slug)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openAgentModal(row.slug)
          }
        }}
        role="button"
        tabIndex={0}
      >
        <td>{row.name}</td>
        <td>{row.qaW5.toFixed(1)}</td>
        <td className={row.contradiction ? 'val-red' : ''}>{row.csat.toFixed(1)}</td>
        <td>{row.behaviour.toFixed(1)}</td>
        <td className={row.deltaClass}>{deltaText}</td>
        <td>{row.pa}</td>
        <td>{row.rr}</td>
        <td>{row.topic}</td>
        <td>
          <span className={`badge ${row.badgeClass}`}>{row.status}</span>
        </td>
      </tr>
    )
  })

  return (
    <>
      <Nav currentPage="operations" liveLabel={LIVE_LABEL} callsPill={CALLS_PILL} />
      <div className="page">
        <div className="briefing-kicker">QiQ Operations Intelligence</div>
        <h1 className="briefing-title">Operations Director</h1>
        <div className="briefing-subtitle">
          5-week performance trends · Micro Coaching impact · Agent matrix · Coaching queue
        </div>

        <div className="connector">Intelligence Summary</div>
        <div className="hero">
          <div className="hero-left">
            <div className="hero-eyebrow">QiQ Operations Intelligence · Week 5 of 5</div>
            <div className="hero-headline">{CCM_HERO.headline}</div>
            <div className="hero-narrative">
              {(CCM_HERO.paragraphs ?? [{ lead: '', text: CCM_HERO.body }]).map((para) => (
                <p key={para.lead || para.text.slice(0, 40)}>
                  {para.lead ? <strong>{para.lead}</strong> : null} {para.text}
                </p>
              ))}
            </div>
            <div className="hero-chips">
              {HERO_CHIPS.map((chip) => (
                <div key={chip.text} className={`hero-chip ${chip.className}`}>
                  <span className="chip-dot" style={{ background: chip.dotColor }} />
                  {chip.text}
                </div>
              ))}
            </div>
          </div>
          <div className="hero-divider" />
          <div className="hero-right">
            <div className="hero-stats">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="hero-stat-row">
                  <span className="hero-stat-val">{stat.value}</span>
                  <span className="hero-stat-lbl">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="connector">Performance Trends · 5 Weeks</div>
        <div className="chart-section-head">
          <p className="section-sublabel">Coaching intervention period highlighted on charts.</p>
          <button type="button" className="metrics-cta" onClick={() => setMetricsDrawerOpen(true)}>
            See all metrics →
          </button>
        </div>
        <div className="chart-grid">
          <KPITile
            label="CSAT"
            value={fmtCsat(CSAT)}
            target={`Target: ${KPIS.csat.target}`}
            variance={`${formatVariancePct(csatVsTarget)} vs target`}
            varianceDirection={csatVsTarget >= 0 ? 'up' : 'down'}
            colour="amber"
            onClick={() => setMetricsDrawerOpen(true)}
            drillLabel="All metrics →"
          >
            <SparklineChart
              labels={WK5}
              data={TREND.csat}
              color="#d97706"
              formatValue={fmtCsat}
              height={140}
              {...chartBandProps}
            />
          </KPITile>
          <KPITile
            label={CF_META.label ?? 'Critical failures'}
            value={fmtWhole(CRITICAL_FAILURES.currentWeek)}
            target={CF_META.target ?? `Peak: ${CRITICAL_FAILURES.peakWeek}`}
            changeText={CF_META.changeText}
            varianceDirection={CF_META.varianceDirection}
            colour={CF_META.colour ?? 'amber'}
            onClick={() => navigate('/search?critical=true')}
            drillLabel={CF_META.drillLabel ?? 'View critical failure calls →'}
          >
            <SparklineChart
              labels={WK5}
              data={CRITICAL_FAILURES.weekly}
              color="#1a7a4a"
              formatValue={fmtWhole}
              height={140}
              {...chartBandProps}
            />
          </KPITile>
          <KPITile
            label="Repeat contact rate"
            value={fmtPct(KPIS.rcr.blended)}
            target={`Target: ${fmtPct(KPIS.rcr.target)}`}
            changeText={RCR_META.changeText ?? 'Lagging indicator'}
            colour="red"
            onClick={() => setMetricsDrawerOpen(true)}
            drillLabel="All metrics →"
          >
            <SparklineChart
              labels={WK5}
              data={TREND.rcr}
              color="#d97706"
              formatValue={(v) => `${v}%`}
              height={140}
              {...chartBandProps}
            />
          </KPITile>
          <KPITile
            label="Escalation rate"
            value={fmtPct(KPIS.escalation.blended)}
            target={`Target: ${fmtPct(KPIS.escalation.target)}`}
            changeText={ESC_META.changeText}
            colour="amber"
            onClick={() => setMetricsDrawerOpen(true)}
            drillLabel="All metrics →"
          >
            <SparklineChart
              labels={WK5}
              data={TREND.esc}
              color="#c0392b"
              formatValue={(v) => `${v}%`}
              height={140}
              {...chartBandProps}
            />
          </KPITile>
        </div>

        <div className="connector">Team Health Summary</div>
        <div className="coaching-health">
          {TEAM_HEALTH_STATS.map((stat) => (
            <HealthStatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="connector">Agent Performance Matrix · Week 5</div>
        <p className="section-sublabel">
          Ranked by critical failures.{' '}
          {QA_SPREAD
            ? `QA only spans ${QA_SPREAD.min.toFixed(1)}-${QA_SPREAD.max.toFixed(1)}% across the whole team, so the scorecard cannot separate these agents. Auto-fails and CSAT can.`
            : 'Auto-fails and CSAT separate these agents where the scorecard cannot.'}
        </p>
        <LedgerTable
          tableClassName="matrix-table"
          columns={[
            'Agent',
            'QA %',
            'CSAT',
            'Behaviour',
            'QA delta',
            'Process Adherence',
            'Resolution Rate',
            'Coaching Topic',
            'Status',
          ]}
          rows={matrixRows}
        />

        <div className="connector">Agents Needing Attention</div>
        <p className="section-sublabel">QiQ-flagged agents requiring team leader action this week</p>
        <div className="alert-agent-grid">
          {ALERT_AGENTS.map((agent) => (
            <div key={agent.slug} className="alert-agent-card">
              <div className="alert-agent-top">
                <Link to={`/agent/${agent.slug}?from=operations`} className="alert-agent-name">
                  {agent.name}
                </Link>
                <span className={`badge ${agent.badgeClass}`}>{agent.status}</span>
              </div>
              <div className="alert-agent-metrics">{agent.metrics}</div>
              <p className="alert-agent-insight">{agent.insight}</p>
              <p className="alert-agent-action">
                <strong>Recommended action:</strong> {agent.action}
              </p>
            </div>
          ))}
        </div>

        <section id="team-coaching">
          <div className="connector">Coaching Queue · Week 5</div>
          <p className="section-sublabel">Active coaching assignments with source insight and status</p>
          <LedgerTable
            columns={['Agent', 'Coaching Topic', 'Source', 'Deployed', 'Status', 'Outcome so far']}
            summary={COACHING_QUEUE_SUMMARY}
            rows={COACHING_QUEUE.map((row) => (
              <tr key={row.agent + row.topic}>
                <td>{row.agent}</td>
                <td>{row.topic}</td>
                <td>{row.source}</td>
                <td>{row.deployed}</td>
                <td>
                  <span className={`badge ${row.badgeClass}`}>{row.status}</span>
                </td>
                <td>{row.outcome}</td>
              </tr>
            ))}
          />
        </section>

        <div className="connector">Quality Score Trends · All Agents · 5 Weeks</div>
        <div className="chart-section-head">
          <p className="section-sublabel">TL priority agents shown · QA score 0-100 scale</p>
          <button type="button" className="metrics-cta" onClick={() => setAgentsDrawerOpen(true)}>
            See all agents →
          </button>
        </div>
        <div className="spark-section">
          <div className="spark-grid">
            {previewAgents.map((agent) => (
              <SparkAgentCard key={agent.slug} agent={agent} />
            ))}
          </div>
        </div>

        <section id="flagged-calls">
          <div className="connector">Contacts QiQ Wants You to Review</div>
          <p className="section-sublabel">
            Flagged continuation contacts · Click any row to open in Contact Evidence
          </p>
          <LedgerTable
            tableClassName="flagged-table"
            columns={['Contact ID', 'Agent', 'Date', 'Category', 'Flag Reason', 'QA Score']}
            rows={FLAGGED_CALLS.map((call) => (
              <tr
                key={call.callId}
                onClick={() => navigate(`/search?call=${call.callId}`)}
                role="link"
                tabIndex={0}
              >
                <td>{call.callId}</td>
                <td>{call.agent}</td>
                <td>{call.date}</td>
                <td>{call.category}</td>
                <td>
                  <span className={call.flagClass}>{call.flagReason}</span>
                </td>
                <td className={call.qaClass}>{call.qaScore}</td>
              </tr>
            ))}
          />
        </section>

        <FlowBar activePage="operations" />
      </div>

      <DrawerShell
        open={metricsDrawerOpen}
        onClose={() => setMetricsDrawerOpen(false)}
        title="Performance Trends - All Metrics"
        subtitle="5-week trends with coaching intervention period highlighted on all charts."
      >
        {drawerSections.map((section) => (
          <div key={section.id} className="drawer-section" id={section.id}>
            <div className="drawer-kpi-header">
              <div>
                <div className="drawer-section-lbl">{section.label}</div>
                <div className={`drawer-kpi-val ${section.valueClass}`}>{section.value}</div>
                <div className="drawer-kpi-sub">{section.sub}</div>
                {section.change && (
                  <div className={`drawer-kpi-chg ${section.changeClass}`}>{section.change}</div>
                )}
              </div>
              <div className="drawer-w5-badge">Week 5</div>
            </div>
            <DrawerTrendChart
              series={section.series}
              color={section.color}
              formatValue={(v) => formatDrawerValue(section, v)}
            />
            {section.alert && <div className="alert-box alert-amber">{section.alert}</div>}
            <div className="drawer-note">{section.note}</div>
          </div>
        ))}
      </DrawerShell>

      <DrawerShell
        open={agentsDrawerOpen}
        onClose={() => setAgentsDrawerOpen(false)}
        title="Quality Score Trends · All Agents"
        subtitle="5 weeks · Click an agent to open coaching view"
      >
        {SPARK_DATA.map((agent) => (
          <SparkAgentCard key={agent.slug} agent={agent} variant="drawer" />
        ))}
      </DrawerShell>

      <AgentTlModal
        open={agentTlModalOpen}
        onClose={() => {
          setAgentTlModalOpen(false)
          setAgentTlModalSlug(null)
        }}
        slug={agentTlModalSlug}
        calls={contacts}
      />
    </>
  )
}
