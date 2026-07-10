import { useMemo, useState } from 'react'
import { PermissionGate } from '../components/PermissionGate'
import { PageSection } from '../components/PageSection'

interface ResourceEntry {
  id: string
  department: string
  vehicle: string
  capability: string
  readiness: 'READY' | 'STANDBY' | 'OUT_OF_SERVICE'
}

const readinessLabels: Record<ResourceEntry['readiness'], string> = {
  READY: 'Ready',
  STANDBY: 'Standby',
  OUT_OF_SERVICE: 'Out of service',
}

const initialResources: ResourceEntry[] = [
  { id: 'VR-1', department: 'FF Ansfelden', vehicle: 'TLF-A 4000', capability: 'Fire suppression / water transport', readiness: 'READY' },
  { id: 'VR-2', department: 'FF Asten', vehicle: 'DLK 23-12', capability: 'Aerial rescue', readiness: 'READY' },
  { id: 'VR-3', department: 'FF Marchtrenk', vehicle: 'Boat-2', capability: 'Water rescue', readiness: 'STANDBY' },
]

function getReadinessClass(readiness: ResourceEntry['readiness']) {
  if (readiness === 'OUT_OF_SERVICE') return 'status-rejected'
  if (readiness === 'STANDBY') return 'status-open'
  return 'status-done'
}

export function VehicleResourcesPage() {
  const [resources, setResources] = useState(initialResources)
  const [search, setSearch] = useState('')

  const filteredResources = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return resources

    return resources.filter((entry) =>
      `${entry.department} ${entry.vehicle} ${entry.capability} ${entry.readiness}`.toLowerCase().includes(normalized),
    )
  }, [resources, search])

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((entry) => entry.id !== id))
  }

  return (
    <div className="page-grid">
      <PageSection title="Own vehicles & resources" subtitle="Overview of available vehicles and critical capabilities">
        <div className="toolbar-grid compact">
          <label>
            Search resources
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Department, vehicle, capability..." />
          </label>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Vehicle</th>
              <th>Capability</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((item) => (
              <tr key={item.id}>
                <td>{item.department}</td>
                <td>{item.vehicle}</td>
                <td>{item.capability}</td>
                <td>
                  <span className={`status-badge ${getReadinessClass(item.readiness)}`}>{readinessLabels[item.readiness]}</span>
                </td>
                <td>
                  <PermissionGate anyOf={['LWZ_EMPLOYEE', 'FIRE_CHIEF', 'SECRETARY']} fallback={<span className="muted">Read only</span>}>
                    <div className="table-actions">
                      <button type="button" className="action-btn action-secondary" onClick={() => deleteResource(item.id)}>
                        <span className="action-icon" aria-hidden="true">🗑</span>
                        Delete
                      </button>
                    </div>
                  </PermissionGate>
                </td>
              </tr>
            ))}
            {filteredResources.length === 0 ? (
              <tr>
                <td colSpan={5} className="muted">No resources match the current search.</td>
              </tr>
            ) : null}
          </tbody>
        </table>

      </PageSection>
    </div>
  )
}
