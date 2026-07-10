import { useMemo, useState } from 'react'
import { PermissionGate } from '../components/PermissionGate'
import { PageSection } from '../components/PageSection'
import { useAppContext } from '../context/AppContext'
import geoMapReference from '../assets/123.png'

type MapLayer = 'BASEMAP' | 'OSM' | 'TOPO' | 'ORTHO'

const zoneGeo: Record<string, { lat: number; lon: number; x: number; y: number }> = {
  'OZ-101': { lat: 48.2069, lon: 14.2858, x: 52, y: 58 },
  'OZ-104': { lat: 48.2206, lon: 14.3736, x: 66, y: 52 },
  'OZ-220': { lat: 48.1929, lon: 14.1114, x: 32, y: 63 },
}

export function OperationalZonesPage() {
  const { operationZones } = useAppContext()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'PB' | 'AUTOB' | 'GW' | 'RAIL' | 'SOAP' | 'FKAT'>('ALL')
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; sizeKb: number; type: string }[]>([])
  const [selectedZoneId, setSelectedZoneId] = useState(operationZones[0]?.id ?? '')
  const [mapLayer, setMapLayer] = useState<MapLayer>('BASEMAP')
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [locationStatus, setLocationStatus] = useState('')

  const filteredZones = useMemo(() => {
    return operationZones.filter((zone) => {
      const categoryMatch = categoryFilter === 'ALL' || zone.category === categoryFilter
      const searchMatch =
        search.trim().length === 0 ||
        `${zone.zoneNumber} ${zone.name} ${zone.municipality} ${zone.district}`.toLowerCase().includes(search.toLowerCase())

      return categoryMatch && searchMatch
    })
  }, [categoryFilter, operationZones, search])

  const selectedZone = filteredZones.find((zone) => zone.id === selectedZoneId) ?? filteredZones[0]

  const nearestZone = useMemo(() => {
    if (!userLocation) return null

    return filteredZones
      .map((zone) => {
        const geo = zoneGeo[zone.id]
        if (!geo) return null
        const distance = Math.sqrt((geo.lat - userLocation.lat) ** 2 + (geo.lon - userLocation.lon) ** 2)
        return { zone, distance }
      })
      .filter((entry): entry is { zone: (typeof filteredZones)[number]; distance: number } => Boolean(entry))
      .sort((a, b) => a.distance - b.distance)[0]?.zone
  }, [filteredZones, userLocation])

  const metrics = {
    total: operationZones.length,
    missing: operationZones.filter((zone) => !zone.hasApprovedPlan).length,
    pending: operationZones.filter((zone) => zone.changePending).length,
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

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by this browser.')
      return
    }

    setLocationStatus('Detecting your location...')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }
        setUserLocation(nextLocation)
        setLocationStatus(`Location detected: ${nextLocation.lat.toFixed(4)}, ${nextLocation.lon.toFixed(4)}`)
      },
      () => setLocationStatus('Location permission denied or unavailable.'),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  return (
    <div className="page-grid">
      <PageSection title="Geoviewer" subtitle="Interactive zone map with layer switcher and live location support">
        <div className="toolbar-grid">
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

        <div className="actions">
          <button type="button" className={mapLayer === 'BASEMAP' ? 'active-layer' : ''} onClick={() => setMapLayer('BASEMAP')}>
            Basemap
          </button>
          <button type="button" className={mapLayer === 'OSM' ? 'active-layer' : ''} onClick={() => setMapLayer('OSM')}>
            OpenStreetMap
          </button>
          <button type="button" className={mapLayer === 'TOPO' ? 'active-layer' : ''} onClick={() => setMapLayer('TOPO')}>
            OpenTopoMap
          </button>
          <button type="button" className={mapLayer === 'ORTHO' ? 'active-layer' : ''} onClick={() => setMapLayer('ORTHO')}>
            Orthophoto
          </button>
          <button type="button" onClick={useMyLocation}>Use my location</button>
        </div>

        {locationStatus ? <p className="muted top-gap">{locationStatus}</p> : null}
        {nearestZone ? <p className="muted">Nearest mapped zone: <strong>{nearestZone.zoneNumber} · {nearestZone.name}</strong></p> : null}

        <div className="geoviewer-shell top-gap">
          <div className={`geo-map-wrap layer-${mapLayer.toLowerCase()}`}>
            <div className="geo-map-canvas" role="img" aria-label="Operational zone map">
              <img className="geo-map-image" src={geoMapReference} alt="Operational zone map basemap" />
              <svg className="geo-svg" viewBox="0 0 100 100" aria-hidden="true">
                {filteredZones.map((zone) => {
                  const geo = zoneGeo[zone.id]
                  if (!geo) return null
                  const statusClass = zone.hasApprovedPlan ? 'approved' : 'missing'

                  return (
                    <g
                      key={`svg-${zone.id}`}
                      className={`geo-zone-group ${zone.id === selectedZone?.id ? 'active' : ''}`}
                      onClick={() => setSelectedZoneId(zone.id)}
                    >
                      <circle className={`geo-zone ${statusClass} ${zone.changePending ? 'pending' : ''}`} cx={geo.x} cy={geo.y} r="4.6" />
                      <text x={geo.x} y={geo.y - 6.2} textAnchor="middle" className="geo-zone-label">
                        {zone.zoneNumber}
                      </text>
                    </g>
                  )
                })}

                {userLocation ? (
                  <g className="geo-user">
                    <circle cx="12" cy="88" r="3.2" className="geo-user-dot" />
                    <text x="18" y="89" className="geo-user-label">You</text>
                  </g>
                ) : null}
              </svg>
            </div>

            <div className="geo-legend">
              <span><i className="dot approved" /> Approved</span>
              <span><i className="dot missing" /> Missing plan</span>
              <span><i className="dot pending" /> Change pending</span>
              <span><i className="dot user" /> User</span>
            </div>
          </div>

          <aside className="geo-details">
            <h4>Selected zone details</h4>
            {selectedZone ? (
              <ul className="item-list">
                <li>
                  <strong>{selectedZone.zoneNumber} · {selectedZone.name}</strong>
                  <p>{selectedZone.municipality}, {selectedZone.district}</p>
                </li>
                <li>
                  <strong>Category</strong>
                  <p>{selectedZone.category}</p>
                </li>
                <li>
                  <strong>Plan status</strong>
                  <p>{selectedZone.hasApprovedPlan ? 'Approved plan available' : 'No approved plan yet'}</p>
                </li>
                <li>
                  <strong>Change workflow</strong>
                  <p>{selectedZone.changePending ? 'Pending modification review' : 'No pending change'}</p>
                </li>
              </ul>
            ) : (
              <p className="muted">No zone selected.</p>
            )}
          </aside>
        </div>
      </PageSection>

      <PageSection title="Zone metrics" subtitle="Quick overview of plan coverage and change backlog">
        <ul className="stats-grid">
          <li>
            <span>Total zones</span>
            <strong>{metrics.total}</strong>
          </li>
          <li>
            <span>Without approved plan</span>
            <strong>{metrics.missing}</strong>
          </li>
          <li>
            <span>Pending modifications</span>
            <strong>{metrics.pending}</strong>
          </li>
        </ul>
      </PageSection>

      <PageSection title="Zone registry" subtitle="Structured list view for operational administration">
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

      <PageSection title="Zone actions" subtitle="Create, upload, and start workflow actions">
        <PermissionGate
          anyOf={['LWZ_EMPLOYEE', 'FIRE_CHIEF', 'SECRETARY']}
          fallback={<p className="muted">You have read-only access for operational zone modification actions.</p>}
        >
          <div className="actions">
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
                  <p>{file.sizeKb} KB · {file.type}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </PageSection>
    </div>
  )
}
