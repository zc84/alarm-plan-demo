import { PageSection } from '../components/PageSection'
import { useAppContext } from '../context/AppContext'

export function DashboardPage() {
  const { approvals, alarmPlans, operationZones, vehicleTasks, notifications } = useAppContext()

  const pendingApprovals = approvals.filter((item) => item.status === 'PENDING').length
  const draftPlans = alarmPlans.filter((item) => item.status === 'DRAFT').length
  const zonesWithoutPlan = operationZones.filter((item) => !item.hasApprovedPlan).length
  const openVehicleTasks = vehicleTasks.filter((item) => item.status === 'OPEN').length

  return (
    <div className="page-grid">
      <PageSection title="Operations Overview" subtitle="Core KPIs aligned with emergency planning requirements">
        <ul className="stats-grid">
          <li>
            <span>Open approvals</span>
            <strong>{pendingApprovals}</strong>
          </li>
          <li>
            <span>Draft alarm plans</span>
            <strong>{draftPlans}</strong>
          </li>
          <li>
            <span>Zones without approved plan</span>
            <strong>{zonesWithoutPlan}</strong>
          </li>
          <li>
            <span>Open vehicle tasks</span>
            <strong>{openVehicleTasks}</strong>
          </li>
        </ul>
      </PageSection>

      <PageSection title="Latest notifications" subtitle="Recent system and workflow signals">
        <ul className="item-list">
          {notifications.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection
        title="Operational highlights"
        subtitle="Where teams usually focus during a planning cycle"
      >
        <ul className="item-list">
          <li>
            <strong>Approval throughput</strong>
            <p>Track pending review stages to avoid bottlenecks before publication deadlines.</p>
          </li>
          <li>
            <strong>Coverage quality</strong>
            <p>Monitor zones that still lack an approved plan and prioritize remediation.</p>
          </li>
          <li>
            <strong>Resource readiness</strong>
            <p>Resolve vehicle replacement tasks early to maintain deployment resilience.</p>
          </li>
        </ul>
      </PageSection>
    </div>
  )
}
