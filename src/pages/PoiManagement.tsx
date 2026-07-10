import { useMemo, useState } from 'react'
import { PermissionGate } from '../components/PermissionGate'
import { PageSection } from '../components/PageSection'

interface PoiEntry {
  id: string
  name: string
  municipality: string
  riskClass: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

const initialPoiEntries: PoiEntry[] = [
  { id: 'POI-001', name: 'Chemical Storage Hall', municipality: 'Asten', riskClass: 'CRITICAL' },
  { id: 'POI-002', name: 'River Lock Control Unit', municipality: 'Marchtrenk', riskClass: 'HIGH' },
]

const riskClassLabel: Record<PoiEntry['riskClass'], string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
}

function getRiskBadgeClass(riskClass: PoiEntry['riskClass']) {
  if (riskClass === 'CRITICAL') return 'status-rejected'
  if (riskClass === 'HIGH') return 'status-open'
  if (riskClass === 'MEDIUM') return 'status-pending'
  return 'status-done'
}

export function PoiManagementPage() {
  const [entries, setEntries] = useState(initialPoiEntries)
  const [search, setSearch] = useState('')

  const filteredEntries = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return entries

    return entries.filter((poi) => `${poi.id} ${poi.name} ${poi.municipality} ${poi.riskClass}`.toLowerCase().includes(normalized))
  }, [entries, search])

  const deletePoi = (id: string) => {
    setEntries((prev) => prev.filter((poi) => poi.id !== id))
  }

  return (
    <div className="page-grid">
      <PageSection title="POI management" subtitle="Operationally relevant points of interest">
        <div className="toolbar-grid compact">
          <label>
            Search POI
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="POI id, name, municipality..." />
          </label>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Municipality</th>
              <th>Risk class</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((poi) => (
              <tr key={poi.id}>
                <td>{poi.id}</td>
                <td>{poi.name}</td>
                <td>{poi.municipality}</td>
                <td>
                  <span className={`status-badge ${getRiskBadgeClass(poi.riskClass)}`}>{riskClassLabel[poi.riskClass]}</span>
                </td>
                <td>
                  <PermissionGate anyOf={['LWZ_EMPLOYEE', 'FIRE_CHIEF', 'SECRETARY']} fallback={<span className="muted">Read only</span>}>
                    <div className="table-actions">
                      <button type="button" className="action-btn action-secondary" onClick={() => deletePoi(poi.id)}>
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
                <td colSpan={5} className="muted">No POI entries found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>

      </PageSection>
    </div>
  )
}
