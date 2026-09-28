/** This demo uses illustrative, synthetic data - Sun Life has not shared operational data with QiQ. */
import { MICRO_COACHING_CARDS } from './agents'
import { AGENT_METRICS, AGENT_METRIC_ORDER, TEAM_AGGREGATES } from './agentMetrics'
import { CRITICAL_FAILURES, CSAT as CSAT_EXEC, FIRST_VS_CONTINUATION, CONTINUATION_CSAT_RECOVERY, KPIS as KPIS_EXEC, TREND as TREND_EXEC, WK_LABELS } from './executiveConstants'
import { formatAht } from '../utils/format'

export { WK_LABELS }
export const COACHING_WEEK_INDEX = 1

export const BEHAVIOUR_PILLAR = {
  clarity_of_communication: { first: 4.3, continuation: 3.3, label: 'Clarity of communication' },
  ownership_of_the_issue: { first: 4.1, continuation: 2.0, label: 'Ownership of the issue' },
  listening_and_responsiveness: { first: 4.2, continuation: 2.8, label: 'Listening and responsiveness' },
  professionalism_and_courtesy: { first: 4.5, continuation: 4.1, label: 'Professionalism and courtesy' },
  empathy_and_acknowledgement: { first: 4.2, continuation: 1.9, label: 'Empathy and acknowledgement' },
  managing_frustration: { first: 4.0, continuation: 2.1, label: 'Managing frustration' },
}

export const COACHING_EFFECT_CONTINUATION_CSAT = CONTINUATION_CSAT_RECOVERY.weekly
export const COACHING_EFFECT_CRITICAL_FAILURES = CRITICAL_FAILURES.weekly

const CF = CRITICAL_FAILURES
const cfSeq = CF.weekly.join(' → ')

export const MICRO_COACHING_ADOPTION = [
  { id: 'cc1', title: MICRO_COACHING_CARDS[0].title, deployed: 10, takenUp: 8, inProgress: 1, notTouched: 1 },
  { id: 'cc2', title: MICRO_COACHING_CARDS[1].title, deployed: 10, takenUp: 7, inProgress: 2, notTouched: 1 },
  { id: 'cc3', title: MICRO_COACHING_CARDS[2].title, deployed: 10, takenUp: 7, inProgress: 2, notTouched: 1 },
  { id: 'cc4', title: MICRO_COACHING_CARDS[3].title, deployed: 10, takenUp: 6, inProgress: 3, notTouched: 1 },
]

export const CCM_HERO = {
  headline: 'Continuation-cohort CSAT is recovering, and auto-fail contacts have fallen every week since coaching started.',
  body: `Per-contact QA sat at ${TEAM_AGGREGATES.qaScore.toFixed(1)}% team-wide and barely moved. Underneath it, ${CF.totalThisPeriod} contacts auto-failed this period, most of them follow-ups on a declined claim or a disability file that was already open. Coaching the whole team from week 2 moved continuation-cohort CSAT from 1.6 to 2.4, and auto-fails went ${cfSeq}. Blended CSAT rose from 3.35 to 3.6, still short of the 4.2 target, and CDCP pre-authorization denials sit outside what coaching can reach.`,
  paragraphs: [
    { lead: 'What we found', text: 'Follow-up contacts on declined claims and disability files pass QA at 86.0% and still drop CSAT to 2.0, against 4.0 on the first contact. Per-contact scoring can’t see that gap.' },
    { lead: 'Why the scorecard missed it', text: 'The scorecard judges each contact on its own. It never asks whether this is the second or third call about the same claim, or whether someone already told the member it was covered.' },
    { lead: 'What we changed', text: 'Micro Coaching cards 1 and 2 (start from the last call, let the decision set the tone) went live team-wide from week 2, built from each agent’s own auto-fail evidence.' },
    { lead: 'What has not moved yet', text: 'Blended CSAT is up from 3.35 to 3.6 but still short of the 4.2 target. CDCP pre-authorization contacts are unchanged, because the denial reason isn’t available to the agent, and no coaching fixes that.' },
  ],
  firstVsContinuation: FIRST_VS_CONTINUATION,
}

