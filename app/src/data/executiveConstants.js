/**
 * Sourced from clients/sunlife/story-spec.json and the qiq-dataset-builder
 * output (contacts/agent_metrics.json). Population, KPI, driver and financial
 * figures are direct field lookups from the spec; auto-fail counts are summed
 * from agentMetrics.js at build time, never restated. Weekly trend shapes for
 * aht/fcr/escalation/transfer/nps are illustrative interpolations that end
 * exactly on the current blended KPI value; csat and repeat-contact-rate
 * weekly shapes are copied from story-spec.kpis.fiveWeekTrend.
 * This demo uses illustrative, synthetic contact-centre data. Sun Life has
 * not shared operational data with QiQ. External review figures are real.
 */
import { AGENT_METRICS, AGENT_METRIC_ORDER } from './agentMetrics'

export const LIVE_LABEL = 'Live · 5-week window'
export const CALLS_PILL = '80,000 contacts analysed'
export const EXTRACT_NOTE =
  'Contact Search carries a 3,007-record working extract of the 80,000-contact population.'

export const PERIOD_LABEL = '24 Aug - 27 Sep 2026'
export const WK_LABELS = ['24-30 Aug', '31 Aug-6 Sep', '7-13 Sep', '14-20 Sep', '21-27 Sep']
export const WK5 = WK_LABELS

export const POPULATION = {
  weeklyTotal: 16000,
  weeks: 5,
  estimatedPopulation: 80000,
  extractSize: 3007,
  voiceShare: 70.0,
  messagingShare: 30.0,
  firstContacts: 11520,
  continuationContacts: 4480,
  continuationShare: 28.0,
}

export const KPIS = {
  aht: { voice: 560, messaging: 300, blended: 482, target: 420 },
  fcr: { voice: 66.0, messaging: 60.0, blended: 64.2, target: 78.0 },
  escalation: { voice: 11.0, messaging: 7.5, blended: 10.0, target: 5.0 },
  csat: { voice: 3.5, messaging: 3.2, blended: 3.4, target: 4.2 },
  nps: { voice: 4, messaging: -3, blended: 2, target: 25 },
  rcr: { voice: 26.0, messaging: 32.0, blended: 27.8, target: 15.0 },
  transfer: { voice: 17.0, messaging: 11.0, blended: 15.2, target: 8.0 },
}

/** Aliases for healthScore.js (component contract). */
export const ACTUAL_AHT = KPIS.aht.blended
export const FCR = KPIS.fcr.blended
export const ESC_RATE = KPIS.escalation.blended
export const TR_RATE = KPIS.transfer.blended
export const RCR_RATE = KPIS.rcr.blended
export const ER_TARGET = KPIS.escalation.target
export const TR_TARGET = KPIS.transfer.target
export const RCR_TARGET = KPIS.rcr.target
export const CSAT = KPIS.csat.blended

export const DEFAULTS = {
  targetAht: KPIS.aht.target,
  costPerMin: 0.45,
  escMultiplier: 1.5,
  weeklyCalls: POPULATION.weeklyTotal,
}

/**
 * Blended CSAT is flat for three weeks then rises (story-spec.kpis.fiveWeekTrend.csat,
 * matched to the generated contacts). Repeat contact rate falls every week.
 * Both are population-wide and move more slowly than the coached continuation cohort (see
 * CONTINUATION_CSAT_RECOVERY, from story-spec.coaching.effectSeriesCsat).
 */
export const FIVE_WEEK_TREND = {
  weeks: WK_LABELS,
  csat: [3.35, 3.35, 3.35, 3.5, 3.6],
  rcr: [29.5, 29.0, 28.0, 27.0, 25.5],
  // Illustrative interpolation ending on KPIS.escalation.blended (10.0).
  escalation: [11.2, 11.0, 10.6, 10.3, 10.0],
}

/** Illustrative interpolations ending on the current blended KPI value. */
export const TREND = {
  csat: FIVE_WEEK_TREND.csat,
  rcr: FIVE_WEEK_TREND.rcr,
  esc: FIVE_WEEK_TREND.escalation,
  aht: [505, 498, 492, 487, 482],
  fcr: [61.5, 62.2, 63.0, 63.6, 64.2],
  transfer: [16.4, 16.1, 15.8, 15.5, 15.2],
  nps: [-3, -2, 0, 1, 2],
}

