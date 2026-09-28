import { AGENT_SLUGS } from './agents'

export { AGENT_SLUGS }

export const Q_NAMES = {
  q1: 'Resolution',
  q2: 'Diagnosis',
  q3: 'Efficiency',
  q4: 'Verification',
  q5: 'Escalation',
  q6: 'Expectation Setting',
  q7: 'Communication',
  q8: 'Callback',
  q9: 'Closing the Loop',
  q10: 'Member Appreciation',
  q11: 'Case Notes',
  q12: 'Internal Process',
  q13: 'Plan Policy',
  q14: 'Privacy & Compliance',
}

export const PASS_FAIL_QS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q11']

export const DEFAULT_FILTERS = {
  agent: 'all',
  source: 'all',
  queue: 'all',
  week: 'all',
  resolution: 'all',
  dateFrom: '2026-08-24',
  dateTo: '2026-09-27',
  scoreFilter: 'all',
  criticalOnly: false,
}

export const WEEK_BOUNDARIES = [
  { start: '2026-08-24', end: '2026-08-30' },
  { start: '2026-08-31', end: '2026-09-06' },
  { start: '2026-09-07', end: '2026-09-13' },
  { start: '2026-09-14', end: '2026-09-20' },
  { start: '2026-09-21', end: '2026-09-27' },
]

export const SORTABLE_FIELDS = [
  'contact_id',
  'agent_name',
  'call_date',
  'call_category',
  'qa_score',
  'contact_sequence',
]

/**
 * Critical-failure quick links on Contact Search, verified against the
 * generated index (app/public/data/sunlife_contact_index.json).
 */
export const CF_QUICK_LINKS = [
  { callId: 'SL-003002', agent: 'Priya Sandhu', label: 'Covered on the phone, declined at adjudication · follow-up' },
  { callId: 'SL-003006', agent: 'Marc Tremblay', label: 'Disability payment suspended pending a form' },
  { callId: 'SL-002192', agent: 'Aisha Rahman', label: 'Auto-fail · CDCP Pre-Authorization & Coverage' },
  { callId: 'SL-002238', agent: 'Aisha Rahman', label: 'Auto-fail · Digital Access & Claim Submission' },
]
