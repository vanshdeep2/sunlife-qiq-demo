import { NOUNS } from '../config/brand'
import { WEEK_BOUNDARIES } from '../data/contactSearchConstants'

export const CSAT_BANDS = ['positive', 'neutral', 'negative']
export const OUTCOME_ROWS = [
  { resolution: true, process: true },
  { resolution: false, process: true },
  { resolution: true, process: false },
  { resolution: false, process: false },
]

export function weekIndexOf(callDate) {
  const idx = WEEK_BOUNDARIES.findIndex((w) => callDate >= w.start && callDate <= w.end)
  return idx >= 0 ? idx : 4
}

export function contactsForWeek(contacts, weekIndex) {
  const week = WEEK_BOUNDARIES[weekIndex]
  if (!week) return []
  return contacts.filter((c) => c.call_date >= week.start && c.call_date <= week.end)
}

export function behaviourBandOf(contact) {
  const score = contact.behaviour_score
  if (score == null) return 'poor'
  return score >= 3.5 ? 'good' : 'poor'
}

export function csatBandOf(contact) {
  const score = contact.predicted_csat_score
  if (score == null) return 'neutral'
  if (score >= 4) return 'positive'
  if (score === 3) return 'neutral'
  return 'negative'
}

export function outcomeRowOf(contact) {
  const resolved = contact.fcr_resolved === true
  const process = contact.process_followed === true
  if (resolved && process) return 0
  if (!resolved && process) return 1
  if (resolved && !process) return 2
  return 3
}

function meanQa(list) {
  const scored = list.filter((c) => typeof c.qa_score === 'number')
  if (!scored.length) return null
  return scored.reduce((sum, c) => sum + c.qa_score, 0) / scored.length
}

export function buildMatrix(contacts, weekIndex, behaviourBand) {
  const weekContacts = contactsForWeek(contacts, weekIndex)
  const bandContacts = weekContacts.filter((c) => behaviourBandOf(c) === behaviourBand)
  // Percentages are of the whole week's population, not the selected
  // behaviour band — the Good/Poor toggle switches which 12 of the 24
  // cells are shown, it doesn't redefine the denominator. Dividing by
  // bandContacts.length made each toggle's 12 cells independently sum to
  // 100%, so all 24 cells summed to 200% instead of 100%.
  const weekTotal = weekContacts.length

  const cells = OUTCOME_ROWS.map((_, row) =>
    CSAT_BANDS.map((band) => {
      const inCell = bandContacts.filter(
        (c) => outcomeRowOf(c) === row && csatBandOf(c) === band,
      )
      const count = inCell.length
      const pct = weekTotal === 0 ? 0 : (count / weekTotal) * 100
      return {
        count,
        pct,
        meanQa: meanQa(inCell),
        contacts: inCell,
        row,
        csatBand: band,
        behaviourBand,
      }
    }),
  )

  return { cells, total: bandContacts.length, weekTotal }
}

export function weeklyMetrics(contacts, weekIndex) {
  const weekContacts = contactsForWeek(contacts, weekIndex)
  const total = weekContacts.length
  if (total === 0) {
    return {
      processAdherencePct: 0,
      resolutionRatePct: 0,
      positiveCsatPct: 0,
      criticalFailures: 0,
      total: 0,
    }
  }
  return {
    processAdherencePct: (weekContacts.filter((c) => c.process_followed === true).length / total) * 100,
    resolutionRatePct: (weekContacts.filter((c) => c.fcr_resolved === true).length / total) * 100,
    positiveCsatPct: (weekContacts.filter((c) => c.predicted_csat_score >= 4).length / total) * 100,
    criticalFailures: weekContacts.filter((c) => c.critical_failure === true).length,
    total,
  }
}

export function weekLabelShort(weekIndex) {
  const week = WEEK_BOUNDARIES[weekIndex]
  if (!week) return `W${weekIndex + 1}`
  const fmt = (iso) => {
    const d = new Date(`${iso}T12:00:00`)
    return d.toLocaleDateString(NOUNS.locale, { day: 'numeric', month: 'short' })
  }
  return `${fmt(week.start)} - ${fmt(week.end)}`
}

export function weekLabelFull(weekIndex) {
  const week = WEEK_BOUNDARIES[weekIndex]
  if (!week) return `Week ${weekIndex + 1}`
  const fmt = (iso) => {
    const d = new Date(`${iso}T12:00:00`)
    return d.toLocaleDateString(NOUNS.locale, { day: 'numeric', month: 'short', year: 'numeric' })
  }
  const start = new Date(`${week.start}T12:00:00`)
  const end = new Date(`${week.end}T12:00:00`)
  const sameYear = start.getFullYear() === end.getFullYear()
  if (sameYear) {
    const startStr = start.toLocaleDateString(NOUNS.locale, { day: 'numeric', month: 'short' })
    const endStr = end.toLocaleDateString(NOUNS.locale, { day: 'numeric', month: 'short', year: 'numeric' })
    return `${startStr} - ${endStr}`
  }
  return `${fmt(week.start)} - ${fmt(week.end)}`
}

export function weeklyTrendSeries(contacts) {
  return WEEK_BOUNDARIES.map((_, weekIndex) => {
    const m = weeklyMetrics(contacts, weekIndex)
    return {
      week: weekIndex,
      label: weekLabelShort(weekIndex),
      processAdherencePct: Number(m.processAdherencePct.toFixed(1)),
      resolutionRatePct: Number(m.resolutionRatePct.toFixed(1)),
      positiveCsatPct: Number(m.positiveCsatPct.toFixed(1)),
    }
  })
}

export function topCounts(contacts, field, n = 4) {
  const map = new Map()
  for (const c of contacts) {
    const value = c[field]
    if (!value) continue
    map.set(value, (map.get(value) || 0) + 1)
  }
  return [...map.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
    .slice(0, n)
}

export function formatHandlingTime(seconds) {
  if (seconds == null || Number.isNaN(Number(seconds))) return '--:--'
  const s = Math.max(0, Math.round(Number(seconds)))
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export function isHeroCell(row, csatBand, behaviourBand) {
  return row === 0 && csatBand === 'negative' && behaviourBand === 'poor'
}

export function coachingCardCounts(contacts) {
  const map = new Map()
  for (const c of contacts) {
    const ids = c.cheat_code_ids || []
    for (const id of ids) {
      map.set(id, (map.get(id) || 0) + 1)
    }
  }
  return [...map.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count)
}

export function qualityHealthScore(metrics) {
  const process = metrics.processAdherencePct || 0
  const resolution = metrics.resolutionRatePct || 0
  const positive = metrics.positiveCsatPct || 0
  const cfPenalty = Math.min(100, (metrics.criticalFailures || 0) * 14)
  const score = Math.round(
    0.3 * process + 0.2 * resolution + 0.35 * positive + 0.15 * (100 - cfPenalty),
  )
  return Math.max(0, Math.min(100, score))
}

export function meanQaForWeek(contacts, weekIndex) {
  const weekContacts = contactsForWeek(contacts, weekIndex)
  const scored = weekContacts.filter((c) => typeof c.qa_score === 'number')
  if (!scored.length) return null
  return scored.reduce((sum, c) => sum + c.qa_score, 0) / scored.length
}
