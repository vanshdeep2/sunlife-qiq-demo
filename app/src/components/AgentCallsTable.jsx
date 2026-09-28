import { useNavigate } from 'react-router-dom'
import {
  formatQaScoreDisplay,
  getQaScoreCellClass,
  isAutoFail,
} from '../utils/contactSearch'
import { formatDate } from '../utils/format'

export default function AgentCallsTable({ calls, agentName, onReviewClick, limit = 20 }) {
  const navigate = useNavigate()

  const agentCalls = calls
    .filter((c) => c.agent_name === agentName)
    .sort((a, b) => {
      const aScore = a.qa_score ?? Infinity
      const bScore = b.qa_score ?? Infinity
      return aScore - bScore
    })

  const displayCalls = limit == null ? agentCalls : agentCalls.slice(0, limit)
  const title =
    limit == null
      ? `All scored contacts · ${agentCalls.length} total · lowest QA first`
      : 'Scored contacts · lowest QA first'

  const handleReview = (callId, e) => {
    e?.stopPropagation?.()
    if (onReviewClick) {
      onReviewClick(callId)
    } else {
      navigate(`/search?call=${callId}`)
    }
  }

  return (
    <div className="agent-overview-calls">
      <div className="agent-overview-calls-title">{title}</div>
      <div className="agent-overview-table-wrap">
        <table className="agent-overview-table">
          <thead>
            <tr>
              <th>Contact ID</th>
              <th>Date</th>
              <th>Category</th>
              <th>QA Score</th>
              <th>FCR</th>
              <th>Seq</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {displayCalls.length === 0 ? (
              <tr>
                <td colSpan={7} className="agent-overview-empty">
                  No scored contacts found for this agent.
                </td>
              </tr>
            ) : (
              displayCalls.map((call) => {
                const id = call.contact_id || call.call_id
                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{formatDate(call.call_date)}</td>
                    <td>{call.call_category}</td>
                    <td>
                      <span className={`qa-pill ${getQaScoreCellClass(call.qa_score, isAutoFail(call))}`}>
                        {formatQaScoreDisplay(call.qa_score, isAutoFail(call))}
                      </span>
                    </td>
                    <td>
                      <span
                        className={call.fcr_resolved ? 'fcr-tick' : 'fcr-cross'}
                        aria-label={call.fcr_resolved ? 'Resolved' : 'Not resolved'}
                      >
                        {call.fcr_resolved ? '✓' : '✕'}
                      </span>
                    </td>
                    <td>{call.contact_sequence ?? '-'}</td>
                    <td>
                      <button
                        type="button"
                        className="overview-review-btn"
                        onClick={(e) => handleReview(id, e)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
