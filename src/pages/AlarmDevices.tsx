import { PageSection } from '../components/PageSection'

const rows = [
  ['Fire incident', 'Siren Group A', 'Always', 'OK'],
  ['Technical incident', 'Pager Group T', 'Weekday daytime', 'Warning: low night staffing'],
  ['Water rescue', 'Special water response', 'Weekend/night', 'OK'],
]

function getDeviceCompositeStatus(validation: string) {
  if (validation.toLowerCase().includes('warning')) {
    return { label: 'Update pending', className: 'zone-status-pending' }
  }

  return { label: 'Ready', className: 'zone-status-ready' }
}

export function AlarmDevicesPage() {
  return (
    <div className="page-grid">
      <PageSection title="Alarm device matrix" subtitle="Time references, dispatch channels, and coverage validation">
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Alarm group</th>
              <th>Time reference</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const status = getDeviceCompositeStatus(row[3])

              return (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>
                    <span className={`status-badge ${status.className}`}>{status.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </PageSection>

    </div>
  )
}
