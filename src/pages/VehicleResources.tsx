import { PageSection } from '../components/PageSection'

const resources = [
  { department: 'FF Ansfelden', vehicle: 'TLF-A 4000', capability: 'Fire suppression / water transport', readiness: 'Ready' },
  { department: 'FF Asten', vehicle: 'DLK 23-12', capability: 'Aerial rescue', readiness: 'Ready' },
  { department: 'FF Marchtrenk', vehicle: 'Boat-2', capability: 'Water rescue', readiness: 'Standby' },
]

export function VehicleResourcesPage() {
  return (
    <div className="page-grid">
      <PageSection title="Own vehicles & resources" subtitle="Overview of available vehicles and critical capabilities">
        <table className="table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Vehicle</th>
              <th>Capability</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((item) => (
              <tr key={`${item.department}-${item.vehicle}`}>
                <td>{item.department}</td>
                <td>{item.vehicle}</td>
                <td>{item.capability}</td>
                <td>{item.readiness}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageSection>
    </div>
  )
}
