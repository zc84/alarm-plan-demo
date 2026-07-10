import { PageSection } from '../components/PageSection'

export function IntegrationPreviewPage() {
  return (
    <div className="page-grid two-cols">
      <PageSection title="CAD / Interface server simulation" subtitle="Staging flags, release gates, and transfer queue overview">
        <table className="table">
          <thead>
            <tr>
              <th>Record</th>
              <th>Staging</th>
              <th>Central release</th>
              <th>Transfer status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AP-2026-014</td>
              <td>YES</td>
              <td>Pending</td>
              <td>Queue</td>
            </tr>
            <tr>
              <td>Alarm group FF Asten</td>
              <td>NO</td>
              <td>Not required</td>
              <td>Transferred</td>
            </tr>
          </tbody>
        </table>
      </PageSection>

      <PageSection title="Communication matrix" subtitle="Conceptual flow instead of live API/server connections">
        <ul className="item-list">
          <li>App UI → (Mock) Interface Server: simulated client-side event flow</li>
          <li>Interface Server → CAD backend: visualized only in this prototype</li>
          <li>Response and error feedback loop: notification center</li>
        </ul>
      </PageSection>

    </div>
  )
}
