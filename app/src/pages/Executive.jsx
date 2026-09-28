import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import ProvenanceBadge from '../components/ProvenanceBadge'
import FlowBar from '../components/FlowBar'
import KPITile from '../components/KPITile'
import NBACard from '../components/NBACard'
import MemberLtvSection from '../components/MemberLtvSection'
import InsightModal from '../components/InsightModal'
import HealthScoreRing from '../components/charts/HealthScoreRing'
import SparklineChart from '../components/charts/SparklineChart'
import { LTV_ASSUMPTION_FIELDS, LTV_DEFAULT_ASSUMPTION_TEXT } from '../data/ltvCopy'
import { BRAND, NOUNS_CAP } from '../config/brand'
import {
  BRIEFING_TITLE,
  CALLS_PILL,
  COACHING_WEEK_INDEX,
  CONTINUATION_CSAT_RECOVERY,
  CRITICAL_FAILURES,
  CROSS_KPI_PATTERNS,
  CSAT,
  DEFAULTS,
  DRIVER_ROWS,
  EXTRACT_NOTE,
  HERO_CHIPS,
  HERO_CONTENT,
  KPIS,
  KPI_TILE_META,
  LIVE_LABEL,
  METRIC_ROOT_CAUSE,
  OVERALL_QA_PCT,
  PERIOD_LABEL,
  QUALITY_OUTCOME_MATRIX,
  TREND,
  WK5,
} from '../data/executiveConstants'
import {
  ACTION_BOARD_COLUMNS,
  ACTION_DETAILS,
  COMBINED_VOC_ISSUES,
  EXTERNAL_VOC,
  EXTERNAL_VOC_STRIP,
  INTERNAL_VOC_STRIP,
} from '../data/vocConstants'
import { computeLtvFinancials, LTV_DEFAULTS } from '../utils/ltvFinancial'
import { LTV_LABELS } from '../utils/ltvLabels'
import {
  computeHealthScore,
  healthArcColor,
  healthBandLabel,
  healthStatusColor,
} from '../utils/healthScore'
import { driverSignal, fcrClass } from '../utils/drivers'
import { formatAht, formatVariancePct, fmtNum, fmtPct } from '../utils/format'
import '../styles/executive.css'

const fmtCsat = (v) => v.toFixed(1)
const fmtWhole = (v) => `${v}`

/** Config for the centred metric drill-down modal, keyed by KPI tile. Root cause and
 * drivers are explanatory copy for the demo narrative, built from the same category
 * and coaching data used elsewhere on the page, not separately sourced figures. */
function useMetricConfigs() {
  return {
    csat: {
      title: 'CSAT', value: fmtCsat(CSAT), target: `Target: ${KPIS.csat.target}`,
      data: TREND.csat, color: '#c0392b', formatValue: fmtCsat, higherIsBetter: true,
      ...METRIC_ROOT_CAUSE.csat,
    },
    rcr: {
      title: 'Repeat Contact Rate', value: fmtPct(KPIS.rcr.blended), target: `Target: ${fmtPct(KPIS.rcr.target)}`,
      data: TREND.rcr, color: '#d97706', formatValue: (v) => `${v}%`, higherIsBetter: false,
      ...METRIC_ROOT_CAUSE.rcr,
    },
    escalation: {
      title: 'Escalation Rate', value: fmtPct(KPIS.escalation.blended), target: `Target: ${fmtPct(KPIS.escalation.target)}`,
      data: TREND.esc, color: '#c0392b', formatValue: (v) => `${v}%`, higherIsBetter: false,
      ...METRIC_ROOT_CAUSE.escalation,
    },
    aht: {
      title: 'Average Handle Time', value: formatAht(KPIS.aht.blended), target: `Target: ${formatAht(DEFAULTS.targetAht)}`,
      data: TREND.aht, color: '#2a4fa8', formatValue: formatAht, higherIsBetter: false,
      ...METRIC_ROOT_CAUSE.aht,
    },
    fcr: {
      title: 'First Contact Resolution', value: `${KPIS.fcr.blended}%`, target: `Target: ${KPIS.fcr.target}%`,
      data: TREND.fcr, color: '#1a7a4a', formatValue: (v) => `${v}%`, higherIsBetter: true,
      ...METRIC_ROOT_CAUSE.fcr,
    },
    transfer: {
      title: 'Transfer Rate', value: `${KPIS.transfer.blended}%`, target: `Target: ${KPIS.transfer.target}%`,
      data: TREND.transfer, color: '#d97706', formatValue: (v) => `${v}%`, higherIsBetter: false,
      ...METRIC_ROOT_CAUSE.transfer,
    },
    nps: {
      title: 'NPS', value: fmtWhole(KPIS.nps.blended), target: `Target: ${KPIS.nps.target}`,
      data: TREND.nps, color: '#2a4fa8', formatValue: fmtWhole, higherIsBetter: true,
      ...METRIC_ROOT_CAUSE.nps,
    },
  }
}