/** Micro Coaching applied from week 2 (story-spec.coaching.appliedFromWeek). */
export const COACHING_WEEK_INDEX = 1 // week 2, 0-indexed

/** Team-wide auto-fail QA outcomes, summed by week across agentMetrics.js. */
const CF_WEEKLY = [0, 1, 2, 3, 4].map((i) =>
  AGENT_METRIC_ORDER.reduce((sum, slug) => sum + AGENT_METRICS[slug].criticalFailureSeries[i], 0),
)
export const CRITICAL_FAILURES = {
  weekly: CF_WEEKLY,
  totalThisPeriod: CF_WEEKLY.reduce((a, b) => a + b, 0),
  currentWeek: CF_WEEKLY[4],
  peakWeek: Math.max(...CF_WEEKLY),
  category:
    'Auto-fail outcomes concentrated on follow-up contacts about declined claims and disability files opened without acknowledging the previous call, and closed without naming who owns the decision',
}

/** Continuation-cohort CSAT, copied from story-spec.coaching.effectSeriesCsat. */
export const CONTINUATION_CSAT_RECOVERY = {
  weekly: [1.6, 1.7, 2.0, 2.3, 2.4],
  startValue: 1.6,
  currentValue: 2.4,
}

/** story-spec.firstVsContinuation.qaScorecardPct.continuation, direct lookup. */
export const CONTINUATION_QA_WEEKLY = [86.0, 86.0, 86.0, 86.0, 86.0]

/**
 * From story-spec.storylines[2].stats (the chat-to-phone handoff storyline):
 * Digital Access & Claim Submission is 10.5% of weekly volume (1,680
 * contacts) with a 43% repeat-contact rate on that cohort against 27.8%
 * overall. affectedCount = 43% of 1,680.
 */
export const EMPATHY_GAP_STAT = {
  category: 'Digital Access & Claim Submission (App, Portal, Chat Handoff)',
  categoryVolume: 1680,
  affectedCount: 722,
  affectedSharePct: 43.0,
}

/** story-spec.firstVsContinuation, direct lookup. */
export const FIRST_VS_CONTINUATION = {
  csat: { first: 4.0, continuation: 2.0 },
  ahtSeconds: { first: 520, continuation: 390 },
  behaviourScore: { first: 4.2, continuation: 2.5 },
  qaScorecardPct: { first: 90.0, continuation: 86.0 },
  processAdherencePct: { first: 95, continuation: 90 },
  resolutionRatePct: { first: 87, continuation: 71 },
}

/**
 * Population-level QA-outcome-by-CSAT-band matrix. Illustrative distribution
 * consistent with story-spec's resolution and process-adherence figures,
 * summing to POPULATION.weeklyTotal (16,000). An inference, not a sourced field.
 */
export const QUALITY_OUTCOME_MATRIX = {
  overallQaAveragePct: 86.3,
  rows: [
    { label: 'Followed + Resolved', high: 7470, med: 2530, low: 2070 },
    { label: 'Followed + Not Resolved', high: 400, med: 930, low: 1270 },
    { label: 'Not Followed + Resolved', high: 330, med: 240, low: 200 },
    { label: 'Not Followed + Not Resolved', high: 50, med: 130, low: 380 },
  ],
  headlineCell: {
    label: 'Followed + Resolved + Low CSAT',
    contacts: 2070,
    shareOfTotalPct: 12.9,
    continuationShareOfCellPct: 66,
    qaAveragePct: 87.9,
  },
}

/**
 * Plan-sponsor renewal framing (story-spec.financial._note): members don't
 * choose Sun Life, their employer does, so the churn event is an employer
 * not renewing. demandSideLtv = CA$3,600 annual premium per covered employee
 * (midpoint of a sourced CA$200-400/month range for 50+ employee plans).
 * Totals are computed at render time from these inputs.
 */
