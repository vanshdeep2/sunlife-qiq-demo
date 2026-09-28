import { useState } from 'react'
import Nav from '../components/Nav'
import ProvenanceBadge from '../components/ProvenanceBadge'
import MethodologyDrawer from '../components/MethodologyDrawer'
import { PUBLIC_VOC } from '../data/publicVoc'
import { BRAND } from '../config/brand'
import { fmtNum } from '../utils/format'
import '../styles/executive.css'
import '../styles/voc.css'

const STAR_KEYS = [
  ['five', '5★'],
  ['four', '4★'],
  ['three', '3★'],
  ['two', '2★'],
  ['one', '1★'],
]

function SourceLink({ url, children }) {
  if (!url) return <span>{children}</span>
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

function Distribution({ dist }) {
  if (!dist) return null
  const total = STAR_KEYS.reduce((s, [k]) => s + (dist[k] || 0), 0)
  if (!total) return null
  return (
    <div className="pv-dist">
      {STAR_KEYS.map(([k, label]) => {
        const n = dist[k] || 0
        const pct = (n / total) * 100
        return (
          <div className="pv-dist-row" key={k}>
            <span className="pv-dist-label">{label}</span>
            <span className="pv-dist-track">
              <span className="pv-dist-fill" style={{ width: `${pct}%` }} />
            </span>
            <span className="pv-dist-n">{fmtNum(n)}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function VoiceOfCustomer() {
  const [methodOpen, setMethodOpen] = useState(false)
  const v = PUBLIC_VOC
  const p = v.platform || {}
  // Dated events newest first; year-only or undated entries go last.
  const events = [...(v.events || [])].sort((a, b) => {
    const da = /^\d{4}-\d{2}/.test(a.date || '') ? a.date : ''
    const db = /^\d{4}-\d{2}/.test(b.date || '') ? b.date : ''
    return db.localeCompare(da)
  })

  return (
    <>
      {/* No live label / contacts pill here: those are modelled contact-centre figures
          ("80,000 contacts analysed") and this page's badge says Public data. */}
      <Nav
        currentPage="voc"
        callsPill={p.reviewCount != null ? `${fmtNum(p.reviewCount)} public reviews` : null}
        pageTitle="Voice of the Customer"
      />
      <div className="page pv-page">
        <div className="briefing-kicker">Public evidence</div>
        <h1 className="briefing-title">What {BRAND.name}’s customers say in public</h1>
        <div className="briefing-subtitle pv-intro">
          <ProvenanceBadge kind="public" /> {v.intro}{' '}
          <button type="button" className="prov-link" onClick={() => setMethodOpen(true)}>
            How this demo was built →
          </button>
        </div>

        <div className="connector">
          The ratings. <ProvenanceBadge kind="public" />
        </div>
        <div className="pv-ratings">
          {p.name && (
            <div className="pv-card pv-card-main">
              <div className="pv-card-label">
                <SourceLink url={p.url}>{p.name}</SourceLink>
              </div>
              <div className="pv-rating">
                {typeof p.rating === 'number' ? p.rating.toFixed(1) : '—'}
                <span className="pv-rating-scale">/{p.ratingScale}</span>
              </div>
              <div className="pv-card-sub">
                {p.reviewCount != null && <>{fmtNum(p.reviewCount)} reviews on the platform</>}
                {p.reviewsRead ? <> · {fmtNum(p.reviewsRead)} read in full for this demo</> : null}
              </div>
              <Distribution dist={p.distribution} />
              {p.readNote && <div className="pv-note">{p.readNote}</div>}
            </div>
          )}
          {(v.otherRatings || []).map((o) => (
            <div className="pv-card" key={o.platform}>
              <div className="pv-card-label">
                <SourceLink url={o.url}>{o.platform}</SourceLink>
              </div>
              <div className="pv-rating">
                {typeof o.rating === 'number' ? o.rating.toFixed(1) : o.rating}
                <span className="pv-rating-scale">/5</span>
              </div>
              {o.count && <div className="pv-card-sub">{o.count}</div>}
            </div>
          ))}
        </div>
        {v.keyInsight && <div className="pv-insight">{v.keyInsight}</div>}

        <div className="connector">
          What they complain about, in their words. <ProvenanceBadge kind="public" />
        </div>
        <div className="pv-themes">
          {(v.themes || []).map((t, i) => (
            <div className="pv-theme" key={t.id || t.title}>
              <div className="pv-theme-head">
                <span className="pv-theme-title">
                  {i + 1}. {t.title}
                </span>
                <span className={`pv-tag pv-sev-${t.severity}`}>Severity: {t.severity}</span>
                <span className={`pv-tag pv-conf-${t.confidence}`}>Confidence: {t.confidence}</span>
              </div>
              {t.frequencyNote && <div className="pv-theme-freq">{t.frequencyNote}</div>}
              {(t.quotes || []).map((q) => (
                <blockquote className="pv-quote" key={q.text}>
                  <span className="pv-quote-text">“{q.text}”</span>
                  <span className="pv-quote-src">
                    <SourceLink url={q.url}>{q.sourceLabel}</SourceLink>
                    {q.date ? ` · ${q.date}` : ''}
                    {q.note ? ` · ${q.note}` : ''}
                  </span>
                </blockquote>
              ))}
            </div>
          ))}
        </div>

        {(v.competitors || []).length > 0 && (
          <>
            <div className="connector">
              How the category compares. <ProvenanceBadge kind="public" />
            </div>
            <div className="pv-table">
              {v.competitors.map((c) => (
                <div className="pv-table-row" key={c.name}>
                  <span className="pv-table-name">
                    <SourceLink url={c.url}>{c.name}</SourceLink>
                  </span>
                  <span>{c.positioning}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {events.length > 0 && (
          <>
            <div className="connector">
              Public events that land on the contact centre. <ProvenanceBadge kind="public" />
            </div>
            <div className="pv-events">
              {events.map((e) => (
                <div className="pv-event" key={`${e.date}-${e.summary.slice(0, 24)}`}>
                  <span className="pv-event-date">{e.date}</span>
                  <span className="pv-event-body">
                    {e.summary}{' '}
                    {e.url && (
                      <a href={e.url} target="_blank" rel="noreferrer">
                        Source
                      </a>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="pv-footer">
          Contact-centre volumes, KPIs, agents and transcripts elsewhere in this demo are modelled to match the evidence
          above and are marked <ProvenanceBadge kind="modelled" />.{' '}
          <button type="button" className="prov-link" onClick={() => setMethodOpen(true)}>
            See how this demo was built →
          </button>
        </div>
      </div>
      <MethodologyDrawer open={methodOpen} onClose={() => setMethodOpen(false)} />
    </>
  )
}
