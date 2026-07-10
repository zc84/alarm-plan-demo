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

      <PageSection title="Compliance perspective" subtitle="Why this audit stream is operationally critical">
        <ul className="item-list">
          <li>Every approval decision should be attributable, timestamped, and reviewable.</li>
          <li>Audit entries support post-incident analysis and legal defensibility.</li>
          <li>Consistent event naming improves searchability for governance and QA teams.</li>
        </ul>
      </PageSection>
    </div>
  )
}
