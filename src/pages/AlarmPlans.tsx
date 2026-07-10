import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PermissionGate } from '../components/PermissionGate'
import { PageSection } from '../components/PageSection'
import { useAppContext } from '../context/AppContext'

const categoryFilters = ['ALL', 'PB', 'AUTOB', 'GW', 'RAIL', 'SOAP', 'FKAT'] as const
const statusFilters = ['ALL', 'DRAFT', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'SUPERSEDED'] as const

export function AlarmPlansPage() {
  const { alarmPlans } = useAppContext()
  const [categoryFilter, setCategoryFilter] = useState<(typeof categoryFilters)[number]>('ALL')
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPlans = useMemo(() => {
    return alarmPlans.filter((plan) => {
      const categoryMatch = categoryFilter === 'ALL' || plan.category === categoryFilter
      const statusMatch = statusFilter === 'ALL' || plan.status === statusFilter
      const searchMatch =
        searchTerm.trim().length === 0 ||
        `${plan.id} ${plan.title} ${plan.ownerFireDepartment}`.toLowerCase().includes(searchTerm.toLowerCase())

      return categoryMatch && statusMatch && searchMatch
    })
  }, [alarmPlans, categoryFilter, searchTerm, statusFilter])

  const planStats = {
    total: alarmPlans.length,
    drafts: alarmPlans.filter((plan) => plan.status === 'DRAFT').length,
    inReview: alarmPlans.filter((plan) => plan.status === 'IN_REVIEW').length,
    approved: alarmPlans.filter((plan) => plan.status === 'APPROVED').length,
  }

  return (
    <div className="page-grid">
      <PageSection title="Alarm plan lifecycle" subtitle="Versioning and category coverage at a glance">
        <ul className="stats-grid">
          <li>
            <span>Total plans</span>
            <strong>{planStats.total}</strong>
          </li>
          <li>
            <span>Drafts</span>
            <strong>{planStats.drafts}</strong>
          </li>
          <li>
            <span>In approval</span>
            <strong>{planStats.inReview}</strong>
          </li>
          <li>
            <span>Approved</span>
            <strong>{planStats.approved}</strong>
          </li>
        </ul>
      </PageSection>

      <PageSection title="Alarm plan registry" subtitle="Central overview of categories, lifecycle status, and version history">
        <div className="toolbar-grid">
          <label>
            Category
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as (typeof categoryFilters)[number])}>
              {categoryFilters.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as (typeof statusFilters)[number])}>
              {statusFilters.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>

          <label>
            Search plan / owner
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="AP-2026, motorway, FF Asten..."
            />
          </label>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Version</th>
              <th>Dependencies</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.map((plan) => (
              <tr key={plan.id}>
                <td>{plan.id}</td>
                <td>{plan.title}</td>
                <td>{plan.category}</td>
                <td>
                  <span className={`status-badge status-${plan.status.toLowerCase()}`}>{plan.status}</span>
                </td>
                <td>v{plan.version}</td>
                <td>{plan.zones.length} zones / {plan.assignedFireDepartments.length} departments</td>
                <td>
                  <div className="actions">
                    <Link to="/alarm-plan-editor">Open editor</Link>
                    <PermissionGate anyOf={['LWZ_EMPLOYEE', 'FIRE_CHIEF', 'SECRETARY']}>
                      <button type="button">Duplicate to draft</button>
                    </PermissionGate>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPlans.length === 0 ? (
              <tr>
                <td colSpan={7} className="muted">
                  No plans match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </PageSection>

    </div>
  )
}