export const FINANCIAL_ESTIMATES = {
  demandSideLtv: 3600,
  cohortHitWeekly: 900,
  churnUpliftPct: 1.5,
}

export const OVERALL_QA_PCT = 86.3

export const PERIOD_WEEKS = 5
export const REPEAT_CONTACTS = 4480
export const UNNECESSARY_ESCALATIONS = Math.round(POPULATION.weeklyTotal * (ESC_RATE / 100))

/** Weekly taxonomy from story-spec.json drivers. */
export const DRIVER_ROWS = [
  { name: 'Claim Decision Disputes (Health, Drug & Dental)', volume: 3200, share: 20.0, fcr: 55, aht: 560, esc: 15 },
  { name: 'Additional Information Requests (Forms, Prior Auth, Attachments)', volume: 2320, share: 14.5, fcr: 58, aht: 470, esc: 9 },
  { name: 'Disability Claim Status (STD / LTD)', volume: 1920, share: 12.0, fcr: 52, aht: 640, esc: 17 },
  { name: 'Claim Payment & Reimbursement Status', volume: 1760, share: 11.0, fcr: 66, aht: 380, esc: 7 },
  { name: 'Digital Access & Claim Submission (App, Portal, Chat Handoff)', volume: 1680, share: 10.5, fcr: 61, aht: 430, esc: 8 },
  { name: 'CDCP Pre-Authorization & Coverage', volume: 1600, share: 10.0, fcr: 50, aht: 510, esc: 12 },
  { name: 'Group Retirement Transfers & Withdrawals', volume: 1360, share: 8.5, fcr: 63, aht: 540, esc: 10 },
  { name: 'Coverage & Eligibility Questions (routine)', volume: 1280, share: 8.0, fcr: 85, aht: 260, esc: 2 },
  { name: 'Premiums, Billing & Account Changes', volume: 880, share: 5.5, fcr: 78, aht: 300, esc: 3 },
]

const cfSeq = CRITICAL_FAILURES.weekly.join(' → ')