export const COACHING_HEALTH_STATS = [
  { label: 'Micro Coaching cards deployed', value: '4', valueClass: '', sub: 'Per agent, from their own contacts' },
  { label: 'Agents taking up', value: '10/10', valueClass: 'val-amber', sub: 'Team-wide since week 2' },
  { label: 'Auto-fails W5', value: String(CF.currentWeek), valueClass: 'val-amber', sub: `Down from ${CF.peakWeek} in week 1` },
  { label: 'Continuation QA', value: '86.0%', valueClass: 'val-amber', sub: 'Flat all period, CSAT recovering 1.6 → 2.4' },
]

export const HERO_CHIPS = [
  { text: 'Continuation CSAT 1.6 → 2.4 since coaching', className: 'chip-green', dotColor: '#4ade80' },
  { text: 'Ownership 4.1 → 2.0 on continuation', className: 'chip-red', dotColor: '#fca5a5' },
  { text: 'QA still 86.0% on continuation', className: 'chip-amber', dotColor: '#fbbf24' },
]

export const HERO_STATS = [
  { value: `${CF.weekly[0]} → ${CF.currentWeek}`, label: 'Auto-fails across the coaching period, down every week' },
  { value: '86.0%', label: 'Continuation QA, flat all period' },
  { value: '2.0', label: 'Follow-up CSAT vs 4.0 first contact' },
  { value: 'Week 2', label: 'Micro Coaching deployment start' },
  { value: String(CF.totalThisPeriod), label: 'Auto-fail contacts found by quality mining, full period' },
]

const BY_CF = [...AGENT_METRIC_ORDER].sort(
  (a, b) => AGENT_METRICS[b].criticalFailures - AGENT_METRICS[a].criticalFailures,
)
const agentLine = (slug) => {
  const m = AGENT_METRICS[slug]
  return `${m.name}: ${m.qaScore.toFixed(1)}% QA · ${m.criticalFailures} auto-fails`
}

export const QUALITY_SUMMARY = [
  { value: agentLine(BY_CF[0]), label: 'Highest auto-fail count on the team' },
  { value: agentLine(BY_CF[1]), label: 'Same pattern, same coaching cards' },
  { value: 'Behaviour ownership 2.0', label: 'Biggest pillar gap on continuation' },
  { value: 'Micro Coaching uptake 10/10', label: 'Whole team on file-first opens since week 2' },
]

export const TREND = {
  aht: TREND_EXEC.aht,
  fcr: TREND_EXEC.fcr,
  csat: COACHING_EFFECT_CONTINUATION_CSAT,
  nps: TREND_EXEC.nps,
  er: TREND_EXEC.esc,
}

export const T1_RESOLUTION = [69, 70, 71, 71, 72]
export const CF_WEEKLY = COACHING_EFFECT_CRITICAL_FAILURES
export const CF_BAR_COLORS = ['#c0392b', '#d97706', '#d97706', '#d97706', '#d97706']

function ledgerRow(slug, i) {
  const m = AGENT_METRICS[slug]
  const top = m.coachingPack.cards[0]
  const topic = top ? top.title.split(' · ')[0] : 'Micro Coaching suite'
  const improving = m.criticalFailureSeries[4] < m.criticalFailureSeries[0]
  if (i === BY_CF.length - 1) {
    return {
      agent: m.name,
      issue: 'Lowest auto-fail count on the team',
      topic: 'Peer coaching source',
      deployed: 'Week 2',
      outcome: 'Modelling file-first opens',
      badges: [{ text: 'Benchmark', className: 'badge badge-trophy' }],
    }
  }
  const actionNeeded = m.criticalFailures >= 45
  const watch = !actionNeeded && m.criticalFailures >= 25
  return {
    agent: m.name,
    issue: `${m.criticalFailures} auto-fails with QA ${m.qaScore.toFixed(1)}%`,
    topic,
    deployed: i < 3 ? 'Week 2 - Micro Coaching card 1' : 'Week 2',
    outcome: `Auto-fails ${m.criticalFailureSeries.join('·')}${improving ? ' · week 5 below week 1' : ' · not yet below week 1'}`,
    badges: actionNeeded
      ? [{ text: 'Action Needed', className: 'badge badge-red' }, { text: 'TL action required', className: 'badge badge-tl' }]
      : watch
        ? [{ text: 'Watch', className: 'badge badge-amber' }]
        : [{ text: improving ? 'Improving' : 'Watch', className: improving ? 'badge badge-green' : 'badge badge-amber' }],
    statusCell: actionNeeded,
  }
}

