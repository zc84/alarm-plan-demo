import { PageSection } from '../components/PageSection'

const rows = [
  ['Fire incident', 'Siren Group A', 'Always', 'OK'],
  ['Technical incident', 'Pager Group T', 'Weekday daytime', 'Warning: low night staffing'],
  ['Water rescue', 'Special water response', 'Weekend/night', 'OK'],
]

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
              <th>Validation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </PageSection>

    </div>
  )
}