export const CROSS_KPI_PATTERNS = [
  {
    label: 'Cross-KPI Pattern 1',
    headline: 'Told it was covered on the phone. Declined when the claim came in.',
    body: 'First-contact CSAT 4.0 against 2.0 on the follow-up, while QA barely moves (90.0% to 86.0%). A per-contact scorecard can’t see that the second call is about the same claim.',
    rootCause:
      `Claim Decision Disputes is the largest category in the taxonomy at 20.0% of weekly volume (3,200 contacts). Its biggest sub-driver is a member told by phone that a service was covered and then declined at adjudication (960 a week). The same pattern appears on Sun Life's public Trustpilot page (1.2 out of 5, 428 reviews): one member "was told we were fully covered" before the claim was declined, and another wrote that "for the same medical submission, sometimes it is accepted and sometimes it is denied." One member's sequence shows it directly. The first contact scored CSAT 4 and QA 91%. Three follow-ups scored CSAT 2, 1 and 1 while QA held at 85-89%. Cards 1 and 2 (start from the last call, let the decision set the tone) went live in week 2. Continuation CSAT has moved every week since, 1.6 to 2.4, and auto-fails went ${cfSeq}.`,
    trend: {
      title: 'Continuation-cohort CSAT · 5-week',
      weeks: WK_LABELS,
      data: [1.6, 1.7, 2.0, 2.3, 2.4],
      color: '#2a4fa8',
      coachingWeekIndex: 1,
    },
    driversTable: {
      columns: ['Signal', 'Detail'],
      rows: [
        { a: 'Dominant driver', b: 'Claim Decision Disputes · 20.0% of weekly volume, 3,200 contacts' },
        { a: 'Largest sub-driver', b: 'Coverage confirmed by phone, claim later declined · 960 a week' },
        { a: 'Coaching deployed', b: 'Week 2, cards 1 and 2 to all ten agents' },
        { a: 'Auto-fail outcomes', b: cfSeq },
      ],
    },
  },
  {
    label: 'Cross-KPI Pattern 2',
    headline: 'Disability payments stopped pending a form, and nobody called to say so',
    body: '2.5% of contacts (400 a week), but the sharpest CSAT collapse in the build. The member is off work with no income while the file waits on a physician form.',
    rootCause:
      'This comes from the "benefits suspended pending medical information" sub-driver inside Disability Claim Status (20.8% of that 1,920-a-week category). Disability claimants are about 10 of the 120 Trustpilot reviews read and the most severe: "My disability benefits were stopped in January 2026", a decision voicemail where "no voicemail was ever received", and "going on 3 months not paying me". In the modelled sequence the first contact scored CSAT 3 and QA 90%. The member learned about the suspension on that call. The next two scored CSAT 1 while QA held at 84-85%. The suspension may be correct under the policy. What fails is that no one called first, named the form, or said who owns it.',
    trend: {
      title: 'Suspended-payment incident CSAT · contact sequence',
      weeks: ['Contact 1', 'Contact 2', 'Contact 3'],
      data: [3, 1, 1],
      color: '#c0392b',
    },
    driversTable: {
      columns: ['Contact', 'Detail'],
      rows: [
        { a: 'Contact 1 · payment missing', b: 'CSAT 3 · QA 90% · voice' },
        { a: 'Contact 2 · still suspended', b: 'CSAT 1 · QA 84% · voice' },
        { a: 'Contact 3 · member chases again', b: 'CSAT 1 · QA 85% · voice' },
      ],
    },
  },
  {
    label: 'Cross-KPI Pattern 3',
    headline: 'The chat sent them to the phone. The phone rang out. Then the reviews came.',
    body: 'Trustpilot reviews of sunlife.ca went from 2 in August to 11 in the first 26 days of September, and 9 of the 11 are about reaching someone. Inside the contact centre, handoff contacts were already climbing.',
    rootCause:
      'Digital Access & Claim Submission is 10.5% of weekly volume (1,680 contacts). 24% close with no resolution path, and repeat contact rate on this cohort is 43% against 27.8% overall. These members arrive having already been told by the AI chat to call, or having waited for an IVR call-back that came once. Public side, real and counted directly: "The AI assistant told me to call them", "waiting 1 hour and a half on hold", "Their 1-877-786-5433 number goes unanswered". Internal side, modelled: handoff contacts rose about 9 days before the public spike (correlation 0.71). The app itself rates 4.5 on iOS and 4.0 on Android, so digital works for routine claims. The failure sits at the handoff to a person.',
    trend: {
      title: 'Trustpilot reviews of sunlife.ca · monthly',
      weeks: ['August 2026', 'September 2026 (to 26th)'],
      data: [2, 11],
      color: '#c0392b',
    },
    driversTable: {
      columns: ['Signal', 'Detail'],
      rows: [
        { a: 'Internal', b: '24% closed with no resolution path · 43% repeat contact rate on this cohort' },
        { a: 'External (real)', b: '11 Trustpilot reviews in September vs 2 in August · 9 of 11 about access' },
        { a: 'Lead time (modelled)', b: 'Internal rise ~9 days ahead of the public spike · correlation 0.71' },
      ],
    },
  },
  {
    label: 'Cross-KPI Pattern 4',
    headline: 'The pre-authorization says "does not meet plan criteria". The agent can’t see why either.',
    body: '1,600 CDCP Pre-Authorization & Coverage contacts a week. 580 are avoidable, created because the denial reason never reaches the member, the dentist or the agent.',
    rootCause:
      'This is a process and data gap, not a behaviour gap. CDCP coverage criteria are set by Health Canada and applied through a standardized assessment. About half of complex pre-authorizations (crowns, dentures) were rejected after the 18-64 expansion, and denial letters have not given specific reasons (CBC, May 2026). A dental office administrator described "rejection after rejection after rejection without any details or instructions." 36% of these contacts repeat within seven days and 41% come from dental offices, not members. Coaching can’t surface a reason code the agent’s desktop doesn’t carry, so this pattern stays open here.',
    trend: {
      title: 'CDCP Pre-Authorization & Coverage · weekly contact volume',
      weeks: WK_LABELS,
      data: [1540, 1570, 1600, 1630, 1600],
      color: '#d97706',
    },
    driversTable: {
      columns: ['Item', 'Detail'],
      rows: [
        { a: 'Root cause', b: 'Denial reason not passed to the letter, the dental office or the agent desktop' },
        { a: 'Avoidable volume', b: '580 weekly contacts, 36% of this driver' },
        { a: 'Owner', b: 'CDCP operations with Health Canada, not agent behaviour. Not a coaching fix' },
      ],
    },
  },
]

