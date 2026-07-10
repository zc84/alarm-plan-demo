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

      <PageSection title="Design intent" subtitle="Why this matrix matters in operational planning">
        <ul className="item-list">
          <li>Each category can define specific channels and staffing assumptions per time window.</li>
          <li>Validation warnings highlight potential response risks before a plan is approved.</li>
          <li>The structure is prepared for later integration with real alerting infrastructure.</li>
        </ul>
      </PageSection>
    </div>
  )
}
