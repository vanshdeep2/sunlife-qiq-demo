import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { CONTACT_INDEX_PATH } from '../config/brand'

const ContactIndexContext = createContext({
  contacts: [],
  loading: true,
  error: null,
  byId: new Map(),
  byIncident: new Map(),
})

export function ContactIndexProvider({ children }) {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch(CONTACT_INDEX_PATH)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load contact index')
        return r.json()
      })
      .then((data) => {
        if (cancelled) return
        setContacts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => {
    const byId = new Map()
    const byIncident = new Map()
    contacts.forEach((c) => {
      byId.set(c.contact_id, c)
      if (!c.incident_id) return
      if (!byIncident.has(c.incident_id)) byIncident.set(c.incident_id, [])
      byIncident.get(c.incident_id).push(c)
    })
    byIncident.forEach((list) => {
      list.sort((a, b) => a.contact_sequence - b.contact_sequence)
    })
    return { contacts, loading, error, byId, byIncident }
  }, [contacts, loading, error])

  return (
    <ContactIndexContext.Provider value={value}>{children}</ContactIndexContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook paired with provider
export function useContactIndex() {
  return useContext(ContactIndexContext)
}
