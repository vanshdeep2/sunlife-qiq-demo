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
import { formatDate } from '../utils/format'

export default function IncidentTrail({ contacts, activeContactId, onSelectContact }) {
  const sorted = [...(contacts || [])].sort((a, b) => a.contact_sequence - b.contact_sequence)

  if (sorted.length === 0) {
    return <p className="incident-trail-empty">No related contacts on this incident.</p>
  }

  const chartData = sorted.map((c) => ({
    label: `C${c.contact_sequence}`,
    csat: c.predicted_csat_score,
    behaviour: c.behaviour_score,
    qa: c.qa_score != null ? c.qa_score / 20 : null,
    qaRaw: c.qa_score,
  }))

  return (
    <div className="incident-trail">
      <div className="incident-trail-head">
        <div className="detail-section-title">Incident Trail</div>
        <div className="incident-trail-sub">
          {sorted[0]?.incident_id}
          {sorted[0]?.incident_title ? ` · ${sorted[0].incident_title}` : ''}
        </div>
        <p className="incident-trail-note">
          CSAT and behaviour collapse after contact 1. QA barely moves. That is the argument.
        </p>
      </div>

      <div className="incident-trail-cards">
        {sorted.map((c) => {
          const active = c.contact_id === activeContactId
          return (
            <button
              key={c.contact_id}
              type="button"
              className={`incident-card${active ? ' incident-card-active' : ''}`}
              onClick={() => onSelectContact?.(c.contact_id)}
            >
              <div className="incident-card-seq">Contact {c.contact_sequence}</div>
              <div className="incident-card-id">{c.contact_id}</div>
              <div className="incident-card-meta">
                {formatDate(c.call_date)} · {c.channel} · {c.side}
              </div>
              <div className="incident-card-agent">{c.agent_name}</div>
              <div className="incident-card-scores">
                <span>CSAT {c.predicted_csat_score ?? '-'}</span>
                <span>Beh {c.behaviour_score ?? '-'}</span>
                <span>QA {c.qa_score ?? '-'}</span>
              </div>
            </button>
          )
        })}
      </div>

      {sorted.length > 1 && (
        <div className="incident-trail-chart">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e2" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, name, props) => {
                  if (name === 'QA (scaled)') {
                    return [props.payload.qaRaw, 'QA %']
                  }
                  return [value, name]
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="csat" name="CSAT" stroke="#c0392b" strokeWidth={2} dot />
              <Line
                type="monotone"
                dataKey="behaviour"
                name="Behaviour"
                stroke="#d97706"
                strokeWidth={2}
                dot
              />
              <Line
                type="monotone"
                dataKey="qa"
                name="QA (scaled)"
                stroke="#2a4fa8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="incident-trail-chart-note">QA plotted as score/20 so it shares the 1-5 axis.</div>
        </div>
      )}
    </div>
  )
}
