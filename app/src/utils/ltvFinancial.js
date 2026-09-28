/**
 * Marketplace LTV model. Every total below is computed live from the
 * assumptions passed in - nothing is normalised or forced back to a fixed
 * published number. Changing an assumption changes the total, by design.
 * That is the point of the "View / edit assumptions" control on Executive.
 *
 * Two shapes, selected by `brand.MARKETPLACE_TYPE`:
 *
 *   two-sided  demand-side continuation risk + supply-side onboarding
 *              abandonment. Both sides render.
 *   one-sided  demand-side continuation risk only. No supply term is
 *              computed, no supply key is returned, and no supply panel is
 *              rendered anywhere in the UI.
 *
 * Slice keys are generic (`periodDemandRiskPrimary`, not
 * `periodContinuationRisk`) so a client's `data/ltvCopy.js` can name its own
 * risk categories in prose while still binding to a key this model actually
 * produces. Rover's original key names are kept as aliases at the bottom of
 * the return so nothing that still reads them breaks.
 *
 * The three demand-side slices are presentation weights on one modelled
 * total, in fixed order primary / secondary / tertiary. They are not
 * separately sourced figures - the total is what moves with the inputs.
 */

import { IS_TWO_SIDED } from '../config/brand'
import { LTV_ASSUMPTION_DEFAULTS } from '../data/ltvCopy'

/** Weeks 2-5 of the 5-week window once Micro Coaching is live. */
export const COACHING_WEEKS_IN_PERIOD = 4

/** Full reporting window shown on Executive LTV cards. */
export const REPORTING_WEEKS = 5

/** Presentation weights for the three demand-side slices, in render order. */
export const DEMAND_SLICE_WEIGHTS = [1, 0.12, 0.1]

/**
 * Assumption inputs are client data, so they live in `data/ltvCopy.js`
 * (which qiq-content-writer generates) rather than being hardcoded here.
 * The fallback below is only reached if a client pack omits them.
 */
export const LTV_DEFAULTS = LTV_ASSUMPTION_DEFAULTS ?? {
  demandSideLtv: 480,
  supplySideLtv: 1850,
  cohortHitWeekly: 380,
  churnUpliftPct: 12,
  supplyAbandoningWeekly: 22,
  coachingCohortWeekly: 900,
  coachingProtectionPct: 70,
}

