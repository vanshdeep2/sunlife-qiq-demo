import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Nav from '../components/Nav'
import { CONTACT_INDEX_PATH, NOUNS } from '../config/brand'
import CallDetailModal from '../components/CallDetailModal'
import { CALLS_PILL, EXTRACT_NOTE, LIVE_LABEL, POPULATION } from '../data/executiveConstants'
import { CF_QUICK_LINKS, DEFAULT_FILTERS, WEEK_BOUNDARIES } from '../data/contactSearchConstants'
import { useContactIndex } from '../context/ContactIndexContext'
import { loadContactDetail } from '../utils/shardLoader'
import {
  filterCalls,
  formatQaScoreDisplay,
  getQaScoreCellClass,
  isAutoFail,
  sortCalls,
  uniqueSorted,
} from '../utils/contactSearch'
import { formatDate } from '../utils/format'
import '../styles/search.css'
import '../styles/executive.css'

const COLUMNS = [
  { key: 'contact_id', label: 'Contact ID', sortField: 'contact_id' },
  { key: 'agent_name', label: 'Agent', sortField: 'agent_name' },
  { key: 'channel', label: 'Channel', sortField: null },
  { key: 'call_date', label: 'Date', sortField: 'call_date' },
  { key: 'call_category', label: 'Category', sortField: 'call_category' },
  { key: 'seq', label: 'Seq', sortField: 'contact_sequence' },
  { key: 'qa_score', label: 'QA Score', sortField: 'qa_score' },
  { key: 'csat', label: 'CSAT', sortField: null },
  { key: 'fcr', label: 'FCR', sortField: null },
  { key: 'actions', label: 'Actions', sortField: null },
]

