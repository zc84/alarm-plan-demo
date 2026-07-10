import { PageSection } from '../components/PageSection'

const poiEntries = [
  { id: 'POI-001', name: 'Chemical Storage Hall', municipality: 'Asten', riskClass: 'Hazmat' },
  { id: 'POI-002', name: 'River Lock Control Unit', municipality: 'Marchtrenk', riskClass: 'Water infrastructure' },
]

export function PoiManagementPage() {
  return (
    <div className="page-grid">
      <PageSection title="POI management" subtitle="Operationally relevant points of interest">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Municipality</th>
              <th>Risk class</th>
            </tr>
          </thead>
          <tbody>
            {poiEntries.map((poi) => (
              <tr key={poi.id}>
                <td>{poi.id}</td>
                <td>{poi.name}</td>
                <td>{poi.municipality}</td>
                <td>{poi.riskClass}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageSection>
    </div>
  )
}
