import { WEEK_BOUNDARIES } from '../data/contactSearchConstants'
import { COACHING_WEEK_INDEX } from '../data/agents'

// Dates are derived from this client's reporting window: first entry in the
// coaching deployment week, second the week after, third the final week. They
// used to be hardcoded to May 2026, which is before BBB's 1 Aug - 4 Sep window
// (coaching went live in week 2, 8 Aug).
function weekStart(i) {
  const weeks = WEEK_BOUNDARIES ?? []
  if (!weeks.length) return null
  return weeks[Math.max(0, Math.min(weeks.length - 1, i))].start
}
const COACH_IDX = COACHING_WEEK_INDEX ?? 1
const QUEUE_META = [
  { date: weekStart(COACH_IDX), status: 'Completed', badgeClass: 'badge-green' },
  { date: weekStart(COACH_IDX + 1), status: 'In Progress', badgeClass: 'badge-amber' },
  { date: weekStart((WEEK_BOUNDARIES?.length ?? 5) - 1), status: 'New', badgeClass: 'badge-navy' },
]

export function buildCoachingQueue(coaching) {
  if (!coaching?.length) return []

  const [first, second] = coaching
  const entry2Card = second ?? {
    ...first,
    topic: `Follow-up: ${first.topic}`,
  }
  const entry3Card = {
    ...first,
    topic: `Follow-up: ${first.topic}`,
  }

  const cards = [first, entry2Card, entry3Card]

  return QUEUE_META.map((meta, i) => ({
    ...meta,
    ...cards[i],
  }))
}