function MetricDrillModal({ metricKey, onClose }) {
  const configs = useMetricConfigs()
  const cfg = metricKey ? configs[metricKey] : null
  if (!cfg) return null

  const targetNum = parseFloat(String(cfg.target).replace(/[^\d.-]/g, ''))
  const currentNum = parseFloat(String(cfg.value).replace(/[^\d.-]/g, ''))
  const variancePct =
    Number.isFinite(targetNum) && targetNum !== 0 && Number.isFinite(currentNum)
      ? ((currentNum - targetNum) / targetNum) * 100
      : null
  const isGood = variancePct == null ? true : cfg.higherIsBetter ? variancePct >= 0 : variancePct <= 0
  const badgeCls = isGood ? 'val-green' : 'val-red'

  return (
    <InsightModal open={Boolean(metricKey)} onClose={onClose} title={cfg.title} subtitle="5-week period · actual vs target">
      <div className="drawer-kpi-header">
        <div>
          <div className="insight-modal-section-label" style={{ marginTop: 0 }}>Current value</div>
          <div className={`drawer-kpi-val ${badgeCls}`}>{cfg.value}</div>
          <div className="drawer-kpi-sub">{cfg.target}</div>
        </div>
        {variancePct != null && (
          <div className={`drawer-w5-badge ${badgeCls}`}>{formatVariancePct(variancePct)} vs target</div>
        )}
      </div>

      <div className="insight-modal-section-label">Root cause analysis</div>
      <p className="insight-modal-text">{cfg.rootCause}</p>

      <div className="insight-modal-section-label">5-week trend</div>
      <div className="insight-modal-chart">
        <SparklineChart
          labels={WK5}
          data={cfg.data}
          color={cfg.color}
          height={150}
          formatValue={cfg.formatValue}
          coachingWeekLabel={WK5[COACHING_WEEK_INDEX]}
        />
      </div>

      <div className="insight-modal-section-label">Performance drivers</div>
      <div className="table-wrap">
        <table className="insight-modal-drivers-table">
          <thead>
            <tr>
              <th>Driver</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {cfg.drivers.map((d) => (
              <tr key={d.a}>
                <td className="insight-modal-drivers-name">{d.a}</td>
                <td>{d.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InsightModal>
  )
}

/**
 * Assumption inputs are client data (including which fields exist at all - a
 * one-sided client has no supply-side rows), so the list comes from
 * data/ltvCopy.js rather than being enumerated here.
 */
const LTV_FIELDS = LTV_ASSUMPTION_FIELDS

function LtvSettingsModal({ open, onClose, draft, onChange, onRecalculate, onReset }) {
  return (
    <InsightModal open={open} onClose={onClose} title={LTV_LABELS.assumptionsTitle} subtitle={LTV_LABELS.assumptionsSubtitle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        {LTV_FIELDS.map((field) => (
          <div key={field.id} className="drawer-field">
            <label htmlFor={`input-ltv-${field.id}`}>{field.label}</label>
            <input
              id={`input-ltv-${field.id}`}
              type="number"
              step={field.step}
              value={draft[field.id]}
              onChange={(e) => onChange(field.id, Number(e.target.value))}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button type="button" className="btn-recalc" onClick={onRecalculate}>
          Recalculate
        </button>
        <button type="button" className="drawer-reset" onClick={onReset}>
          Reset to defaults
        </button>
      </div>
      <div className="drawer-assumption-info">
        <div className="drawer-assumption-info-heading">Default Assumption</div>
        <p className="drawer-assumption-info-text">{LTV_DEFAULT_ASSUMPTION_TEXT}</p>
      </div>
    </InsightModal>
  )
}

/**
 * Category-level detail, shown when a driver has no level-2 breakdown.
 * story-spec only decomposes some drivers, and the generator leaves the
 * `subDrivers` array off rather than inventing one — so most rows land here.
 * Every driver row opens something; none is a dead click.
 */
function DriverSummary({ row }) {
  const sig = driverSignal(row)
  const stats = [
    { label: 'Weekly volume', value: fmtNum(row.volume) },
    { label: 'Share of contacts', value: `${row.share}%` },
    { label: 'First contact resolution', value: `${row.fcr}%`, cls: fcrClass(row.fcr) },
    { label: 'Average handle time', value: formatAht(row.aht), cls: row.aht > 480 ? 'aht-bad' : 'aht-ok' },
    { label: 'Escalation rate', value: `${row.esc}%` },
  ]

  return (
    <>
      <div className="drawer-kpi-header">
        <div>
          <div className="insight-modal-section-label" style={{ marginTop: 0 }}>
            Weekly volume
          </div>
          <div className="drawer-kpi-val">{fmtNum(row.volume)}</div>
          <div className="drawer-kpi-sub">{row.share}% of all weekly contacts</div>
        </div>
        <div className={`signal-badge ${sig.cls}`}>{sig.label}</div>
      </div>

      <div className="insight-modal-section-label">Category performance</div>
      <div className="table-wrap">
        <table className="insight-modal-drivers-table">
          <thead>
            <tr>
              <th>Measure</th>
              <th>This category</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat.label}>
                <td className="insight-modal-drivers-name">{stat.label}</td>
                <td className={stat.cls}>{stat.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="insight-modal-text">
        No level-2 breakdown is published for this category — the story spec decomposes
        only the drivers where a sub-driver split is evidenced, rather than inventing
        one. Contact-level detail for this category is available in Contact Search.
      </p>
    </>
  )
}

function DriverDrillModal({ row, onClose }) {
  // subDrivers is optional: story-spec only breaks some drivers down to a
  // second level, and the generator leaves the array off rather than
  // inventing one. Reading it unconditionally used to crash the modal on
  // every driver row without level-2 detail; those rows now render
  // DriverSummary instead, so every row opens something.
  const subDrivers = row?.subDrivers ?? []
  if (!row) return null

  if (subDrivers.length === 0) {
    return (
      <InsightModal
        open
        onClose={onClose}
        title={row.name}
        subtitle="Category detail · volume, share and performance"
      >
        <DriverSummary row={row} />
      </InsightModal>
    )
  }

  const maxSub = Math.max(...subDrivers.map((d) => d.volume))

  return (
    <InsightModal
      open={Boolean(row)}
      onClose={onClose}
      title={row.name}
      subtitle="Level 2 driver breakdown · volume and share within category"
    >
      <div className="drivers-table-wrap">
        <table className="drivers-table">
          <thead>
            <tr>
              <th>Driver</th>
              <th>Volume</th>
              <th>Share</th>
              <th>FCR</th>
              <th>AHT</th>
              <th>Signal</th>
            </tr>
          </thead>
          <tbody>
            {subDrivers.map((d) => {
              const barPct = Math.round((d.volume / maxSub) * 100)
              const sigCls =
                d.signal === 'Primary driver' ? 'signal-red'
                  : d.signal === 'Process dependency' ? 'signal-amber'
                  : d.signal === 'Watch' ? 'signal-amber'
                  : 'signal-green'
              return (
                <tr key={d.name}>
                  <td className="subcat-name">{d.name}</td>
                  <td>
                    <div className="vol-cell">
                      <span className="vol-num">{fmtNum(d.volume)}</span>
                      <div className="vol-bar-wrap">
                        <div className={sigCls === 'signal-green' ? 'vol-bar vol-bar-green' : 'vol-bar'} style={{ width: `${barPct}%` }} />
                      </div>
                    </div>
                  </td>
                  <td>{d.share}%</td>
                  <td className={fcrClass(d.fcr)}>{d.fcr}%</td>
                  <td className={d.aht > 480 ? 'aht-bad' : 'aht-ok'}>{formatAht(d.aht)}</td>
                  <td>
                    <span className={`signal-badge ${sigCls}`}>{d.signal}</span>
                  </td>
                </tr>
              )
            })}
            <tr className="drivers-table-total">
              <td>Total</td>
              <td>{fmtNum(row.volume)}</td>
              <td>{row.share}%</td>
              <td className={fcrClass(row.fcr)}>{row.fcr}%</td>
              <td>{formatAht(row.aht)}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </InsightModal>
  )
}

function PatternDrillModal({ pattern, onClose }) {
  if (!pattern) return null
  const { trend, driversTable } = pattern

  return (
    <InsightModal
      open={Boolean(pattern)}
      onClose={onClose}
      title={pattern.headline}
      subtitle="Cross-KPI · root cause analysis"
    >
      <div className="insight-modal-section-label">Root cause analysis</div>
      <p className="insight-modal-text">{pattern.rootCause}</p>

      {trend && (
        <>
          <div className="insight-modal-section-label">{trend.title}</div>
          <div className="insight-modal-chart">
            <SparklineChart
              labels={trend.weeks}
              data={trend.data}
              color={trend.color}
              height={150}
              formatValue={(v) => (Number.isInteger(v) ? `${v}` : v.toFixed(1))}
              coachingWeekLabel={
                trend.coachingWeekIndex != null ? trend.weeks[trend.coachingWeekIndex] : undefined
              }
            />
          </div>
        </>
      )}

      {driversTable && (
        <>
          <div className="insight-modal-section-label">Performance drivers</div>
          <div className="table-wrap">
            <table className="insight-modal-drivers-table">
              <thead>
                <tr>
                  <th>{driversTable.columns[0]}</th>
                  <th>{driversTable.columns[1]}</th>
                </tr>
              </thead>
              <tbody>
                {driversTable.rows.map((r) => (
                  <tr key={r.a}>
                    <td className="insight-modal-drivers-name">{r.a}</td>
                    <td>{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </InsightModal>
  )
}

function VocItemModal({ item, onClose }) {
  if (!item) return null

  return (
    <InsightModal
      open={Boolean(item)}
      onClose={onClose}
      title={item.title}
      subtitle={item.isInternal ? 'Internal VOC indicator' : 'External VOC indicator'}
    >
      <div className="insight-modal-section-label">Issue</div>
      <p className="insight-modal-text">{item.theme || item.summary}</p>
      {item.volumeNote && (
        <>
          <div className="insight-modal-section-label">Volume and scope</div>
          <p className="insight-modal-text">{item.volumeNote}</p>
        </>
      )}
      {item.evidence && (
        <>
          <div className="insight-modal-section-label">Evidence</div>
          <p className="insight-modal-text">{item.evidence}</p>
        </>
      )}
      {item.workaround && (
        <>
          <div className="insight-modal-section-label">{NOUNS_CAP.demandSide} workaround</div>
          <p className="insight-modal-text">{item.workaround}</p>
        </>
      )}
      {item.action && (
        <>
          <div className="insight-modal-section-label">What we're doing about it</div>
          <p className="insight-modal-text">{item.action}</p>
        </>
      )}
    </InsightModal>
  )
}

function ActionDetailModal({ actionId, onClose }) {
  const action = actionId ? ACTION_DETAILS[actionId] : null
  if (!action) return null

  return (
    <InsightModal
      open={Boolean(actionId)}
      onClose={onClose}
      title={action.title}
      subtitle={action.category}
    >
      <div className="insight-modal-section-label" style={{ marginTop: 0 }}>What this is</div>
      <p className="insight-modal-text">{action.summary}</p>

      <div className="insight-modal-section-label">Why it's on the list</div>
      <p className="insight-modal-text">{action.rationale}</p>

      <div className="action-detail-meta">
        <div>
          <div className="insight-modal-section-label" style={{ marginTop: 0 }}>Owner</div>
          <p className="insight-modal-text" style={{ margin: 0 }}>{action.owner}</p>
        </div>
        <div>
          <div className="insight-modal-section-label" style={{ marginTop: 0 }}>Timeline</div>
          <p className="insight-modal-text" style={{ margin: 0 }}>{action.timeline}</p>
        </div>
      </div>

      <div className="insight-modal-section-label">Expected impact</div>
      <p className="insight-modal-text">{action.impact}</p>

      {action.kpis?.length > 0 && (
        <>
          <div className="insight-modal-section-label">KPIs affected</div>
          <div className="action-detail-tags">
            {action.kpis.map((kpi) => (
              <span key={kpi} className="tag tag-muted">{kpi}</span>
            ))}
          </div>
        </>
      )}
    </InsightModal>
  )
}

function CombinedVocItemModal({ issue, onClose }) {
  if (!issue) return null

  return (
    <InsightModal
      open={Boolean(issue)}
      onClose={onClose}
      title={issue.title}
      subtitle="Internal and external signal, reconciled"
    >
      <div className="insight-modal-section-label">Internal signal</div>
      <p className="insight-modal-text">{issue.internal}</p>
      <div className="insight-modal-section-label">External signal</div>
      <p className="insight-modal-text">{issue.external}</p>
      <div className="insight-modal-section-label">What we're doing about it</div>
      <p className="insight-modal-text">{issue.action}</p>
      <div className="insight-modal-section-label">Status</div>
      <p className="insight-modal-text">{issue.status}</p>
    </InsightModal>
  )
}

/**
 * The Actions board is generated from ACTION_DETAILS, grouped by each entry's
 * `category`, in declaration order. Nothing here names a specific action id
 * or a specific client's storyline, so a client with (say) no supply-side
 * next-best-action simply renders one card fewer.
 */
const ACTION_ENTRIES = Object.entries(ACTION_DETAILS)

function toneVar(tone) {
  if (tone === 'red') return 'var(--red)'
  if (tone === 'green') return 'var(--green)'
  return 'var(--amber)'
}

export default function Executive() {
  const navigate = useNavigate()
  const [metricDrill, setMetricDrill] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [ltvAssumptions, setLtvAssumptions] = useState(LTV_DEFAULTS)
  const [ltvDraft, setLtvDraft] = useState(LTV_DEFAULTS)
  const [driverDrill, setDriverDrill] = useState(null)
  const [patternDrill, setPatternDrill] = useState(null)
  const [showAllMetrics, setShowAllMetrics] = useState(false)
  const [vocItemDrill, setVocItemDrill] = useState(null)
  const [combinedVocDrill, setCombinedVocDrill] = useState(null)
  const [actionDrill, setActionDrill] = useState(null)

  const ltv = useMemo(() => computeLtvFinancials(ltvAssumptions), [ltvAssumptions])
  const health = useMemo(() => computeHealthScore(DEFAULTS.targetAht), [])
  const healthColor = healthArcColor(health.health)
  const statusColor = healthStatusColor(health.health)

  const maxVol = Math.max(...DRIVER_ROWS.map((r) => r.volume))
  const csatVsTarget = ((CSAT - KPIS.csat.target) / KPIS.csat.target) * 100
  const matrixHeadline = QUALITY_OUTCOME_MATRIX.headlineCell

  return (
    <>
      <Nav currentPage="executive" liveLabel={LIVE_LABEL} callsPill={CALLS_PILL} />

      <div className="page">
        <div className="briefing-kicker">QiQ Client Intelligence</div>
        <h1 className="briefing-title">{BRIEFING_TITLE}</h1>
        <div className="briefing-subtitle">
          {PERIOD_LABEL}. {HERO_CONTENT.subtitleSuffix}
        </div>
        <p className="extract-note">{EXTRACT_NOTE}</p>
        <div className="prov-legend" role="note" aria-label="Legend: type of data used">
          <span className="prov-legend-label">Legend · type of data used on this page</span>
          <span className="prov-legend-item">
            <ProvenanceBadge kind="public" /> real, sourced data
          </span>
          <span className="prov-legend-item">
            <ProvenanceBadge kind="modelled" /> synthetic demo data
          </span>
          <span className="prov-legend-item">
            <ProvenanceBadge kind="mixed" /> real anchor, modelled figures
          </span>
          <Link to="/voc" className="prov-link">
            See all public evidence →
          </Link>
        </div>

        <div className="connector">
          This period - at a glance. <ProvenanceBadge kind="mixed" />
        </div>
        <div className="hero">
          <div className="hero-left">
            <div className="hero-eyebrow">{HERO_CONTENT.eyebrow}</div>
            <div className="hero-headline">{HERO_CONTENT.headline}</div>
            <div className="hero-narrative">
              {HERO_CONTENT.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="hero-wow">{HERO_CONTENT.wow}</p>
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
            <div className="score-wrap">
              <HealthScoreRing score={health.health} color={healthColor} />
              <div className="score-inner">
                <div className="score-num">{health.health}</div>
                <div className="score-lbl-row">
                  <span className="score-lbl">Health</span>
                  <span className="score-info-btn">
                    i
                    <div className="score-tooltip">
                      <div className="score-tooltip-title">Health Score - how it is calculated</div>
                      <div className="score-tooltip-row">
                        <span className="score-tooltip-kpis">FCR - First Contact Resolution</span>
                        <span className="score-tooltip-wt">45%</span>
                      </div>
                      <div className="score-tooltip-row">
                        <span className="score-tooltip-kpis">Escalation Rate</span>
                        <span className="score-tooltip-wt">20%</span>
                      </div>
                      <div className="score-tooltip-row">
                        <span className="score-tooltip-kpis">AHT - Average Handle Time</span>
                        <span className="score-tooltip-wt">15%</span>
                      </div>
                      <div className="score-tooltip-row">
                        <span className="score-tooltip-kpis">Transfer Rate</span>
                        <span className="score-tooltip-wt">10%</span>
                      </div>
                      <div className="score-tooltip-row">
                        <span className="score-tooltip-kpis">RCR - Repeat Contact Rate</span>
                        <span className="score-tooltip-wt">10%</span>
                      </div>
                      <div className="score-tooltip-ranges">
                        <div className="score-tooltip-range">
                          <div className="score-tooltip-range-dot" style={{ background: '#1a7a4a' }} />
                          80-100 · Healthy
                        </div>
                        <div className="score-tooltip-range">
                          <div className="score-tooltip-range-dot" style={{ background: '#d97706' }} />
                          60-79 · Watch
                        </div>
                        <div className="score-tooltip-range">
                          <div className="score-tooltip-range-dot" style={{ background: '#c0392b' }} />
                          Below 60 · At risk
                        </div>
                      </div>
                      <div className="score-tooltip-breakdown">
                        FCR {Math.round(health.fcrScore)} · ER {Math.round(health.erScore)} · AHT{' '}
                        {Math.round(health.ahtScore)} · TR {Math.round(health.trScore)} · RCR{' '}
                        {Math.round(health.rcrScore)} →{' '}
                        <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{health.health}</strong>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>
            <div className="score-status-row">
              <span className="score-status" style={{ color: statusColor }}>
                {healthBandLabel(health.health)}
              </span>
              <span className="score-vel">
                QA {OVERALL_QA_PCT}% · CSAT {CONTINUATION_CSAT_RECOVERY.currentValue}
              </span>
            </div>
          </div>
        </div>

        <div className="connector" style={{ marginBottom: 0 }}>
          <span>Operations Snapshot · Week 5</span> <ProvenanceBadge kind="modelled" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <button
            type="button"
            className="metrics-cta"
            onClick={() => setShowAllMetrics((v) => !v)}
          >
            {showAllMetrics ? 'Show fewer metrics ←' : 'View all 8 metrics →'}
          </button>
        </div>
        <div className="recovery-framing">
          <span className="recovery-framing-dot" />
          <span>
            <strong>Reading these charts:</strong> {HERO_CONTENT.readingNote}
          </span>
        </div>
        <div className="ops-kpi-grid chart-grid">
          <KPITile
            label={KPI_TILE_META.csat.label} value={fmtCsat(CSAT)} target={`Target: ${KPIS.csat.target}`}
            variance={`${formatVariancePct(csatVsTarget)} vs target`}
            changeText={KPI_TILE_META.csat.changeText}
            varianceDirection={csatVsTarget >= 0 ? 'up' : 'down'} colour={KPI_TILE_META.csat.colour}
            onClick={() => setMetricDrill('csat')}
          >
            <SparklineChart
              labels={WK5}
              data={TREND.csat}
              color="#1a7a4a"
              formatValue={fmtCsat}
              height={140}
              coachingPeriodBand
              coachingPeriodStart={WK5[COACHING_WEEK_INDEX]}
              coachingPeriodEnd={WK5[WK5.length - 1]}
            />
          </KPITile>
          <KPITile
            label={KPI_TILE_META.criticalFailures.label}
            value={fmtWhole(CRITICAL_FAILURES.currentWeek)}
            target={KPI_TILE_META.criticalFailures.target}
            changeText={KPI_TILE_META.criticalFailures.changeText}
            varianceDirection={KPI_TILE_META.criticalFailures.varianceDirection}
            colour={KPI_TILE_META.criticalFailures.colour}
            onClick={() => navigate('/search?critical=true')}
            drillLabel={KPI_TILE_META.criticalFailures.drillLabel}
          >
            <SparklineChart
              labels={WK5}
              data={CRITICAL_FAILURES.weekly}
              color="#1a7a4a"
              formatValue={fmtWhole}
              height={140}
              coachingPeriodBand
              coachingPeriodStart={WK5[COACHING_WEEK_INDEX]}
              coachingPeriodEnd={WK5[WK5.length - 1]}
            />
          </KPITile>
          <KPITile
            label={KPI_TILE_META.rcr.label} value={fmtPct(KPIS.rcr.blended)} target={`Target: ${fmtPct(KPIS.rcr.target)}`}
            changeText={KPI_TILE_META.rcr.changeText} colour={KPI_TILE_META.rcr.colour} onClick={() => setMetricDrill('rcr')}
          >
            <SparklineChart
              labels={WK5}
              data={TREND.rcr}
              color="#d97706"
              formatValue={(v) => `${v}%`}
              height={140}
              coachingPeriodBand
              coachingPeriodStart={WK5[COACHING_WEEK_INDEX]}
              coachingPeriodEnd={WK5[WK5.length - 1]}
            />
          </KPITile>
          <KPITile
            label={KPI_TILE_META.escalation.label} value={fmtPct(KPIS.escalation.blended)} target={`Target: ${fmtPct(KPIS.escalation.target)}`}
            changeText={KPI_TILE_META.escalation.changeText} colour={KPI_TILE_META.escalation.colour} onClick={() => setMetricDrill('escalation')}
          >
            <SparklineChart
              labels={WK5}
              data={TREND.esc}
              color="#c0392b"
              formatValue={(v) => `${v}%`}
              height={140}
              coachingPeriodBand
              coachingPeriodStart={WK5[COACHING_WEEK_INDEX]}
              coachingPeriodEnd={WK5[WK5.length - 1]}
            />
          </KPITile>
          {showAllMetrics && (
            <>
              <KPITile
                label={KPI_TILE_META.aht.label} value={formatAht(KPIS.aht.blended)} target={`Target: ${formatAht(DEFAULTS.targetAht)}`}
                changeText={KPI_TILE_META.aht.changeText} colour={KPI_TILE_META.aht.colour} onClick={() => setMetricDrill('aht')}
              >
                <SparklineChart
                  labels={WK5}
                  data={TREND.aht}
                  color="#2a4fa8"
                  formatValue={formatAht}
                  height={140}
                  coachingPeriodBand
                  coachingPeriodStart={WK5[COACHING_WEEK_INDEX]}
                  coachingPeriodEnd={WK5[WK5.length - 1]}
                />
              </KPITile>
              <KPITile
                label={KPI_TILE_META.fcr.label} value={`${KPIS.fcr.blended}%`} target={`Target: ${KPIS.fcr.target}%`}
                changeText={KPI_TILE_META.fcr.changeText} colour={KPI_TILE_META.fcr.colour} onClick={() => setMetricDrill('fcr')}
              >
                <SparklineChart
                  labels={WK5}
                  data={TREND.fcr}
                  color="#1a7a4a"
                  formatValue={(v) => `${v}%`}
                  height={140}
                  coachingPeriodBand
                  coachingPeriodStart={WK5[COACHING_WEEK_INDEX]}
                  coachingPeriodEnd={WK5[WK5.length - 1]}
                />
              </KPITile>
              <KPITile
                label={KPI_TILE_META.transfer.label} value={`${KPIS.transfer.blended}%`} target={`Target: ${KPIS.transfer.target}%`}
                changeText={KPI_TILE_META.transfer.changeText} colour={KPI_TILE_META.transfer.colour} onClick={() => setMetricDrill('transfer')}
              >
                <SparklineChart
                  labels={WK5}
                  data={TREND.transfer}
                  color="#d97706"
                  formatValue={(v) => `${v}%`}
                  height={140}
                  coachingPeriodBand
                  coachingPeriodStart={WK5[COACHING_WEEK_INDEX]}
                  coachingPeriodEnd={WK5[WK5.length - 1]}
                />
              </KPITile>
              <KPITile
                label={KPI_TILE_META.nps.label} value={fmtWhole(KPIS.nps.blended)} target={`Target: ${KPIS.nps.target}`}
                changeText={KPI_TILE_META.nps.changeText} colour={KPI_TILE_META.nps.colour} onClick={() => setMetricDrill('nps')}
              >
                <SparklineChart
                  labels={WK5}
                  data={TREND.nps}
                  color="#2a4fa8"
                  formatValue={fmtWhole}
                  height={140}
                  coachingPeriodBand
                  coachingPeriodStart={WK5[COACHING_WEEK_INDEX]}
                  coachingPeriodEnd={WK5[WK5.length - 1]}
                />
              </KPITile>
            </>
          )}
        </div>

        <MemberLtvSection ltv={ltv} onOpenSettings={() => setSettingsOpen(true)} />

        <div className="connector">
          What is driving this. <ProvenanceBadge kind="modelled" />
        </div>
        <p className="connector-sub">
          The hardest matrix cell, process followed and resolved but CSAT still low, is{' '}
          {fmtNum(matrixHeadline.contacts)} contacts and {matrixHeadline.continuationShareOfCellPct}%
          of it is continuation contacts. Full detail lives in Contact Search.
        </p>
        <div className="driving-panel">
          <div className="driving-tab-bar">
            <span className="driving-tab">Contact drivers</span>
          </div>
          <div className="drivers-table-wrap">
            <table className="drivers-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Volume</th>
                  <th>Share</th>
                  <th>FCR</th>
                  <th>AHT</th>
                  <th>Signal</th>
                </tr>
              </thead>
              <tbody>
                {DRIVER_ROWS.map((row) => {
                  const sig = driverSignal(row)
                  const hasSub = (row.subDrivers?.length ?? 0) > 0
                  const barPct = Math.round((row.volume / maxVol) * 100)
                  const barCls = sig.cls === 'signal-green' ? 'vol-bar vol-bar-green' : 'vol-bar'
                  return (
                    <tr
                      key={row.name}
                      className="drivers-row-clickable"
                      onClick={() => setDriverDrill(row)}
                      title={
                        hasSub
                          ? 'View level 2 driver breakdown'
                          : 'View category detail'
                      }
                    >
                      <td className="subcat-name">{row.name}</td>
                      <td>
                        <div className="vol-cell">
                          <span className="vol-num">{fmtNum(row.volume)}</span>
                          <div className="vol-bar-wrap">
                            <div className={barCls} style={{ width: `${barPct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td>{row.share}%</td>
                      <td className={fcrClass(row.fcr)}>{row.fcr}%</td>
                      <td className={row.aht > 480 ? 'aht-bad' : 'aht-ok'}>{formatAht(row.aht)}</td>
                      <td>
                        <span className={`signal-badge ${sig.cls}`}>{sig.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="driving-cross-kpi">
            <div className="ckp-grid">
              {CROSS_KPI_PATTERNS.map((pattern) => (
                <button
                  key={pattern.label}
                  type="button"
                  className="ckp-card ckp-card-clickable"
                  onClick={() => setPatternDrill(pattern)}
                >
                  <div className="ckp-label">{pattern.label}</div>
                  <div className="ckp-headline">{pattern.headline}</div>
                  <div className="ckp-body">{pattern.body}</div>
                  <div className="ckp-drill">Root cause →</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="connector">
          Internal and external signal, together. <ProvenanceBadge kind="mixed" />
        </div>
        <p className="connector-sub">
          {EXTERNAL_VOC.platform} rates {BRAND.name} {EXTERNAL_VOC.label} at {EXTERNAL_VOC.rating}/
          {EXTERNAL_VOC.ratingScale} across {fmtNum(EXTERNAL_VOC.reviewCount)} reviews. Overall QA is{' '}
          {OVERALL_QA_PCT}%.{' '}
          {EXTERNAL_VOC.connectorNote ??
            'Both aggregates look healthy, and both are averaging over the same tail.'}
        </p>

        <div className="voc-reconcile-card">
          <div className="voc-reconcile-label">{COMBINED_VOC_ISSUES.title}</div>
          {COMBINED_VOC_ISSUES.items.map((issue) => (
            <button
              key={issue.id}
              type="button"
              className="voc-reconcile-item"
              onClick={() => setCombinedVocDrill(issue)}
            >
              <span className="voc-reconcile-item-title">{issue.title}</span>
              <span className="voc-reconcile-item-body">{issue.summary}</span>
              <span className="voc-reconcile-item-status">{issue.status} · Details →</span>
            </button>
          ))}
        </div>

        <div className="voc-strip-exec">
          <div className="voc-strip-exec-card">
            <div className="voc-strip-exec-title">
              Internal VOC signal <ProvenanceBadge kind="modelled" />
            </div>
            {INTERNAL_VOC_STRIP.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type="button"
                className="voc-strip-exec-item"
                onClick={() => setVocItemDrill({ ...item, isInternal: true })}
              >
                <div className="voc-strip-exec-item-title">{item.title}</div>
                <div className="voc-strip-exec-item-body">{item.theme} · {item.volumeNote}</div>
              </button>
            ))}
          </div>
          <div className="voc-strip-exec-card">
            <div className="voc-strip-exec-title">
              External VOC signal <ProvenanceBadge kind="public" />{' '}
              <Link to="/voc" className="prov-link">
                All public evidence →
              </Link>
            </div>
            {EXTERNAL_VOC_STRIP.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type="button"
                className="voc-strip-exec-item"
                onClick={() => setVocItemDrill({ ...item, isInternal: false })}
              >
                <div className="voc-strip-exec-item-title">{item.title}</div>
                <div className="voc-strip-exec-item-body">{item.summary}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="connector">
          Actions. <ProvenanceBadge kind="mixed" />
        </div>
        <div className="bottom-row">
          {ACTION_BOARD_COLUMNS.map((column) => {
            const entries = ACTION_ENTRIES.filter(([, a]) => a.category === column)
            if (entries.length === 0) return null
            return (
              <div className="bottom-card" key={column}>
                <div className="bottom-top">
                  <div className="bottom-label">{column}</div>
                </div>
                {entries.map(([id, action], i) => {
                  if (column === 'Ready to execute') {
                    return (
                      <NBACard
                        key={id}
                        number={i + 1}
                        title={action.title}
                        kpis={action.kpis ?? []}
                        impact={action.chip ?? 'High'}
                        onClick={() => setActionDrill(id)}
                      />
                    )
                  }
                  if (column === 'Watch next week') {
                    return (
                      <button
                        key={id}
                        type="button"
                        className="watch-row watch-row-clickable"
                        onClick={() => setActionDrill(id)}
                      >
                        <div className="watch-dot" style={{ background: toneVar(action.tone) }} />
                        <div>
                          <div className="watch-title">{action.title}</div>
                          <div className="watch-proj">{action.summary}</div>
                        </div>
                      </button>
                    )
                  }
                  return (
                    <button
                      key={id}
                      type="button"
                      className="dec-row dec-row-clickable"
                      onClick={() => setActionDrill(id)}
                    >
                      <div className="dec-bar" style={{ background: toneVar(action.tone) }} />
                      <div className="dec-body">
                        <div className="dec-title">{action.title}</div>
                        {action.type && <span className="dec-type type-pol">{action.type}</span>}
                      </div>
                      {action.chip && <div className="dec-cost">{action.chip}</div>}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>

        <FlowBar activePage="executive" />
      </div>

      <MetricDrillModal metricKey={metricDrill} onClose={() => setMetricDrill(null)} />

      <DriverDrillModal row={driverDrill} onClose={() => setDriverDrill(null)} />

      <PatternDrillModal pattern={patternDrill} onClose={() => setPatternDrill(null)} />

      <VocItemModal item={vocItemDrill} onClose={() => setVocItemDrill(null)} />

      <CombinedVocItemModal issue={combinedVocDrill} onClose={() => setCombinedVocDrill(null)} />

      <ActionDetailModal actionId={actionDrill} onClose={() => setActionDrill(null)} />

      <LtvSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        draft={ltvDraft}
        onChange={(key, value) => setLtvDraft((prev) => ({ ...prev, [key]: value }))}
        onRecalculate={() => {
          setLtvAssumptions(ltvDraft)
          setSettingsOpen(false)
        }}
        onReset={() => setLtvDraft({ ...LTV_DEFAULTS })}
      />
    </>
  )
}
