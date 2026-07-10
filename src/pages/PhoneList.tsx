import { useMemo, useState } from 'react'
import { PermissionGate } from '../components/PermissionGate'
import { PageSection } from '../components/PageSection'

interface PhoneEntry {
  id: string
  function: string
  contact: string
  availability: string
}

const initialPhoneEntries: PhoneEntry[] = [
  { id: 'PH-1', function: 'LWZ Duty Officer', contact: '+43 732 7000 100', availability: '24/7' },
  { id: 'PH-2', function: 'District BFK Linz-Land', contact: '+43 732 7000 220', availability: 'Daytime + on-call' },
  { id: 'PH-3', function: 'Water Rescue Control', contact: '+43 732 7000 330', availability: '24/7' },
]

export function PhoneListPage() {
  const [search, setSearch] = useState('')
  const [entries, setEntries] = useState(initialPhoneEntries)

  const filteredEntries = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return entries

    return entries.filter((entry) =>
      `${entry.function} ${entry.contact} ${entry.availability}`.toLowerCase().includes(normalized),
    )
  }, [entries, search])

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  return (
    <div className="page-grid">
      <PageSection title="Phone list" subtitle="Operational contact directory for dispatch and coordination">
        <div className="toolbar-grid compact">
          <label>
            Search contact
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Function, phone, availability..."
            />
          </label>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Function</th>
              <th>Phone</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.function}</td>
                <td>{entry.contact}</td>
                <td>{entry.availability}</td>
                <td>
                  <PermissionGate anyOf={['LWZ_EMPLOYEE', 'FIRE_CHIEF', 'SECRETARY']} fallback={<span className="muted">Read only</span>}>
                    <div className="table-actions">
                      <button type="button" className="action-btn action-secondary" onClick={() => deleteEntry(entry.id)}>
                        <span className="action-icon" aria-hidden="true">🗑</span>
                        Delete
                      </button>
                    </div>
                  </PermissionGate>
                </td>
              </tr>
            ))}
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={4} className="muted">
                  No contacts match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

      </PageSection>
    </div>
  )
}
