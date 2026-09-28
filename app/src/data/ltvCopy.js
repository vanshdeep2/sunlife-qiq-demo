/**
 * Sun Life (Canada) is one-sided - no supply-side rows anywhere in this file.
 *
 * Plan-sponsor renewal framing (story-spec.financial._note). Members don't
 * choose Sun Life, their employer does, so the churn event is an employer not
 * renewing its group plan, and "member annual value" is the annual premium
 * per covered employee: CA$3,600 = midpoint of the CA$200-400 per employee
 * per month range for 50+ employee Canadian group plans (Sterling Brokers),
 * x 12. A sourced market range, not Sun Life's own pricing.
 * cohortHitWeekly (900) is a modelled estimate of members hitting the
 * claim-decision continuation-failure pattern. churnUpliftPct (1.5) is a
 * modelled incremental non-renewal probability attributable to that member
 * experience. The app computes cohortHitWeekly x churnUpliftPct% x
 * demandSideLtv x 52 at render time. No total is written here.
 */

export const LTV_DEFAULT_ASSUMPTION_TEXT =
  'This panel estimates plan-sponsor renewal risk. Members don’t pick Sun Life, their employer does, so the loss event is an employer not renewing its group plan after its people complain, and Trustpilot reviewers say they are pushing HR and unions to switch. Member annual value of CA$3,600 is the annual premium per covered employee, the midpoint of a published CA$200-400 per month range for Canadian group plans with 50+ employees, not Sun Life’s own pricing. Exposure uses 900 members a week newly hitting the claim-decision follow-up failure, about 5.6% of the ~16,000-contact weekly population, at a 1.5% modelled increase in non-renewal probability. Micro Coaching value protected uses the same 900-member cohort at a 45% protection rate over the four coaching weeks (weeks 2-5), a deliberately conservative assumption. All totals are computed live from these inputs. Change a number and Recalculate to see them move. All figures are estimates, and this demo is illustrative. Sun Life hasn’t shared operational data with QiQ.'

export const RISK_LINES = [
  {
    key: 'periodDemandRiskPrimary',
    title: 'Claim-decision follow-up renewal risk',
    label: '900 members/week · 1.5% non-renewal uplift · CA$3,600 annual premium · 5 weeks',
    description:
      'Members whose declined-claim follow-up goes badly carry that experience back to HR, which feeds the employer’s renewal decision. Per-contact QA still passes while CSAT drops after the first contact. Figure shown for the current 5-week reporting window.',
    legendLabel: 'Claim-decision follow-up',
    dotColor: '#c0392b',
  },
  {
    key: 'periodDemandRiskSecondary',
    title: 'Suspended disability payment tail',
    label: 'Low volume (2.5% of contacts) · disproportionate severity · 5 weeks',
    description:
      'Disability payments suspended pending a form are a small share of contacts, but a claimant with no income is the member most likely to escalate to HR, a union or a public review. A QA sample sized for the average rarely reaches this tail. Figure shown for the current 5-week reporting window.',
    legendLabel: 'Disability suspension tail',
    dotColor: '#d9534f',
  },
  {
    key: 'periodDemandRiskTertiary',
    title: 'Chat-to-phone handoff',
    label: '1,680 contacts weekly · 43% repeat on the cohort · 5 weeks',
    description:
      'Members sent from the AI chat to a phone line that doesn’t answer come back repeatedly and are now writing public reviews about it. Figure shown for the current 5-week reporting window.',
    legendLabel: 'Chat-to-phone handoff',
    dotColor: '#e8806f',
  },
]

export const AT_RISK_LINES = RISK_LINES.map((line) => ({ ...line, valueClass: line.valueClass ?? 'val-red' }))

export const AT_RISK_SIDE_LEGEND = [{ label: 'Annual premium per covered employee', color: '#c0392b' }]

/**
 * Micro Coaching value slices that sum to periodProtected (same relative
 * weights as the at-risk donut). All three are coachable storylines. CDCP
 * pre-authorization (storyline 4, coachable: false) is never credited.
 */
