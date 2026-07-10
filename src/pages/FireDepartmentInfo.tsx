import { useMemo, useState } from 'react'
import { PermissionGate } from '../components/PermissionGate'
import { PageSection } from '../components/PageSection'

interface DepartmentInfoEntry {
  id: string
  department: string
  capability: string
  fallbackStation: string
  notes: string
}

const initialEntries: DepartmentInfoEntry[] = [
  {
    id: 'FDI-1',
    department: 'FF Ansfelden',
    capability: 'Hazmat first response',
    fallbackStation: 'FF Asten',
    notes: 'Night shift staffing reduced on weekdays.',
  },
  {
    id: 'FDI-2',
    department: 'FF Marchtrenk',
    capability: 'Water rescue support',
    fallbackStation: 'OEWR Central',
    notes: 'Boat readiness check every Monday.',
  },
]

export function FireDepartmentInfoPage() {
  const [entries, setEntries] = useState(initialEntries)
  const [search, setSearch] = useState('')

  const filteredEntries = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return entries

    return entries.filter((entry) =>
      `${entry.department} ${entry.capability} ${entry.fallbackStation} ${entry.notes}`.toLowerCase().includes(normalized),
    )
  }, [entries, search])

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  return (
    <div className="page-grid">
      <PageSection title="Fire department additional information" subtitle="Extended profile fields for planning and coordination">
        <div className="toolbar-grid compact">
          <label>
            Search profile
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Department, capability, fallback..." />
          </label>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Special capability</th>
              <th>Fallback station</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.department}</td>
                <td>{entry.capability}</td>
                <td>{entry.fallbackStation}</td>
                <td>{entry.notes}</td>
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
                <td colSpan={5} className="muted">No department profiles found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>

      </PageSection>
    </div>
  )
}