export const HERO_CHIPS = [
  { text: 'CSAT 2.0 on follow-up vs 4.0 first contact', className: 'chip-red', dotColor: '#fca5a5' },
  { text: 'QA still 86.0% on follow-up contacts', className: 'chip-amber', dotColor: '#fbbf24' },
  { text: 'Team QA averages 86.3%. Looks healthy', className: 'chip-green', dotColor: '#4ade80' },
]

export const BRIEFING_TITLE = 'Sun Life Intelligence Briefing'

export const HERO_CONTENT = {
  subtitleSuffix: 'Quality scoring said this period was fine. It wasn’t, and this is where the two views separate.',
  eyebrow: 'QiQ Weekly Intelligence · Week 5 of 5',
  headline: 'Claim decisions drive the most contacts, and they break on the second call.',
  paragraphs: [
    'Claim Decision Disputes is the largest category in Sun Life’s member contact taxonomy at 20% of weekly volume (3,200 of roughly 16,000 contacts). The most common version is a member who was told on the phone that a treatment was covered, then saw the claim declined. The same pattern shows up on Sun Life’s public Trustpilot page (1.2 out of 5, 428 reviews). The first call usually goes well, with first-contact CSAT at 4.0. When the same member calls back, continuation CSAT is 2.0 and ownership of the issue scores 2.0 out of 5.',
    'Micro Coaching on opening from the previous call and naming who owns the decision was applied from week 2. Continuation CSAT moved from 1.6 in week 1 to 2.4 in week 5. The sharpest tail is smaller: 2.5% of volume is disability claimants whose payments were suspended pending a physician form, often without a call to tell them. Coaching on proactive call-backs applies there too. CDCP pre-authorization denials are different. They come back without a reason the agent can see, because the criteria are set by Health Canada. That’s a data and process gap, and coaching won’t close it. The pattern to watch is members bounced between the AI chat and a phone line that doesn’t answer. Trustpilot went from 2 reviews in August to 11 in September, and 9 of those are about access.',
  ],
  wow: `Continuation-cohort CSAT 1.6 → 2.4 since coaching · continuation QA flat at 86.0% throughout · auto-fail contacts ${cfSeq}`,
  readingNote:
    'Micro Coaching went live in week 2, marked on every chart below. Continuation-cohort CSAT responds directly to coaching and has climbed every week since. Auto-fail contacts fell every week from their week-1 peak. The other tiles are blended, population-wide KPIs across all 16,000 weekly contacts, and they move more slowly, which is expected after four weeks of coaching. Judge the intervention on continuation CSAT and auto-fails now, and on repeat contact rate next quarter. This demo uses illustrative contact-centre data. The review figures are real.',
}

export const KPI_TILE_META = {
  csat: { label: 'CSAT', colour: 'amber' },
  criticalFailures: {
    label: 'Auto-fail contacts',
    target: `Peak: ${CRITICAL_FAILURES.peakWeek} in week 1`,
    changeText: `W1 ${CRITICAL_FAILURES.weekly[0]} → W5 ${CRITICAL_FAILURES.currentWeek}. Down every week`,
    varianceDirection: 'down',
    colour: 'amber',
    drillLabel: 'View auto-fail contacts →',
  },
  rcr: { label: 'Repeat contact rate', changeText: 'Blended, all contacts', colour: 'red' },
  escalation: { label: 'Escalation rate', changeText: 'Disability and claim-decision drag', colour: 'amber' },
  aht: { label: 'AHT', changeText: 'Voice + messaging blended', colour: 'amber' },
  // "First contact" deliberately: share resolved on the first attempt with no
  // repeat. Quality Overview's "Call Resolution Rate" is resolved eventually.
  fcr: { label: 'First contact resolution', changeText: 'Resolved on first attempt, no repeat', colour: 'red' },
  transfer: { label: 'Transfer rate', changeText: 'Above target', colour: 'amber' },
  nps: { label: 'NPS', changeText: 'Blended, all contacts', colour: 'amber' },
}

