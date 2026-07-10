import { PageSection } from '../components/PageSection'
import { useAppContext } from '../context/AppContext'

export function VehicleModificationsPage() {
  const { vehicleTasks } = useAppContext()

  return (
    <div className="page-grid">
      <PageSection title="Vehicle modifications" subtitle="New or retired assets and replacement task tracking">
        <table className="table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Type</th>
              <th>Vehicle</th>
              <th>Replacement proposal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicleTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.fireDepartment}</td>
                <td>{task.type}</td>
                <td>{task.vehicle}</td>
                <td>{task.suggestion ?? '-'}</td>
                <td>{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageSection>

    </div>
  )
}
