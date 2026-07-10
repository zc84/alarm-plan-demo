import { Link } from 'react-router-dom'
import { PageSection } from '../components/PageSection'
import { useAppContext } from '../context/AppContext'

export function DashboardPage() {
  const { approvals, alarmPlans, operationZones, vehicleTasks, notifications, users, currentContext, roleDefinitions } = useAppContext()

  const getNotificationLink = (title: string, body: string) => {
    const normalized = `${title} ${body}`.toLowerCase()

    if (normalized.includes('approval')) {
      return { to: '/approval-center', label: 'Open approval center' }
    }

    if (normalized.includes('zone')) {
      return { to: '/zones', label: 'Open operational zones' }
    }

    if (normalized.includes('vehicle') || normalized.includes('vt-')) {
      return { to: '/vehicle-modifications', label: 'Open vehicle tasks' }
    }

    if (normalized.includes('alarm plan') || normalized.includes('ap-')) {
      return { to: '/alarm-plans', label: 'Open alarm plans' }
    }

    return null
  }

  const currentUser = users.find((entry) => entry.id === currentContext.userId) ?? users[0]
  const currentRole = roleDefinitions.find((entry) => entry.key === currentContext.role)

  const pendingApprovals = approvals.filter((item) => item.status === 'PENDING').length
  const draftPlans = alarmPlans.filter((item) => item.status === 'DRAFT').length
  const zonesWithoutPlan = operationZones.filter((item) => !item.hasApprovedPlan).length
  const openVehicleTasks = vehicleTasks.filter((item) => item.status === 'OPEN').length
  const totalActionItems = pendingApprovals + zonesWithoutPlan + openVehicleTasks
  const criticalFocus = pendingApprovals + zonesWithoutPlan
  const overviewLinks = [
    { label: 'Open approvals', value: pendingApprovals, to: '/approval-center', helper: 'Review pending approval workflow tasks', tone: 'attention' },
    { label: 'Draft alarm plans', value: draftPlans, to: '/alarm-plans', helper: 'Continue plan drafting and lifecycle updates', tone: 'neutral' },
    { label: 'Zones without approved plan', value: zonesWithoutPlan, to: '/zones', helper: 'Open geoviewer and zone registry actions', tone: 'risk' },
    { label: 'Open vehicle tasks', value: openVehicleTasks, to: '/vehicle-modifications', helper: 'Resolve outstanding vehicle modifications', tone: 'attention' },
  ]

  return (
    <div className="page-grid dashboard-page">
      <section className="dashboard-spotlight" aria-label="Active user summary">
        <div>
          <p className="dashboard-spotlight-eyebrow">Active workspace</p>
          <h2>Operational overview</h2>
          <p className="dashboard-spotlight-copy section-description">
            Tailored for <strong>{currentUser.name}</strong> with the active role <strong>{currentRole?.label ?? currentContext.role}</strong>.
          </p>
        </div>
        <div className="dashboard-context-chips">
          <span className="rounded-element">
            Selected user
            <strong>{currentUser.name}</strong>
          </span>
          <span className="rounded-element">
            Active role
            <strong>{currentRole?.label ?? currentContext.role}</strong>
          </span>
          <span className="rounded-element">
            Scope
            <strong>
              {currentContext.scopeType} / {currentContext.scopeValue}
            </strong>
          </span>
        </div>
      </section>

      <PageSection title="Operations Overview" subtitle="Core KPIs aligned with emergency planning requirements">
        <div className="dashboard-hero">
          <div>
            <p className="dashboard-hero-eyebrow">Shift briefing</p>
            <h4>Current operational workload</h4>
            <p className="muted section-description">Prioritize approvals and uncovered zones to keep deployment readiness stable.</p>
          </div>
          <div className="dashboard-hero-chips">
            <span>
              Action items
              <strong>{totalActionItems}</strong>
            </span>
            <span>
              Priority focus
              <strong>{criticalFocus}</strong>
            </span>
          </div>
        </div>

        <ul className="stats-grid dashboard-overview-links">
          {overviewLinks.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className={`stats-link tone-${item.tone}`}>
                <span className="stats-link-label">{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.helper}</small>
                <span className="stats-link-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection title="Latest notifications" subtitle="Recent system and workflow signals">
        <ul className="item-list dashboard-notifications">
          {notifications.map((item) => {
            const link = getNotificationLink(item.title, item.body)

            return (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
                {link ? (
                  <Link to={link.to} className="dashboard-notification-link">
                    {link.label} →
                  </Link>
                ) : null}
              </li>
            )
          })}
        </ul>
      </PageSection>

    </div>
  )
}
