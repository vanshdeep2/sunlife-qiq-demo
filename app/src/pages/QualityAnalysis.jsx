import { NOUNS } from '../config/brand'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Nav from '../components/Nav'
import FlowBar from '../components/FlowBar'
import DiagnosticMatrix from '../components/DiagnosticMatrix'
import MatrixCellModal from '../components/MatrixCellModal'
import CoachingWeekMarker from '../components/charts/CoachingWeekMarker'
import { CALLS_PILL, LIVE_LABEL } from '../data/executiveConstants'
import { WEEK_BOUNDARIES } from '../data/contactSearchConstants'
import {
  CAMPAIGN_SUMMARY_BY_WEEK,
  interpolate,
  METRIC_CARD_NOTES,
} from '../data/qualityConstants'
import { useContactIndex } from '../context/ContactIndexContext'
import {
  buildMatrix,
  meanQaForWeek,
  weekLabelFull,
  weeklyMetrics,
  weeklyTrendSeries,
} from '../utils/qualityMatrix'
import '../styles/executive.css'
import '../styles/quality.css'

const TICK_STYLE = { fontSize: 9, fill: '#9b9b9b', fontFamily: 'DM Sans, sans-serif' }

function TrendsChart({ series, selectedWeek }) {
  const [zoomIn, setZoomIn] = useState(true)
  const coachingLabel = series[1]?.label
  const chartData = series.map((row, i) => ({
    ...row,
    selected: i === selectedWeek ? 100 : null,
  }))

  return (
    <div className="qa-card">
      <div className="qa-card-head">
        <h2 className="qa-card-title">
          Performance Trends
          <span className="qa-card-subtitle">(5-week period)</span>
        </h2>
        <div className="qa-zoom-toggle" role="group" aria-label="Chart scale">
          <button
            type="button"
            className={`qa-zoom-btn${zoomIn ? ' qa-zoom-btn-active' : ''}`}
            aria-pressed={zoomIn}
            onClick={() => setZoomIn(true)}
          >
            Zoom in
          </button>
          <button
            type="button"
            className={`qa-zoom-btn${!zoomIn ? ' qa-zoom-btn-active' : ''}`}
            aria-pressed={!zoomIn}
            onClick={() => setZoomIn(false)}
          >
            Zoom out
          </button>
        </div>
      </div>
      <div className="qa-trends-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 28, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ececec" />
            <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} tickLine={false} />
            <YAxis
              domain={zoomIn ? [50, 100] : [0, 100]}
              tick={TICK_STYLE}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              formatter={(value, name) => [`${value}%`, name]}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid #e5e5e2' }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: 11, color: '#666' }}
            />
            <CoachingWeekMarker weekLabel={coachingLabel} variant="ccm" />
            <Line
              type="monotone"
              dataKey="selected"
              name="Selected week"
              stroke="rgba(42,79,168,0.15)"
              strokeWidth={18}
              dot={false}
              activeDot={false}
              legendType="none"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="processAdherencePct"
              name="Process Adherence Rate"
              stroke="#2a4fa8"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="resolutionRatePct"
              name="Call Resolution Rate"
              stroke="#1a7a4a"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="positiveCsatPct"
              name="Positive CSAT %"
              stroke="#d97706"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default function QualityAnalysis() {
  const navigate = useNavigate()
  const { contacts, loading, error } = useContactIndex()
  const [weekIndex, setWeekIndex] = useState(4)
  const [behaviourBand, setBehaviourBand] = useState('good')
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeCell, setActiveCell] = useState(null)

  const matrix = useMemo(
    () => buildMatrix(contacts, weekIndex, behaviourBand),
    [contacts, weekIndex, behaviourBand],
  )

  const metrics = useMemo(
    () => weeklyMetrics(contacts, weekIndex),
    [contacts, weekIndex],
  )

  const trends = useMemo(() => weeklyTrendSeries(contacts), [contacts])

  const heroMatrix = useMemo(
    () => buildMatrix(contacts, weekIndex, 'poor'),
    [contacts, weekIndex],
  )

  const overallQa = useMemo(
    () => meanQaForWeek(contacts, weekIndex),
    [contacts, weekIndex],
  )

  const campaign = useMemo(() => {
    const heroCell = heroMatrix.cells[0][2]
    const vars = {
      total: metrics.total.toLocaleString(NOUNS.locale),
      processAdherencePct: metrics.processAdherencePct.toFixed(1),
      resolutionRatePct: metrics.resolutionRatePct.toFixed(1),
      positiveCsatPct: metrics.positiveCsatPct.toFixed(1),
      criticalFailures: metrics.criticalFailures,
      heroPct: heroCell.pct.toFixed(1),
      heroCount: heroCell.count,
      meanQa: heroCell.meanQa != null ? heroCell.meanQa.toFixed(1) : 'n/a',
      overallQa: overallQa != null ? overallQa.toFixed(1) : 'n/a',
    }
    const raw = CAMPAIGN_SUMMARY_BY_WEEK[weekIndex] || CAMPAIGN_SUMMARY_BY_WEEK[4]
    return {
      headline: interpolate(raw.headline, vars),
      paragraphs: raw.paragraphs.map((p) => interpolate(p, vars)),
      wow: interpolate(raw.wow, vars),
      chips: raw.chips.map((chip) => ({
        ...chip,
        text: interpolate(chip.text, vars),
      })),
    }
  }, [heroMatrix, metrics, weekIndex, overallQa])

  return (
    <>
      <Nav currentPage="quality" liveLabel={LIVE_LABEL} callsPill={CALLS_PILL} />
      <div className="page">
        <div className="qa-page-header">
          <h1 className="qa-page-title">Quality Overview</h1>
          <div className="qa-page-controls">
            <label
              htmlFor="qa-week-select"
              style={{
                position: 'absolute',
                width: 1,
                height: 1,
                overflow: 'hidden',
                clip: 'rect(0 0 0 0)',
              }}
            >
              Week
            </label>
            <select
              id="qa-week-select"
              className="qa-week-select"
              value={weekIndex}
              onChange={(e) => setWeekIndex(Number(e.target.value))}
            >
              {WEEK_BOUNDARIES.map((_, i) => (
                <option key={WEEK_BOUNDARIES[i].start} value={i}>
                  {weekLabelFull(i)}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="qa-refresh-btn"
              onClick={() => setRefreshKey((k) => k + 1)}
            >
              Refresh
            </button>
          </div>
        </div>

        {loading && <div className="qa-loading">Loading contact data...</div>}
        {error && <div className="qa-error">{error}</div>}

        {!loading && !error && (
          <div key={refreshKey}>
            <div className="connector">This week - campaign summary.</div>
            <div className="hero qa-hero-full">
              <div className="hero-left">
                <div className="hero-eyebrow">
                  QiQ Weekly Intelligence · Week {weekIndex + 1} of 5
                </div>
                <div className="hero-headline">{campaign.headline}</div>
                <div className="hero-narrative">
                  {campaign.paragraphs.map((text) => (
                    <p key={text.slice(0, 40)}>{text}</p>
                  ))}
                </div>
                <p className="hero-wow">{campaign.wow}</p>
                <div className="hero-chips">
                  {campaign.chips.map((chip) => (
                    <div key={chip.text} className={`hero-chip ${chip.className}`}>
                      <span className="chip-dot" style={{ background: chip.dotColor }} />
                      {chip.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DiagnosticMatrix
              matrix={matrix}
              behaviourBand={behaviourBand}
              onBehaviourChange={setBehaviourBand}
              onCellClick={setActiveCell}
            />

            <div className="qa-metrics-row">
              <div className="qa-metric-card">
                <div className="qa-metric-label">Process Adherence Rate</div>
                <div className="qa-metric-value blue">
                  {metrics.processAdherencePct.toFixed(1)}%
                </div>
                <div className="qa-metric-sub">{METRIC_CARD_NOTES.processAdherence}</div>
              </div>
              <div className="qa-metric-card">
                <div className="qa-metric-label">Call Resolution Rate</div>
                <div className="qa-metric-value green">
                  {metrics.resolutionRatePct.toFixed(1)}%
                </div>
                <div className="qa-metric-sub">{METRIC_CARD_NOTES.resolution}</div>
              </div>
              <div className="qa-metric-card">
                <div className="qa-metric-label">Positive CSAT</div>
                <div className="qa-metric-value amber">
                  {metrics.positiveCsatPct.toFixed(1)}%
                </div>
                <div className="qa-metric-sub">{METRIC_CARD_NOTES.positiveCsat}</div>
              </div>
              <button
                type="button"
                className="qa-metric-card qa-metric-card-btn"
                onClick={() =>
                  navigate(`/search?critical=true&week=${weekIndex + 1}`)
                }
              >
                <div className="qa-metric-label">Critical Failures</div>
                <div className="qa-cf-value-wrap">
                  <div className="qa-metric-value red">{metrics.criticalFailures}</div>
                  <span aria-hidden="true">🚩</span>
                </div>
                <div className="qa-metric-sub">View critical failure calls →</div>
              </button>
            </div>

            <TrendsChart series={trends} selectedWeek={weekIndex} />
          </div>
        )}

        <FlowBar activePage="quality" />
      </div>

      <MatrixCellModal
        open={Boolean(activeCell)}
        onClose={() => setActiveCell(null)}
        cell={activeCell}
        weekTotal={matrix.weekTotal}
      />
    </>
  )
}