export const COACHING_VALUE_LINES = [
  {
    key: 'periodDemandProtectedPrimary',
    title: 'Claim-decision follow-up renewal risk',
    label: 'Share of 5-week renewal risk protected by coaching',
    description:
      'Largest share of Micro Coaching value protected in the current 5-week window, mirroring the claim-decision weight on the at-risk donut. Estimate, early result.',
    legendLabel: 'Claim-decision follow-up',
    dotColor: '#1a7a4a',
    format: 'usd',
  },
  {
    key: 'periodDemandProtectedSecondary',
    title: 'Suspended disability payment tail',
    label: '12% of base protected value (same weight as at-risk) · 5 weeks',
    description:
      'Value protected on disability follow-up contacts after coaching in the current 5-week window. Estimate, presentation split of the period total.',
    legendLabel: 'Disability suspension tail',
    dotColor: '#228b5a',
    format: 'usd',
  },
  {
    key: 'periodDemandProtectedTertiary',
    title: 'Chat-to-phone handoff',
    label: '10% of base protected value (same weight as the third at-risk slice) · 5 weeks',
    description:
      'Value protected on follow-up contacts from members handed off by the chat, after coaching in the current 5-week window. Estimate, presentation split of the period total. CDCP pre-authorization is deliberately not credited here: it’s a data and process gap, not a coachable behaviour.',
    legendLabel: 'Chat-to-phone handoff',
    dotColor: '#4ade80',
    format: 'usd',
  },
]

export const LTV_SECTION_TITLE = 'Plan-Sponsor Renewal Risk · 5-Week Period'
export const AT_RISK_TITLE = 'Plan-sponsor renewal risk'
export const AT_RISK_RISK_SUBTITLE =
  'Modelled renewal risk in the current 5-week window from follow-up failures on member claims. Members don’t choose Sun Life, so the exposure is the employer’s renewal decision, valued at annual premium per covered employee. One-sided book: no supply-side exposure is modelled or shown. Estimate, in Canadian dollars.'

export const LTV_ASSUMPTION_DEFAULTS = {
  demandSideLtv: 3600,
  cohortHitWeekly: 900,
  churnUpliftPct: 1.5,
  coachingCohortWeekly: 900,
  coachingProtectionPct: 45,
}

export const LTV_UI_LABELS = {
  unitValueLabel: 'Annual premium per covered employee',
  unitValueFormat: 'whole',
  sectionSublabel:
    'Shows plan-sponsor renewal risk and value already protected by Micro Coaching · Estimate · Adjust assumptions using view / edit assumptions',
  riskCardLabel: 'Plan-sponsor renewal risk',
  annualisedRiskLabel: 'Annualised renewal risk',
  coachingCardLabel: 'Renewal risk protected by Micro Coaching · Members',
  annualisedProtectedLabel: 'Annualised protected',
  netEyebrow: 'Total renewal-risk impact surfaced this period',
  netSub: 'Plan-sponsor renewal risk + Micro Coaching value protected · 5 weeks · Estimate',
  coachingDrawerTitle: 'Renewal risk protected by Micro Coaching · Members',
  coachingDrawerSubtitle:
    'CA$ renewal risk protected in the current 5-week window after Micro Coaching went live in week 2, split across the coachable follow-up categories. CDCP pre-authorization is a data fix and isn’t credited to coaching. Estimate.',
  riskDrawerAnnualisedLabel: 'Annualised renewal risk',
  assumptionsTitle: 'Renewal Risk Assumptions',
  assumptionsSubtitle: 'Adjust renewal-risk inputs. Click Recalculate to update figures on the page.',
}

export const LTV_ASSUMPTION_FIELDS = [
  { id: 'demandSideLtv', label: 'Annual premium per covered employee (CA$)', step: 100 },
  { id: 'cohortHitWeekly', label: 'Members hit by follow-up failure / week', step: 1 },
  { id: 'churnUpliftPct', label: 'Non-renewal uplift on cohort (%)', step: 0.1 },
  { id: 'coachingCohortWeekly', label: 'Members reached by coaching / week', step: 1 },
  { id: 'coachingProtectionPct', label: 'Micro Coaching protection rate (%)', step: 1 },
]
