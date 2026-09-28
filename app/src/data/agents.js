/**
 * Agent profiles. All performance numbers are derived from agentMetrics.js,
 * which mirrors clients/sunlife/contacts/agent_metrics.json
 * (qiq-dataset-builder output). Nothing numeric here is authored.
 *
 * Only qualitative copy (status thresholds, note threads) is written by
 * hand. This demo uses illustrative, synthetic data - Sun Life has not
 * shared operational data with QiQ (see story-spec.json).
 */
import {
  AGENT_METRICS,
  AGENT_METRIC_ORDER,
  CARD_SHAPE_LABELS,
  COACHING_WEEK_INDEX,
  FLAGGED_AGENT_SLUGS,
  TEAM_AGGREGATES,
  WK_LABELS,
} from './agentMetrics'

export { WK_LABELS, COACHING_WEEK_INDEX, TEAM_AGGREGATES, FLAGGED_AGENT_SLUGS, CARD_SHAPE_LABELS }

export const AGENT_ORDER = AGENT_METRIC_ORDER

export const AGENT_SLUGS = Object.fromEntries(
  AGENT_METRIC_ORDER.map((slug) => [AGENT_METRICS[slug].name, slug]),
)

/**
 * Team-wide card library, kept for the coaching-adoption rollup. Per-agent
 * packs live on each agent as `coachingPack` and are selected from this same
 * library by the gap detector, so the two never drift apart. say_unspoken is
 * not part of the rotation for Sun Life (one-sided client, no supply side
 * to address) - only the four topics below appear anywhere in the coaching
 * content.
 */
export const MICRO_COACHING_CARDS = [
  {
    id: 'card_1_open_with_incident',
    title: 'Start From the Last Call',
    body: "Read what's already on the file before responding to a follow-up contact. The member isn't starting from zero.",
  },
  {
    id: 'card_2_match_register',
    title: 'Let the Decision Set the Tone',
    body: 'A claim declined after someone said it was covered is not a routine coverage question. Match your tone to how the member actually feels.',
  },
  {
    id: 'card_3_route_forward',
    title: 'Name the Adjudicator and the Date',
    body: "Name the owning team and a day before closing, even when you can't resolve the claim or the disability file yourself on this call.",
  },
  {
    id: 'card_4_acknowledge_effort',
    title: "Count the Calls They've Made",
    body: 'When a member says they have already called or waited on hold, acknowledge the repeat specifically before moving to the answer.',
  },
]

/** Display names for card affectedKpis keys (same map as MicroCoachingCard). */
const KPI_LABELS = { csat: 'CSAT', fcr: 'FCR', aht: 'AHT', repeat_contact_rate: 'Repeat contacts' }

/** Status is derived from real critical failures and CSAT. */
function statusFor(m) {
  if (m.criticalFailures >= 45) return 'Action Needed'
  if (m.criticalFailures >= 25 || m.continuationCsat < TEAM_AGGREGATES.continuationCsat) return 'Watch'
  return 'On Track'
}

export const AGENTS = Object.fromEntries(
  AGENT_METRIC_ORDER.map((slug) => {
    const m = AGENT_METRICS[slug]
    const firstName = m.name.split(' ')[0]

    return [
      slug,
      {
        ...m,
        status: statusFor(m),
        // legacy aliases for the Operations and Quality screens
        qa_w5: m.qaScore,
        qa_w1: m.qaSeries[0],
        qa_series: m.qaSeries,
        pa: m.processAdherencePct,
        rr: m.resolutionRatePct,
        cf: m.criticalFailures,
        csat_w5: m.csat,
        behaviour_w5: m.behaviourContinuation.empathy,

        /**
         * Team-lead-facing views only (Operations page and the TL modal).
         * These carry quality context that is deliberately not shown to the
         * agent themselves. The agent sees coachingPack instead.
         */
        insight:
          m.criticalFailures > 0
            ? `${m.name} averages ${m.qaScore.toFixed(1)}% QA across ${m.volume} contacts, close to the team average of ${TEAM_AGGREGATES.qaScore.toFixed(1)}%. On follow-up contacts the same work scores ${m.continuationQa.toFixed(1)}% QA against a CSAT of ${m.continuationCsat.toFixed(2)}. ${m.criticalFailures} contact${m.criticalFailures === 1 ? '' : 's'} auto-failed this period despite passing on process.`
            : `${m.name} averages ${m.qaScore.toFixed(1)}% QA across ${m.volume} contacts with no auto-fails this period. Follow-up CSAT of ${m.continuationCsat.toFixed(2)} against ${m.firstCsat.toFixed(2)} on first contacts is the remaining gap, and it is a team-wide pattern.`,
        coaching: m.coachingPack.cards.map((card) => ({
          topic: card.title,
          type: card.priorityRank === 1 ? 'priority' : 'development',
          content: card.coachingFocus,
          evidence: `Rank ${card.priorityRank} · ${card.affectedKpis.map((k) => KPI_LABELS[k] ?? k).join(', ')}`,
          cheatCodeId: card.cardId,
          lms: null,
        })),
        notes:
          m.criticalFailures >= 45
            ? [
                {
                  from: 'Nadia Chowdhury',
                  role: 'Team Lead',
                  date: '2026-09-08',
                  message: `${firstName} - your QA is ${m.qaScore.toFixed(1)}%, which is fine. The gap is the ${m.criticalFailures} contacts that auto-failed this period, most of them follow-ups on a declined claim or a disability file that was already open. The cards this week are built around that.`,
                },
                {
                  from: m.name,
                  role: 'Agent',
                  date: '2026-09-09',
                  message:
                    'Understood. I will open with what already happened on the file and name who owns the next step before closing.',
                },
              ]
            : [
                {
                  from: 'Nadia Chowdhury',
                  role: 'Team Lead',
                  date: '2026-09-08',
                  message: `First-contact quality is solid at ${m.firstCsat.toFixed(2)} CSAT. The risk sits in the follow-up contacts, where the team average is ${TEAM_AGGREGATES.continuationCsat.toFixed(2)}. Keep working the cards.`,
                },
              ],
      },
    ]
  }),
)

export const DEFAULT_SLUG = FLAGGED_AGENT_SLUGS[0]

export const SPARK_DATA = AGENT_METRIC_ORDER.map((slug) => {
  const m = AGENT_METRICS[slug]
  return {
    name: m.name,
    slug,
    w5: m.qaSeries[m.qaSeries.length - 1],
    series: m.qaSeries,
  }
})

export const SPARK_PREVIEW_SLUGS = FLAGGED_AGENT_SLUGS.slice(0, 4)
