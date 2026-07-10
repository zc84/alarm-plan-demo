import { useMemo, useState } from 'react'
import { PermissionGate } from '../components/PermissionGate'
import { PageSection } from '../components/PageSection'
import { useAppContext } from '../context/AppContext'

export function OperationalZonesPage() {
  const { operationZones } = useAppContext()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'PB' | 'AUTOB' | 'GW' | 'RAIL' | 'SOAP' | 'FKAT'>('ALL')
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; sizeKb: number; type: string }[]>([])

  const filteredZones = useMemo(() => {
    return operationZones.filter((zone) => {
      const categoryMatch = categoryFilter === 'ALL' || zone.category === categoryFilter
      const searchMatch =
        search.trim().length === 0 ||
        `${zone.zoneNumber} ${zone.name} ${zone.municipality} ${zone.district}`.toLowerCase().includes(search.toLowerCase())

      return categoryMatch && searchMatch
    })
  }, [categoryFilter, operationZones, search])

  const zoneStats = {
    total: operationZones.length,
    missingPlan: operationZones.filter((zone) => !zone.hasApprovedPlan).length,
    pendingChanges: operationZones.filter((zone) => zone.changePending).length,
  }

  const onFilesUploaded = (files: FileList | null) => {
    if (!files) return

    const accepted = Array.from(files).filter((file) => {
      const name = file.name.toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.pdf', '.geojson'].some((extension) => name.endsWith(extension))
    })

    setUploadedFiles((prev) => [
      ...accepted.map((file) => ({
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        type: file.type || 'unknown',
      })),
      ...prev,
    ])
  }

  return (
    <div className="page-grid two-cols">
      <PageSection title="Zone status summary" subtitle="Coverage and approval pressure points">
        <ul className="stats-grid">
          <li>
            <span>Total zones</span>
            <strong>{zoneStats.total}</strong>
          </li>
          <li>
            <span>Without approved plan</span>
            <strong>{zoneStats.missingPlan}</strong>
          </li>
          <li>
            <span>Pending modifications</span>
            <strong>{zoneStats.pendingChanges}</strong>
          </li>
        </ul>
      </PageSection>

      <PageSection title="Geoviewer mock" subtitle="Color-coded status map for operational zones">
        <div className="toolbar-grid compact">
          <label>
            Category
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as typeof categoryFilter)}>
              <option value="ALL">ALL</option>
              <option value="PB">PB</option>
              <option value="AUTOB">AUTOB</option>
              <option value="GW">GW</option>
              <option value="RAIL">RAIL</option>
              <option value="SOAP">SOAP</option>
              <option value="FKAT">FKAT</option>
            </select>
          </label>
          <label>
            Search zone
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Zone, municipality, district..." />
          </label>
        </div>

        <div className="zone-map">
          {filteredZones.map((zone) => (
            <div
              key={zone.id}
              className={`zone-pill ${zone.hasApprovedPlan ? 'approved' : 'missing'} ${zone.changePending ? 'pending' : ''}`}
            >
              {zone.zoneNumber} · {zone.name}
            </div>
          ))}
        </div>

        <PermissionGate
          anyOf={['LWZ_EMPLOYEE', 'FIRE_CHIEF', 'SECRETARY']}
          fallback={<p className="muted top-gap">You have read-only access for operational zone modification actions.</p>}
        >
          <div className="actions top-gap">
            <button type="button">Create new zone</button>
            <label className="file-upload-button">
              Upload zone file (.jpg/.png/.pdf/.geojson)
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.geojson"
                multiple
                onChange={(event) => onFilesUploaded(event.target.files)}
              />
            </label>
            <button type="button">Start zone approval workflow</button>
          </div>
        </PermissionGate>

        {uploadedFiles.length > 0 ? (
          <div className="top-gap">
            <h4>Uploaded files (local simulation)</h4>
            <ul className="item-list">
              {uploadedFiles.map((file, index) => (
                <li key={`${file.name}-${index}`}>
                  <strong>{file.name}</strong>
                  <p>
                    {file.sizeKb} KB · {file.type}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </PageSection>

      <PageSection title="Zone list" subtitle="Search and metadata-focused tabular overview">
        <table className="table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Municipality</th>
              <th>District</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredZones.map((zone) => (
              <tr key={zone.id}>
                <td>{zone.zoneNumber}</td>
                <td>{zone.municipality}</td>
                <td>{zone.district}</td>
                <td>{zone.hasApprovedPlan ? 'Approved' : 'Missing'} / {zone.changePending ? 'Change pending' : 'No pending changes'}</td>
              </tr>
            ))}
            {filteredZones.length === 0 ? (
              <tr>
                <td colSpan={4} className="muted">
                  No operational zones match the current filter criteria.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </PageSection>

      <PageSection title="Planning recommendation" subtitle="How zone governance can stay reliable over time">
        <ul className="item-list">
          <li>Prioritize missing approvals in high-risk or high-density zones.</li>
          <li>Review pending changes in batches to avoid fragmented rollout.</li>
          <li>Keep zone metadata synchronized with municipal and district updates.</li>
        </ul>
      </PageSection>
    </div>
  )
}