export function computeLtvFinancials(assumptions) {
  const {
    demandSideLtv,
    supplySideLtv,
    cohortHitWeekly,
    churnUpliftPct,
    supplyAbandoningWeekly,
    coachingCohortWeekly,
    coachingProtectionPct,
  } = { ...LTV_DEFAULTS, ...assumptions }

  const [w1, w2, w3] = DEMAND_SLICE_WEIGHTS

  // Demand side: annualised revenue at risk from continuation failure, split
  // across the three categories where it concentrates.
  const primaryRisk = cohortHitWeekly * (churnUpliftPct / 100) * demandSideLtv * 52
  const secondaryRisk = primaryRisk * w2
  const tertiaryRisk = primaryRisk * w3
  const totalRisk = primaryRisk + secondaryRisk + tertiaryRisk

  // Supply side: annualised supply loss from onboarding abandonment. Only
  // modelled for a two-sided client — a one-sided client has no supply
  // population, so the term is 0 and every supply key is omitted from the
  // returned object entirely (see the spread at the bottom).
  const supplyLoss = IS_TWO_SIDED ? supplyAbandoningWeekly * 52 * supplySideLtv : 0

  // Micro Coaching value protected: broader cohort than the conservative
  // risk filter, with a protection rate once coaching is live (weeks 2-5).
  const weeklyAtRisk = coachingCohortWeekly * (churnUpliftPct / 100)
  const weeklyRetained = weeklyAtRisk * (coachingProtectionPct / 100)
  const periodRetained = Math.round(weeklyRetained * COACHING_WEEKS_IN_PERIOD)
  const periodValue = periodRetained * demandSideLtv
  const annualRetained = Math.round(weeklyRetained * 52)
  const valueProtected = weeklyRetained * demandSideLtv * 52

  // Presentation split of valueProtected using the same relative weights as
  // demand-side at-risk. Headline total is unchanged.
  const protectedWeight = w1 + w2 + w3
  const primaryProtected = valueProtected * (w1 / protectedWeight)
  const secondaryProtected = valueProtected * (w2 / protectedWeight)
  const tertiaryProtected = valueProtected * (w3 / protectedWeight)

  // 5-week reporting-period views (annualised x 5 / 52). Coaching period
  // value still reflects four active coaching weeks via periodValue.
  const periodDemandRiskPrimary = (primaryRisk / 52) * REPORTING_WEEKS
  const periodDemandRiskSecondary = (secondaryRisk / 52) * REPORTING_WEEKS
  const periodDemandRiskTertiary = (tertiaryRisk / 52) * REPORTING_WEEKS
  const periodSupplyRisk = (supplyLoss / 52) * REPORTING_WEEKS
  const periodExposure =
    periodDemandRiskPrimary +
    periodDemandRiskSecondary +
    periodDemandRiskTertiary +
    periodSupplyRisk

  const periodDemandProtectedPrimary = periodValue * (w1 / protectedWeight)
  const periodDemandProtectedSecondary = periodValue * (w2 / protectedWeight)
  const periodDemandProtectedTertiary = periodValue * (w3 / protectedWeight)
  const periodProtected = periodValue

  const periodSurfaced = periodExposure + periodProtected

  return {
    // -- inputs echoed back, for label interpolation --
    demandSideLtv,
    cohortHitWeekly,
    churnUpliftPct,
    coachingCohortWeekly,
    coachingProtectionPct,

    // -- annualised demand-side --
    primaryRisk,
    secondaryRisk,
    tertiaryRisk,
    totalRisk,

    // -- 5-week demand-side slices (bound by data/ltvCopy.js line keys) --
    periodDemandRiskPrimary,
    periodDemandRiskSecondary,
    periodDemandRiskTertiary,
    periodDemandProtectedPrimary,
    periodDemandProtectedSecondary,
    periodDemandProtectedTertiary,

    // -- coaching --
    weeklyAtRisk,
    weeklyRetained,
    periodRetained,
    periodValue,
    annualRetained,
    valueProtected,
    primaryProtected,
    secondaryProtected,
    tertiaryProtected,

    // -- headline totals --
    totalExposure: totalRisk + supplyLoss,
    totalSurfaced: totalRisk + supplyLoss + valueProtected,
    periodExposure,
    periodProtected,
    periodSurfaced,

    // -- supply side: present ONLY for a two-sided client --
    ...(IS_TWO_SIDED
      ? {
          supplySideLtv,
          supplyAbandoningWeekly,
          supplyLoss,
          totalSupplyRisk: supplyLoss,
          periodSupplyRisk,
          // Modelled at ~100%: the abandonment figure is itself defined as
          // supply-side attrition from onboarding friction, so the queued
          // NBA addresses essentially all of it if deployed.
          supplyAddressable: supplyLoss,
          verificationAddressable: supplyLoss,
        }
      : {}),

    // -- legacy Rover key aliases, kept so older copy files still bind --
    petParentLtvGbp: demandSideLtv,
    continuationRisk: primaryRisk,
    guaranteeTailRisk: secondaryRisk,
    standingRisk: tertiaryRisk,
    periodContinuationRisk: periodDemandRiskPrimary,
    periodGuaranteeRisk: periodDemandRiskSecondary,
    periodStandingRisk: periodDemandRiskTertiary,
    periodContinuationProtected: periodDemandProtectedPrimary,
    periodGuaranteeProtected: periodDemandProtectedSecondary,
    periodStandingProtected: periodDemandProtectedTertiary,
    periodValueGbp: periodValue,
    continuationProtected: primaryProtected,
    guaranteeProtected: secondaryProtected,
    standingProtected: tertiaryProtected,
    ...(IS_TWO_SIDED ? { sitterLtvGbp: supplySideLtv } : {}),
  }
}