export const METRIC_ROOT_CAUSE = {
  csat: {
    rootCause:
      'Blended CSAT is pulled down by follow-up contacts on Claim Decision Disputes and Disability Claim Status. A member reaching a second agent about the same declined claim rates the experience 2.0 on average, against 4.0 on the first contact, because the conversation starts over.',
    drivers: [
      { a: 'Claim Decision Disputes', b: 'Continuation contacts at 2.0 CSAT vs 4.0 on first contact' },
      { a: 'Disability Claim Status', b: 'Suspended-payment sequences reach CSAT 1 by the second call' },
      { a: 'Micro Coaching', b: 'Continuation-cohort CSAT 1.6 → 2.4 since week 2' },
    ],
  },
  rcr: {
    rootCause:
      'Contacts that pass every scorecard question and still leave the member without an answer come back within the week. Repeats concentrate in Claim Decision Disputes and in members handed from the AI chat to a phone queue.',
    drivers: [
      { a: 'Claim Decision Disputes', b: 'Largest single driver at 20.0% of weekly volume' },
      { a: 'Digital Access & Claim Submission', b: '43% repeat contact rate on this cohort vs 27.8% overall' },
      { a: 'CDCP Pre-Authorization', b: '36% repeat within seven days. Not a coaching item' },
    ],
  },
  escalation: {
    rootCause:
      'Escalations concentrate on Disability Claim Status (17%) and Claim Decision Disputes (15%), where members push past the first answer once a payment or a covered claim has already gone wrong.',
    drivers: [
      { a: 'Disability Claim Status (STD / LTD)', b: '17% escalation rate, the highest of any category' },
      { a: 'Claim Decision Disputes', b: '15% escalation rate' },
      { a: 'CDCP Pre-Authorization & Coverage', b: '12%, often a supervisor request for a denial reason' },
    ],
  },
  aht: {
    rootCause:
      'Handle time runs longest on disability contacts, which need case-manager notes and an outstanding-requirements check, and on claim disputes, where agents compare the claim against earlier paid claims and the plan booklet.',
    drivers: [
      { a: 'Disability Claim Status (STD / LTD)', b: 'Highest AHT, avg 640s' },
      { a: 'Claim Decision Disputes', b: 'avg 560s' },
      { a: 'Group Retirement Transfers & Withdrawals', b: 'avg 540s' },
    ],
  },
  fcr: {
    rootCause:
      'FCR drops where the frontline can’t make the decision: a disability case manager, an adjudicator, or CDCP criteria owned outside Sun Life.',
    drivers: [
      { a: 'CDCP Pre-Authorization & Coverage', b: '50% FCR. The agent can’t see the denial reason' },
      { a: 'Disability Claim Status', b: '52% FCR. Depends on the case manager' },
      { a: 'Claim Decision Disputes', b: '55% FCR. Often needs an adjudication review' },
    ],
  },
  transfer: {
    rootCause:
      'Transfers cluster where the first agent can’t act: adjudication reviews, disability case management and retirement-plan transfers all sit with specialist teams.',
    drivers: [
      { a: 'Claim Decision Disputes', b: 'Routed to adjudication for review' },
      { a: 'Disability Claim Status', b: 'Routed to the case manager' },
      { a: 'Group Retirement Transfers & Withdrawals', b: 'Routed to retirement services' },
    ],
  },
  nps: {
    rootCause:
      'Detractors cluster where CSAT falls: follow-up contacts that restart the conversation, and members who reached a person only after the chat and IVR sent them round in a loop.',
    drivers: [
      { a: 'Continuation contacts', b: 'Lowest-scoring group at 2.0 CSAT, the direct target of Micro Coaching' },
      { a: 'Digital Access & Claim Submission', b: 'Members arrive already frustrated by the handoff' },
      { a: 'CDCP Pre-Authorization', b: 'Process gap, not addressed by coaching, stays a detractor source' },
    ],
  },
}
