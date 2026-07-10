import { PageSection } from '../components/PageSection'
import { useAppContext } from '../context/AppContext'

export function AuditLogPage() {
  const { auditEvents } = useAppContext()

  return (
    <div className="page-grid">
      <PageSection title="Audit log" subtitle="Complete visibility is typically restricted to central governance roles in production">
        <table className="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody>
            {auditEvents.map((event) => (
              <tr key={event.id}>
                <td>{new Date(event.timestamp).toLocaleString('en-GB')}</td>
                <td>{event.actor}</td>
                <td>{event.action}</td>
                <td>{event.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageSection>

    </div>
  )
}
