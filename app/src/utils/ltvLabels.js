/**
 * UI labels for the LTV / financial panel (Executive section, breakdown
 * drawers, assumptions modal). Defaults reproduce the original marketplace
 * "LTV at risk" wording. A client's `data/ltvCopy.js` may export
 * `LTV_UI_LABELS` to override any of them - e.g. a regulated monopoly where
 * customers cannot leave, so "LTV at risk" framing would be factually wrong.
 *
 * Read through a namespace import so client packs that do not define
 * LTV_UI_LABELS still build.
 */
import * as LTV_COPY from '../data/ltvCopy'
import { IS_TWO_SIDED, NOUNS, NOUNS_CAP } from '../config/brand'

const DEFAULT_LABELS = {
  unitValueLabel: IS_TWO_SIDED ? 'Two-sided marketplace' : `${NOUNS_CAP.demandSide} LTV`,
  unitValueFormat: 'k', // 'k' (CA$1k) | 'whole' (CA$1,080)
  sectionSublabel:
    'Shows LTV still at risk and value already protected by Micro Coaching · Estimate · Adjust assumptions using view / edit assumptions',
  riskCardLabel: IS_TWO_SIDED
    ? `${NOUNS_CAP.demandSide} LTV at risk · Two-sided marketplace`
    : `${NOUNS_CAP.demandSide} LTV at risk`,
  annualisedRiskLabel: 'Annualised at risk',
  coachingCardLabel: `LTV protected by Micro Coaching · ${NOUNS_CAP.demandSidePlural}`,
  annualisedProtectedLabel: 'Annualised protected',
  netEyebrow: 'Total LTV impact surfaced this period',
  netSub: IS_TWO_SIDED
    ? `${NOUNS_CAP.demandSide} + ${NOUNS.supplySide} at risk + Micro Coaching value protected · 5 weeks · Estimate`
    : `${NOUNS_CAP.demandSide} LTV at risk + Micro Coaching value protected · 5 weeks · Estimate`,
  coachingDrawerTitle: `LTV protected by Micro Coaching · ${NOUNS_CAP.demandSidePlural}`,
  coachingDrawerSubtitle: `${NOUNS.currency} protected in the current 5-week window after Micro Coaching went live in week 2, split across the same continuation categories as ${NOUNS.demandSide}-at-risk. Estimate.`,
  riskDrawerAnnualisedLabel: 'Annualised at risk',
  assumptionsTitle: 'LTV Assumptions',
  assumptionsSubtitle: `Adjust ${NOUNS.demandSide} LTV inputs. Click Recalculate to update figures on the page.`,
}

export const LTV_LABELS = { ...DEFAULT_LABELS, ...(LTV_COPY.LTV_UI_LABELS ?? {}) }
