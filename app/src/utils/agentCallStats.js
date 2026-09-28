export function computeAgentCallStats(calls, agentName) {
  const agentCalls = calls.filter((c) => c.agent_name === agentName)

  // Every scored contact counts, the same population as the agent's QA % in
  // MATRIX_ROWS / AGENTS and the team's OVERALL_QA_PCT. Excluding
  // `qa_pass === false` dropped ~38% of each agent's contacts (every contact
  // under 80 plus every auto-fail) and showed "Avg QA 92.8" next to
  // "QA W5 87.4" for the same agent in the same modal.
  const scoredCalls = agentCalls.filter((c) => typeof c.qa_score === 'number')
  const avgQa =
    scoredCalls.length > 0
      ? scoredCalls.reduce((sum, c) => sum + c.qa_score, 0) / scoredCalls.length
      : null

  const fcrResolved = agentCalls.filter((c) => c.fcr_resolved === true).length
  const fcrRate = agentCalls.length > 0 ? (fcrResolved / agentCalls.length) * 100 : 0

  const cfCount = agentCalls.filter((c) => c.critical_failure === true).length

  const categoryMap = new Map()
  agentCalls.forEach((c) => {
    categoryMap.set(c.call_category, (categoryMap.get(c.call_category) || 0) + 1)
  })
  const categories = [...categoryMap.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)

  return {
    totalCalls: agentCalls.length,
    avgQa,
    fcrRate,
    cfCount,
    categories,
  }
}
