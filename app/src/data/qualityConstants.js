/** Qualitative copy only. Live numbers are interpolated at render time. This demo uses illustrative, synthetic data - Sun Life has not shared operational data with QiQ. */

export const CHEAT_CODE_LABELS = {
  card_1_open_with_incident: 'Card 1: start from the last call',
  card_2_match_register: 'Card 2: let the decision set the tone',
  card_3_route_forward: 'Card 3: name the adjudicator and the date',
  card_4_acknowledge_effort: "Card 4: count the calls they've made",
  cc1: 'Card 1: start from the last call',
  cc2: 'Card 2: let the decision set the tone',
  cc3: 'Card 3: name the adjudicator and the date',
  cc4: "Card 4: count the calls they've made",
}

/**
 * Campaign summaries by week (0-4). Placeholders:
 * {total}, {processAdherencePct}, {resolutionRatePct}, {positiveCsatPct},
 * {criticalFailures}, {heroPct}, {heroCount}, {meanQa}, {overallQa}
 */
export const CAMPAIGN_SUMMARY_BY_WEEK = [
  {
    headline:
      'Quality mining found what per-contact QA can’t see: follow-up contacts on declined claims that pass the scorecard and still fail the member.',
    paragraphs: [
      'Week 1 shows a large block of contacts where the issue was resolved, the process was followed, and CSAT was still negative. Process adherence is {processAdherencePct}% and resolution {resolutionRatePct}% across {total} contacts, yet members are rating the experience poorly.',
      'These are follow-up contacts where the member called back about a declined claim or a stalled disability file and the agent handled it as a new request. A contact can pass every scorecard question and still fail the member.',
      '{criticalFailures} contacts auto-failed this week, the peak of the period. The poor-behaviour, negative-CSAT cell alone holds {heroCount} contacts ({heroPct}% of all contacts that week) with a mean QA of {meanQa}.',
    ],
    wow: 'Auto-fails {criticalFailures} · process adherence {processAdherencePct}% · positive CSAT {positiveCsatPct}% · hero-cell mean QA {meanQa}',
    chips: [
      { text: 'Follow-up claim contacts treated as new calls', className: 'chip-red', dotColor: '#f87171' },
      { text: 'Hero cell mean QA {meanQa} while CSAT drops', className: 'chip-amber', dotColor: '#fbbf24' },
      { text: 'Process adherence {processAdherencePct}% still looks healthy', className: 'chip-green', dotColor: '#4ade80' },
    ],
  },
  {
    headline:
      'Micro Coaching went to the whole team in week 2. Continuation CSAT starts to move, and auto-fails come down from the week-1 peak.',
    paragraphs: [
      'Coaching opens every follow-up contact by naming what’s already on the file. Continuation-cohort CSAT is up from week 1, and auto-fail contacts have come down from their peak.',
      'Process adherence ({processAdherencePct}%) and resolution ({resolutionRatePct}%) remain healthy across {total} contacts. Positive CSAT is {positiveCsatPct}%.',
      'The core point still holds: a contact can pass every scorecard question and still fail the member, and per-contact scoring can’t see the earlier call that drives CSAT down.',
    ],
    wow: 'Auto-fails {criticalFailures} · process adherence {processAdherencePct}% · positive CSAT {positiveCsatPct}% · coaching live from week 2',
    chips: [
      { text: 'Micro Coaching deployed team-wide', className: 'chip-amber', dotColor: '#fbbf24' },
      { text: 'Auto-fails at {criticalFailures}, down from the week-1 peak', className: 'chip-green', dotColor: '#4ade80' },
      { text: 'Blended CSAT still lagging coaching uptake', className: 'chip-amber', dotColor: '#fbbf24' },
    ],
  },
  {
    headline:
      'Auto-fails fall again this week. Continuation CSAT keeps climbing, and the negative-CSAT-despite-good-process cell is the one to watch.',
    paragraphs: [
      'Auto-fail contacts fall to {criticalFailures} this week. Agents are opening more follow-up contacts by naming the earlier call, and continuation CSAT is climbing with it.',
      'Across {total} contacts, process adherence is {processAdherencePct}% and resolution is {resolutionRatePct}%. Positive CSAT sits at {positiveCsatPct}%.',
      'Mean QA in the hero cell is still high at {meanQa}. That’s the proof point: scorecards pass while the member experience fails until behaviour changes.',
    ],
    wow: 'Auto-fails {criticalFailures} · process adherence {processAdherencePct}% · positive CSAT {positiveCsatPct}% · hero-cell mean QA {meanQa}',
    chips: [
      { text: 'Auto-fails at {criticalFailures}, trending down', className: 'chip-green', dotColor: '#4ade80' },
      { text: 'Hero cell still shows high QA ({meanQa})', className: 'chip-amber', dotColor: '#fbbf24' },
      { text: 'Continuation CSAT improving', className: 'chip-green', dotColor: '#4ade80' },
    ],
  },
  {
    headline:
      'Auto-fails fall to {criticalFailures}. CSAT keeps recovering as Micro Coaching becomes habit, and the remaining negative CSAT separates into a different kind of problem.',
    paragraphs: [
      'Process adherence ({processAdherencePct}%) and resolution ({resolutionRatePct}%) hold across {total} contacts. Positive CSAT is {positiveCsatPct}%.',
      'A contact can still pass every scorecard question and fail the member when the blocker is a missing denial reason, not behaviour. CDCP pre-authorization contacts are the clearest case, and the matrix now separates the two.',
      'The coaching loop shows up in the data: detection in week 1, Micro Coaching from week 2, and continuation CSAT and auto-fails improving every week since.',
    ],
    wow: 'Auto-fails {criticalFailures} · process adherence {processAdherencePct}% · positive CSAT {positiveCsatPct}% · continuation recovery underway',
    chips: [
      { text: 'Auto-fails down to {criticalFailures}', className: 'chip-green', dotColor: '#4ade80' },
      { text: 'Data gaps still drive residual negative CSAT', className: 'chip-amber', dotColor: '#fbbf24' },
      { text: 'Behaviour gap no longer the only driver', className: 'chip-green', dotColor: '#4ade80' },
    ],
  },
  {
    headline:
      'Auto-fails close the period at {criticalFailures}, the lowest of the five weeks. CDCP pre-authorization remains an open gap that coaching doesn’t reach.',
    paragraphs: [
      'Week 5 closes with {criticalFailures} auto-fail contacts, the low point of the period, and continuation-cohort CSAT has risen every week since coaching started. Part of the remaining negative CSAT sits in CDCP Pre-Authorization & Coverage, where the denial reason never reaches the agent.',
      'That needs a data and process fix, not more coaching. Process adherence is {processAdherencePct}%, resolution {resolutionRatePct}%, and positive CSAT {positiveCsatPct}% across {total} contacts.',
      'Quality mining found the follow-up gap in week 1, and Micro Coaching from week 2 moved continuation CSAT and auto-fails. Blended CSAT is moving more slowly, 3.35 to 3.6 against a 4.2 target, and the executive summary reports that alongside the win. This demo uses illustrative, synthetic data.',
    ],
    wow: 'Auto-fails at the period low · process adherence {processAdherencePct}% · positive CSAT {positiveCsatPct}% · CDCP data gap remains open',
    chips: [
      { text: 'Continuation CSAT up every week since coaching', className: 'chip-green', dotColor: '#4ade80' },
      { text: 'Residual negative CSAT includes a data gap, not just behaviour', className: 'chip-amber', dotColor: '#fbbf24' },
      { text: 'Per-contact QA would have missed the pattern', className: 'chip-red', dotColor: '#f87171' },
    ],
  },
]