export default function ContactSearch() {
  const [searchParams] = useSearchParams()
  const prefilledCall = searchParams.get('call') || searchParams.get('contact')
  const prefilledAgent = searchParams.get('agent')
  const prefilledCritical =
    searchParams.get('critical') === 'true' || searchParams.get('criticalOnly') === 'true'
  const prefilledQuery = searchParams.get('q')
  const weekParam = searchParams.get('week')
  const prefilledWeek =
    weekParam && /^[1-5]$/.test(weekParam) ? Number(weekParam) : null

  const { contacts, loading, error } = useContactIndex()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [query, setQuery] = useState(prefilledQuery || '')
  const [sortField, setSortField] = useState('qa_score')
  const [sortDir, setSortDir] = useState('asc')
  const [activeTab, setActiveTab] = useState('summary')
  const [visibleCount, setVisibleCount] = useState(50)
  const [detailRecord, setDetailRecord] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const callIdIndex = useMemo(() => {
    const map = new Map()
    contacts.forEach((c) => map.set(c.contact_id, c))
    return map
  }, [contacts])

  const agentOptions = useMemo(() => uniqueSorted(contacts.map((c) => c.agent_name)), [contacts])
  const categoryOptions = useMemo(
    () => uniqueSorted(contacts.map((c) => c.call_category)),
    [contacts],
  )

  const criticalCount = useMemo(
    () => contacts.filter((c) => c.critical_failure === true).length,
    [contacts],
  )

  const filteredCalls = useMemo(() => {
    let list = filterCalls(contacts, filters)
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter((c) => {
        return (
          c.contact_id?.toLowerCase().includes(q) ||
          c.incident_id?.toLowerCase().includes(q) ||
          c.member_name?.toLowerCase().includes(q) ||
          c.agent_name?.toLowerCase().includes(q) ||
          c.pet_name?.toLowerCase().includes(q) ||
          c.incident_title?.toLowerCase().includes(q) ||
          c.call_category?.toLowerCase().includes(q)
        )
      })
    }
    return sortCalls(list, sortField, sortDir)
  }, [contacts, filters, query, sortField, sortDir])

  const visibleCalls = useMemo(
    () => filteredCalls.slice(0, visibleCount),
    [filteredCalls, visibleCount],
  )

  const openCall = useCallback(
    async (contactId) => {
      const light = callIdIndex.get(contactId)
      if (!light) return
      setDetailRecord(light)
      setLoadingDetail(true)
      setActiveTab('summary')

      try {
        const full = await loadContactDetail(light)
        setDetailRecord(full)
      } catch {
        setDetailRecord(light)
      } finally {
        setLoadingDetail(false)
      }
    },
    [callIdIndex],
  )

  const prefilledHandled = useRef(false)
  const agentHandled = useRef(false)
  const criticalHandled = useRef(false)
  const weekHandled = useRef(false)

  useEffect(() => {
    if (loading || !prefilledCritical || criticalHandled.current) return
    criticalHandled.current = true
    queueMicrotask(() => setFilters((f) => ({ ...f, criticalOnly: true })))
  }, [loading, prefilledCritical])

  useEffect(() => {
    if (loading || prefilledWeek == null || weekHandled.current) return
    weekHandled.current = true
    const boundary = WEEK_BOUNDARIES[prefilledWeek - 1]
    if (!boundary) return
    queueMicrotask(() => {
      setFilters((f) => ({
        ...f,
        week: String(prefilledWeek - 1),
        dateFrom: boundary.start,
        dateTo: boundary.end,
      }))
    })
  }, [loading, prefilledWeek])

  useEffect(() => {
    if (loading || !prefilledAgent || agentHandled.current) return
    agentHandled.current = true
    queueMicrotask(() => setFilters((f) => ({ ...f, agent: prefilledAgent })))
  }, [loading, prefilledAgent])

  useEffect(() => {
    if (loading || !prefilledCall || prefilledHandled.current) return
    if (!callIdIndex.has(prefilledCall)) return
    prefilledHandled.current = true
    queueMicrotask(() => {
      openCall(prefilledCall)
      const idx = filteredCalls.findIndex((c) => c.contact_id === prefilledCall)
      if (idx >= 0 && idx >= visibleCount) {
        setVisibleCount(Math.ceil((idx + 1) / 50) * 50)
      }
    })
  }, [loading, prefilledCall, callIdIndex, openCall, filteredCalls, visibleCount])

  const handleSort = (field) => {
    if (!field) return
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }))
    setVisibleCount(50)
  }

  const updateFilter = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    handleFilterChange(key, val)
  }

  const handleCfQuickLink = (contactId) => {
    if (!callIdIndex.has(contactId)) return
    setQuery('')
    setFilters(DEFAULT_FILTERS)
    openCall(contactId)
    setVisibleCount(50)
  }

  const handleViewAllCritical = () => {
    setFilters({ ...DEFAULT_FILTERS, criticalOnly: true })
    setDetailRecord(null)
    setVisibleCount(50)
  }

  return (
    <>
      <Nav currentPage="search" liveLabel={LIVE_LABEL} callsPill={CALLS_PILL} />
      <div className="page">
        <div className="briefing-kicker">QiQ Contact Intelligence</div>
        <h1 className="briefing-title">Contact Search</h1>
        <div className="briefing-subtitle">
          QA analysts and team leaders ·{' '}
          {POPULATION.estimatedPopulation.toLocaleString(NOUNS.locale)} contacts analysed ·{' '}
          {POPULATION.extractSize.toLocaleString(NOUNS.locale)}-record working extract · Search by
          contact ID, {NOUNS.demandSide}, or category
        </div>
        <p className="extract-note">{EXTRACT_NOTE}</p>

        <div className="connector">Search &amp; Filter</div>

        <div className="search-filters">
          <div className="search-field">
            <label htmlFor="filter-query">Search</label>
            <input
              id="filter-query"
              type="search"
              placeholder={`Contact ID, ${NOUNS.demandSide} name, category...`}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setVisibleCount(50)
              }}
            />
          </div>
          <div className="search-field">
            <label htmlFor="filter-agent">Agent</label>
            <select id="filter-agent" value={filters.agent} onChange={updateFilter('agent')}>
              <option value="all">All agents</option>
              {agentOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div className="search-field">
            <label htmlFor="filter-source">Source</label>
            <select id="filter-source" value={filters.source} onChange={updateFilter('source')}>
              <option value="all">All sources</option>
              <option value="voice">Voice</option>
              <option value="messaging">Messaging</option>
            </select>
          </div>
          <div className="search-field">
            <label htmlFor="filter-queue">Queue</label>
            <select id="filter-queue" value={filters.queue} onChange={updateFilter('queue')}>
              <option value="all">All categories</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="search-field">
            <label htmlFor="filter-week">Week</label>
            <select id="filter-week" value={filters.week} onChange={updateFilter('week')}>
              <option value="all">All weeks</option>
              {WEEK_BOUNDARIES.map((w, i) => (
                <option key={w.start} value={String(i)}>
                  Week {i + 1} ({w.start} to {w.end})
                </option>
              ))}
            </select>
          </div>
          <div className="search-field">
            <label htmlFor="filter-resolution">Resolution</label>
            <select
              id="filter-resolution"
              value={filters.resolution}
              onChange={updateFilter('resolution')}
            >
              <option value="all">All</option>
              <option value="resolved">Resolved</option>
              <option value="unresolved">Not resolved</option>
            </select>
          </div>
          <div className="search-field">
            <label htmlFor="filter-date-from">Date from</label>
            <input
              id="filter-date-from"
              type="date"
              value={filters.dateFrom}
              onChange={updateFilter('dateFrom')}
            />
          </div>
          <div className="search-field">
            <label htmlFor="filter-date-to">Date to</label>
            <input
              id="filter-date-to"
              type="date"
              value={filters.dateTo}
              onChange={updateFilter('dateTo')}
            />
          </div>
          <div className="search-field">
            <label htmlFor="filter-score">QA score</label>
            <select
              id="filter-score"
              value={filters.scoreFilter}
              onChange={updateFilter('scoreFilter')}
            >
              <option value="all">All scores</option>
              <option value="autofail">Auto-fail only</option>
              <option value="below70">Below 70</option>
              <option value="70to90">70 - 90</option>
              <option value="above90">Above 90</option>
            </select>
          </div>
          <div className="search-field search-field-check">
            <label>
              <input
                type="checkbox"
                checked={filters.criticalOnly}
                onChange={updateFilter('criticalOnly')}
              />
              Critical failures only
            </label>
          </div>
        </div>

        <div className="search-quick">
          <span className="search-quick-label">Featured critical failures:</span>
          {CF_QUICK_LINKS.map((cf) => (
            <button
              key={cf.callId}
              type="button"
              className="search-quick-btn"
              onClick={() => handleCfQuickLink(cf.callId)}
            >
              {cf.label}
            </button>
          ))}
          <button
            type="button"
            className="search-quick-btn search-quick-btn-primary"
            onClick={handleViewAllCritical}
          >
            View all critical failures ({criticalCount})
          </button>
        </div>

        <div className="connector">Results</div>

        {loading && (
          <div className="search-loading">
            <div className="search-spinner" />
            Loading contact index…
          </div>
        )}

        {error && (
          <div className="search-error">{error}. Ensure {CONTACT_INDEX_PATH} exists under /public.</div>
        )}

        {!loading && !error && (
          <>
            <div className="search-results-meta">
              Showing {visibleCalls.length.toLocaleString(NOUNS.locale)} of{' '}
              {filteredCalls.length.toLocaleString(NOUNS.locale)} contacts.
            </div>

            <div className="ledger-panel search-table-wrap">
              <div className="ledger-table-wrap">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      {COLUMNS.map((col) => (
                        <th
                          key={col.key}
                          className={
                            col.sortField
                              ? `sortable ${sortField === col.sortField ? 'sort-active' : ''}`
                              : ''
                          }
                          onClick={() => handleSort(col.sortField)}
                        >
                          {col.label}
                          {col.sortField && sortField === col.sortField && (
                            <span className="sort-indicator">{sortDir === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleCalls.map((call) => (
                      <tr
                        key={call.contact_id}
                        className="search-row"
                        onClick={() => openCall(call.contact_id)}
                      >
                        <td>{call.contact_id}</td>
                        <td>{call.agent_name}</td>
                        <td>
                          <span className="qa-pill qa-pill-muted" style={{ textTransform: 'capitalize' }}>
                            {call.channel || '-'}
                          </span>
                        </td>
                        <td>{formatDate(call.call_date)}</td>
                        <td>{call.call_category}</td>
                        <td>{call.contact_sequence}</td>
                        <td>
                          <span className={`qa-pill ${getQaScoreCellClass(call.qa_score, isAutoFail(call))}`}>
                            {formatQaScoreDisplay(call.qa_score, isAutoFail(call))}
                          </span>
                        </td>
                        <td>
                          {call.predicted_csat_score != null
                            ? `${call.predicted_csat_score} · ${call.predicted_csat_label || ''}`
                            : '-'}
                        </td>
                        <td>{call.fcr_resolved ? 'Yes' : 'No'}</td>
                        <td>
                          <button
                            type="button"
                            className="search-action-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              openCall(call.contact_id)
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {visibleCalls.length < filteredCalls.length && (
              <div className="search-load-more">
                <button
                  type="button"
                  className="search-load-more-btn"
                  onClick={() => setVisibleCount((v) => v + 50)}
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {detailRecord && (
        <CallDetailModal
          call={detailRecord}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setDetailRecord(null)}
          loadingDetail={loadingDetail}
          showIncidentTrail={false}
        />
      )}
    </>
  )
}
