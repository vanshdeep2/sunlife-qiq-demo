/** This demo uses illustrative, synthetic data - Sun Life has not shared operational data with QiQ. */
import { AGENT_METRICS, AGENT_METRIC_ORDER, FLAGGED_AGENT_SLUGS, TEAM_AGGREGATES } from './agentMetrics'

/** This agent's own top-ranked coaching card title, read live off their pack. */
function topCoachingTopic(m) {
  return m.coachingPack.cards[0]?.title || 'Micro Coaching suite'
}

function statusOf(m) {
  if (m.criticalFailures >= 45) return ['Action Needed', 'badge-red']
  if (m.criticalFailures >= 25) return ['Watch', 'badge-amber']
  return ['On Track', 'badge-green']
}

const CF_WEEKLY = [0, 1, 2, 3, 4].map((i) =>
  AGENT_METRIC_ORDER.reduce((sum, slug) => sum + AGENT_METRICS[slug].criticalFailureSeries[i], 0),
)

export const TEAM_HEALTH_STATS = [
  { label: 'Team QA Score', value: TEAM_AGGREGATES.qaScore.toFixed(1), valueClass: 'val-amber', sub: `Overall QA average · all ${TEAM_AGGREGATES.totalContacts.toLocaleString('en-CA')} contacts` },
  { label: 'Follow-up CSAT', value: TEAM_AGGREGATES.continuationCsat.toFixed(1), valueClass: 'val-red', sub: `Vs ${TEAM_AGGREGATES.firstCsat.toFixed(1)} on first contacts` },
  { label: 'Auto-fail contacts', value: String(CF_WEEKLY[4]), valueClass: 'val-amber', sub: `Week 5 · ${TEAM_AGGREGATES.criticalFailuresTotal} across the period` },
  { label: 'Agents with auto-fails', value: `${TEAM_AGGREGATES.agentsWithCriticalFailures}/${AGENT_METRIC_ORDER.length}`, valueClass: 'val-amber', sub: 'Pattern is team-wide, not individual' },
]

export const MATRIX_ROWS = AGENT_METRIC_ORDER.map((slug) => {
  const m = AGENT_METRICS[slug]
  const [status, badgeClass] = statusOf(m)
  const delta = m.qaSeries[4] - m.qaSeries[0]
  return {
    slug,
    name: m.name,
    qaW5: m.qaSeries[4],
    qaW1: m.qaSeries[0],
    delta,
    deltaClass: delta > 0.15 ? 'delta-pos' : delta < -0.15 ? 'delta-neg' : 'delta-flat',
    qa: m.qaScore,
    csat: m.continuationCsat,
    behaviour: m.behaviourContinuation.empathy,
    pa: `${m.processAdherencePct.toFixed(0)}%`,
    rr: `${m.resolutionRatePct.toFixed(0)}%`,
    topic: topCoachingTopic(m),
    status,
    badgeClass,
    criticalFailures: m.criticalFailures,
    contradiction: m.criticalFailures >= 45,
  }
}).sort((a, b) => b.criticalFailures - a.criticalFailures || a.csat - b.csat)

export const ALERT_AGENTS = FLAGGED_AGENT_SLUGS.slice(0, 3).map((slug) => {
  const m = AGENT_METRICS[slug]
  const [status, badgeClass] = statusOf(m)
  const top = m.coachingPack.cards[0]
  const second = m.coachingPack.cards[1]
  return {
    slug,
    name: m.name,
    status,
    badgeClass,
    metrics: `${m.criticalFailures} auto-fail contact${m.criticalFailures === 1 ? '' : 's'} · QA ${m.qaScore.toFixed(1)}% · CSAT ${m.continuationCsat.toFixed(2)} · Empathy ${m.empathy.toFixed(2)}`,
    insight: `QA of ${m.qaScore.toFixed(1)}% is close to the team average of ${TEAM_AGGREGATES.qaScore.toFixed(1)}%, so the scorecard reads clean. ${m.criticalFailures} contact${m.criticalFailures === 1 ? '' : 's'} still auto-failed this period, most on follow-ups to a declined claim or disability file that was already open.`,
    action: `${top?.title || 'Micro Coaching'} is card 1 in the pack.${top?.personalNote ? ` Their numbers: ${top.personalNote}` : ''}${second ? ` ${second.title} follows at rank 2.` : ''} Track auto-fails weekly rather than QA.`,
  }
})