const DEFAULT_OUTCOME =
  'This cell holds {pct}% of all {total} contacts this week ({count} contacts) with a mean quality score of {meanQa}. Dominant categories: {categories}.'

const HERO_OUTCOME =
  'These {count} contacts ({pct}% of all {total} contacts this week) resolved the issue and followed every process step, and still produced a negative rating. A high share are follow-up contacts on a declined claim or disability file where the earlier call went unacknowledged. Mean QA is {meanQa}, so per-contact scoring would pass most of these. Dominant categories: {categories}.'

export function outcomeSummaryTemplate(row, csatBand, behaviourBand) {
  if (row === 0 && csatBand === 'negative' && behaviourBand === 'poor') return HERO_OUTCOME
  return DEFAULT_OUTCOME
}

const DEFAULT_IMPROVEMENTS = [
  'Review the contacts in this cell for process gaps versus emotional register mismatches.',
  'Calibrate team leaders on how high QA can coexist with low CSAT on continuation contacts.',
  'Use the matrix cell as a coaching filter rather than sampling quality scores alone.',
]

const HERO_IMPROVEMENTS = [
  'Acknowledge what’s already on the file before running the process checklist on every follow-up contact.',
  'Name who owns the decision and the day the member will hear back, even when adjudication or a case manager limits what can be resolved on the call.',
  'Match your tone to what the member has been through, like being told a claim was covered, not only to the latest request.',
]