const LEDGER_SLUGS = [...BY_CF.slice(0, 5), BY_CF[BY_CF.length - 1]]
export const COACHING_LEDGER_ROWS = LEDGER_SLUGS.map((slug) => ledgerRow(slug, slug === BY_CF[BY_CF.length - 1] ? BY_CF.length - 1 : BY_CF.indexOf(slug)))

const count = (txt) => COACHING_LEDGER_ROWS.filter((r) => r.badges[0].text === txt).length
export const COACHING_LEDGER_SUMMARY = [
  { text: `${COACHING_LEDGER_ROWS.length} agents in ledger`, className: 'summary-chip' },
  { text: `${count('Action Needed')} action needed`, className: 'summary-chip summary-chip-amber' },
  { text: `${count('Watch')} watch`, className: 'summary-chip summary-chip-amber' },
  { text: `${count('Improving')} improving`, className: 'summary-chip summary-chip-green' },
  { text: `${count('Benchmark')} benchmark`, className: 'summary-chip summary-chip-trophy' },
]

export const PATTERN_CARDS = [
  {
    variant: 'red',
    title: 'Continuation failure invisible to per-contact QA',
    level: 'System level',
    body: 'CSAT 2.0 vs first-contact 4.0 while QA stays near 86%. Scorecards judge each claim call on its own. The file history is what shows the damage.',
    tags: [
      { text: 'CSAT -2.0', className: 'tag tag-red' },
      { text: 'QA flat', className: 'tag tag-amber' },
      { text: 'Ownership -2.1', className: 'tag tag-red' },
    ],
  },
  {
    variant: 'amber',
    title: 'Chat-to-phone handoffs closed without a path',
    level: 'System level',
    body: '24% of Digital Access & Claim Submission contacts close with no resolution path, and 43% of that cohort calls back. Trustpilot reviews about access rose from 2 in August to 11 in September.',
    tags: [
      { text: 'Repeat 43%', className: 'tag tag-amber' },
      { text: 'Public spike', className: 'tag tag-amber' },
    ],
  },
  {
    variant: 'green',
    title: 'Micro Coaching moves CSAT and auto-fails',
    level: 'Team level - early result',
    body: `After the week-2 rollout, continuation-cohort CSAT rose every week, 1.6 to 2.4, and auto-fail contacts fell every week, ${cfSeq}. Blended CSAT is up from 3.35 to 3.6, still short of target.`,
    tags: [
      { text: 'CSAT +0.8', className: 'tag tag-green' },
      { text: '10/10 uptake', className: 'tag tag-amber' },
    ],
  },
  {
    variant: 'red',
    title: 'CDCP pre-authorization denials are a data gap, not a behaviour gap',
    level: 'System level - not coachable',
    body: '580 avoidable weekly contacts because the denial reason never reaches the letter, the dental office or the agent. Micro Coaching won’t move it.',
    tags: [
      { text: '580 avoidable', className: 'tag tag-amber' },
      { text: 'Not coachable', className: 'tag tag-red' },
    ],
  },
]

export const BEST_PRACTICE_CARDS = [
  {
    title: 'Open with what’s already on the file before the request',
    evidence: 'Evidence: continuation CSAT recovers when agents name the earlier call first · QA stays high either way',
    agents: `Agents: ${AGENT_METRICS[BY_CF[BY_CF.length - 1]].name} modelling · ${AGENT_METRICS[BY_CF[0]].name} and ${AGENT_METRICS[BY_CF[1]].name} coaching focus`,
    rec: 'Recommendation: make the file-first open the default on every follow-up contact.',
  },
  {
    title: 'Never close a disability or declined-claim contact without a named owner and a date',
    evidence: 'Evidence: suspended-payment and claim-dispute sequences drop to CSAT 1 when the close leaves no owner',
    agents: `Agents: ${AGENT_METRICS[BY_CF[2]].name} coaching in progress`,
    rec: 'Recommendation: require an owner and a day on every follow-up close that depends on adjudication or a case manager.',
  },
]