export const COACHING_QUEUE = AGENT_METRIC_ORDER.map((slug) => {
  const m = AGENT_METRICS[slug]
  const cleared = m.criticalFailureSeries[4] < m.criticalFailureSeries[0]
  const [, badgeClass] = statusOf(m)
  const status = m.criticalFailures === 0 ? 'On Track' : cleared ? 'Improving' : 'Watch'
  return {
    agent: m.name,
    topic: topCoachingTopic(m),
    source: `${m.criticalFailures} auto-fail${m.criticalFailures === 1 ? '' : 's'} · CSAT ${m.continuationCsat.toFixed(2)}`,
    deployed: 'Week 2',
    status,
    badgeClass: status === 'On Track' ? 'badge-green' : status === 'Improving' ? 'badge-green' : badgeClass,
    outcome:
      m.criticalFailures === 0
        ? 'No auto-fails this period'
        : cleared
          ? `Auto-fails ${m.criticalFailureSeries.join('·')} · week 5 below week 1`
          : `Auto-fails ${m.criticalFailureSeries.join('·')} · still above week 1`,
  }
}).sort((a, b) => (a.status === 'Watch' ? -1 : 1) - (b.status === 'Watch' ? -1 : 1))

const queueCounts = COACHING_QUEUE.reduce((acc, r) => {
  acc[r.status] = (acc[r.status] || 0) + 1
  return acc
}, {})

export const COACHING_QUEUE_SUMMARY = [
  { text: `${COACHING_QUEUE.length} agents in queue`, className: 'summary-chip' },
  { text: `${queueCounts.Watch || 0} watch`, className: 'summary-chip summary-chip-amber' },
  { text: `${queueCounts.Improving || 0} improving`, className: 'summary-chip summary-chip-green' },
  { text: `${queueCounts['On Track'] || 0} on track`, className: 'summary-chip summary-chip-green' },
]

/**
 * Critical-failure flagged calls, verified against the generated Contact
 * Search index (app/public/data/sunlife_contact_index.json) - each id, agent,
 * date and category below resolves to a real generated contact.
 */
export const FLAGGED_CALLS = [
  { callId: 'SL-002402', agent: 'Harpreet Gill', date: '2026-09-20', category: 'Claim Decision Disputes (Health, Drug & Dental)', flagReason: 'Continuation · high QA · low CSAT', flagClass: 'flag-badge-critical', qaScore: '100.0', qaClass: 'val-amber' },
  { callId: 'SL-002216', agent: 'Priya Sandhu', date: '2026-09-19', category: 'Disability Claim Status (STD / LTD)', flagReason: 'Closed without a named owner', flagClass: 'flag-badge-critical', qaScore: '100.0', qaClass: 'val-amber' },
  { callId: 'SL-002238', agent: 'Aisha Rahman', date: '2026-09-18', category: 'Digital Access & Claim Submission (App, Portal, Chat Handoff)', flagReason: 'Continuation · high QA · low CSAT', flagClass: 'flag-badge-gap', qaScore: '100.0', qaClass: 'val-amber' },
  { callId: 'SL-002173', agent: 'Kevin Nguyen', date: '2026-09-26', category: 'Additional Information Requests (Forms, Prior Auth, Attachments)', flagReason: 'Register mismatch · repeat not acknowledged', flagClass: 'flag-badge-gap', qaScore: '100.0', qaClass: 'val-amber' },
]