export function improvementOpportunities(row, csatBand, behaviourBand) {
  if (row === 0 && csatBand === 'negative' && behaviourBand === 'poor') return HERO_IMPROVEMENTS
  return DEFAULT_IMPROVEMENTS
}

const DEFAULT_ACTIONS = {
  contactCentre: [
    'Add this cell to the weekly team-leader calibration queue.',
    'Spot-check recent contacts for empathy and ownership language.',
    'Keep QA forms focused on process, and use the matrix for behavioural risk.',
  ],
  prevention: [
    'Surface open-claim and disability-file context in the agent desktop before the first reply.',
    'Reduce handoffs that strip account history from the next contact.',
    'Flag data-gap categories (like CDCP denial reasons) separately so coaching isn’t asked to fix them.',
  ],
}

const HERO_ACTIONS = {
  contactCentre: [
    'Deploy Card 1: start from the last call (Micro Coaching from week 2).',
    'Deploy Card 2: let the decision set the tone, and Card 3: name the adjudicator and the date.',
    'Use Card 4: count the calls they’ve made, on repeat contacts. Calibrate QA so auto-fails feed this coaching loop.',
  ],
  prevention: [
    'Auto-surface earlier contacts on the same claim, including any coverage confirmation, in the agent workspace.',
    'Separate data-gap outcomes from behavioural failures in reporting so leadership sees which lever to pull.',
    'Pass the CDCP denial reason to the agent desktop and the letter, so members and dental offices stop calling back to ask why.',
  ],
}

export function recommendedActions(row, csatBand, behaviourBand) {
  if (row === 0 && csatBand === 'negative' && behaviourBand === 'poor') return HERO_ACTIONS
  return DEFAULT_ACTIONS
}

export function interpolate(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = vars[key]
    return value == null ? '' : String(value)
  })
}

export const ROW_LABELS = [
  {
    lines: [
      { ok: true, text: 'Resolution Achieved' },
      { ok: true, text: 'Process Followed' },
    ],
  },
  {
    lines: [
      { ok: false, text: 'Resolution Not Achieved' },
      { ok: true, text: 'Process Followed' },
    ],
  },
  {
    lines: [
      { ok: true, text: 'Resolution Achieved' },
      { ok: false, text: 'Process Not Followed' },
    ],
  },
  {
    lines: [
      { ok: false, text: 'Resolution Not Achieved' },
      { ok: false, text: 'Process Not Followed' },
    ],
  },
]

export const CSAT_COLUMN_META = [
  { key: 'positive', label: 'Positive (4-5)', className: 'qa-col-positive' },
  { key: 'neutral', label: 'Neutral (3)', className: 'qa-col-neutral' },
  { key: 'negative', label: 'Negative (1-2)', className: 'qa-col-negative' },
]

export const FRUSTRATION_KEYWORDS = [
  'again',
  'still waiting',
  'already told',
  'exhausted',
  'stressed',
  'concerned',
  'frustrated',
  'unacceptable',
  'escalate',
  'on hold',
  'no income',
]

/**
 * One-line definitions under the Quality Diagnostics metric cards.
 *
 * "Call Resolution Rate" here is the share of contacts resolved *eventually*.
 * Executive's "First contact resolution" KPI is the share resolved on the
 * first attempt with no repeat. The two are different measures of different
 * things and will not match - with a 27.8% repeat contact rate, an ~87%
 * eventual-resolution rate and a ~64% first-contact-resolution rate are
 * consistent with each other. These sub-labels exist so neither page can be
 * read as quoting the same number twice.
 */
export const METRIC_CARD_NOTES = {
  processAdherence: 'Scorecard process steps followed',
  resolution: 'Resolved eventually · not the same as first-contact resolution',
  positiveCsat: 'CSAT 4 or 5',
}