export function getMetricsDrawerSections() {
  return [
    {
      id: 'kpi-csat-drawer',
      label: 'CSAT',
      value: CSAT_EXEC.toFixed(1),
      valueClass: 'val-amber',
      sub: `Target: ${KPIS_EXEC.csat.target}`,
      change: `${(((CSAT_EXEC - KPIS_EXEC.csat.target) / KPIS_EXEC.csat.target) * 100).toFixed(1)}% vs target`,
      changeClass: 'chg-amber',
      series: TREND_EXEC.csat,
      format: 'csat',
      color: '#1a7a4a',
      note: 'Blended CSAT across all contacts. Micro Coaching is recovering the continuation cohort that pulls the blended figure down; the blended figure is moving more slowly, 3.35 to 3.6.',
    },
    {
      id: 'kpi-cf-drawer',
      label: 'Auto-Fail Contacts',
      value: String(CF.currentWeek),
      valueClass: 'val-amber',
      sub: `Peak: ${CF.peakWeek} in week 1`,
      change: 'Down every week since coaching',
      changeClass: 'chg-green',
      series: CF.weekly,
      format: 'whole',
      color: '#d97706',
      note: 'Leading indicator of coaching impact, alongside continuation CSAT.',
    },
    {
      id: 'kpi-rcr-drawer',
      label: 'Repeat Contact Rate',
      value: `${KPIS_EXEC.rcr.blended}%`,
      valueClass: 'val-red',
      sub: `Target: ${KPIS_EXEC.rcr.target}%`,
      change: 'Blended, all contacts',
      changeClass: 'chg-red',
      series: TREND_EXEC.rcr,
      format: 'pct',
      color: '#d97706',
      note: 'Population-wide KPI. Turns more slowly than continuation CSAT after a cohort-level coaching fix.',
    },
    {
      id: 'kpi-esc-drawer',
      label: 'Escalation Rate',
      value: `${KPIS_EXEC.escalation.blended.toFixed(1)}%`,
      valueClass: 'val-amber',
      sub: `Target: ${KPIS_EXEC.escalation.target.toFixed(1)}%`,
      change: 'Disability and claim-decision drag',
      changeClass: 'chg-amber',
      series: TREND_EXEC.esc,
      format: 'pct',
      color: '#c0392b',
      note: 'Disability Claim Status (17%) and Claim Decision Disputes (15%) keep escalation elevated.',
    },
    {
      id: 'kpi-aht-drawer',
      label: 'Average Handle Time',
      value: formatAht(KPIS_EXEC.aht.blended),
      valueClass: 'val-amber',
      sub: `Target: ${formatAht(KPIS_EXEC.aht.target)}`,
      change: 'Voice + messaging blended',
      changeClass: 'chg-amber',
      series: TREND_EXEC.aht,
      format: 'aht',
      color: '#2a4fa8',
      note: 'Disability contacts run longest, as agents check case-manager notes and outstanding requirements.',
    },
    {
      id: 'kpi-fcr-drawer',
      label: 'First Contact Resolution',
      value: `${KPIS_EXEC.fcr.blended.toFixed(1)}%`,
      valueClass: 'val-red',
      sub: `Target: ${KPIS_EXEC.fcr.target}%`,
      change: 'Edging up across the period',
      changeClass: 'chg-amber',
      series: TREND_EXEC.fcr,
      format: 'pct',
      color: '#1a7a4a',
      note: 'Blended FCR. CDCP and disability contacts depend on decisions the frontline can’t make.',
    },
    {
      id: 'kpi-transfer-drawer',
      label: 'Transfer Rate',
      value: `${KPIS_EXEC.transfer.blended.toFixed(1)}%`,
      valueClass: 'val-amber',
      sub: `Target: ${KPIS_EXEC.transfer.target}%`,
      change: 'Above target',
      changeClass: 'chg-amber',
      series: TREND_EXEC.transfer,
      format: 'pct',
      color: '#d97706',
      note: 'Transfers remain above target across the blended population.',
    },
    {
      id: 'kpi-nps-drawer',
      label: 'NPS',
      value: String(KPIS_EXEC.nps.blended),
      valueClass: 'val-red',
      sub: `Target: ${KPIS_EXEC.nps.target}`,
      change: 'Blended, all contacts',
      changeClass: 'chg-red',
      series: TREND_EXEC.nps,
      format: 'whole',
      color: '#2a4fa8',
      note: 'NPS follows the same slow recovery as other population-wide experience metrics.',
    },
  ]
}
