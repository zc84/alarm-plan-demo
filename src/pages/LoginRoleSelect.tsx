import { PageSection } from '../components/PageSection'
import { useAppContext } from '../context/AppContext'

const roleDescriptions: Record<string, string> = {
  LWZ_EMPLOYEE: 'State-wide operations coordination and central dispatch workflows.',
  EUS_EMPLOYEE: 'Cross-system support for dispatch, integration, and escalation handling.',
  STATE_COMMAND: 'Strategic command-level oversight with state-wide read and approval authority.',
  BFK: 'District fire command responsibilities for district-level review and approvals.',
  AFK: 'Section-level command tasks for local operational planning and review.',
  PBKDT: 'Municipality-level plan ownership and preparation responsibilities.',
  FIRE_CHIEF: 'Fire department operational leadership and final local decisions.',
  SECRETARY: 'Administrative coordination, documentation, and submission support.',
  FIREFIGHTER: 'Operational execution role with field-oriented visibility.',
  OEWR: 'Water-rescue collaboration role for district-level interoperability scenarios.',
}

const scopeLabels: Record<string, string> = {
  ALL: 'State-wide visibility',
  DISTRICT: 'District-limited visibility',
  MUNICIPALITY: 'Municipality-limited visibility',
  FIRE_DEPARTMENT: 'Fire department-limited visibility',
}

export function LoginRoleSelectPage() {
  const { currentContext, users, roleDefinitions, setCurrentUserId } = useAppContext()
  const user = users.find((entry) => entry.id === currentContext.userId) ?? users[0]
  const roleEntries = roleDefinitions.filter((entry) => user.availableRoles.includes(entry.key))
  const activeRole = roleDefinitions.find((entry) => entry.key === currentContext.role)

  const formatUserLabel = (id: string) => {
    const entry = users.find((item) => item.id === id)
    if (!entry) return id

    const roles = entry.availableRoles
      .map((roleKey) => roleDefinitions.find((role) => role.key === roleKey)?.label ?? roleKey)
      .join(', ')

    return `${entry.name} (${roles})`
  }

  return (
    <div className="page-grid identity-page">
      <PageSection title="Identity & access">
        <div className="form-grid">
          <label>
            User
            <select value={currentContext.userId} onChange={(event) => setCurrentUserId(event.target.value)}>
              {users.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {formatUserLabel(entry.id)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="identity-context-chips top-gap">
          <span className="rounded-element">
            <span className="meta-label">Current role</span>
            <strong>{activeRole?.label ?? currentContext.role}</strong>
            <small>
              Scope:{' '}
              {currentContext.scopeType} / {currentContext.scopeValue}
            </small>
          </span>
          <span className="rounded-element">
            <span className="meta-label">Assigned roles</span>
            <strong>{roleEntries.length}</strong>
          </span>
        </div>
      </PageSection>

      <PageSection title="Role access matrix" subtitle="Role-based visibility details for selected user">
        <p className="section-description">Shared default table styling is used below to keep hierarchy and readability consistent with other operational modules.</p>

        <div className="table-wrap top-gap">
          <table className="table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Scope</th>
                <th>Responsibility</th>
                <th>Access profile</th>
              </tr>
            </thead>
            <tbody>
              {roleEntries.map((entry) => (
                <tr key={entry.key}>
                  <td>
                    <strong>{entry.label}</strong>
                  </td>
                  <td>{scopeLabels[entry.scopeType] ?? entry.scopeType}</td>
                  <td>{roleDescriptions[entry.key] ?? 'Role-based access according to profile configuration.'}</td>
                  <td>{entry.scopeType === 'ALL' ? 'Cross-module visibility and approval authority' : 'Scoped operational access in assigned area'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>
    </div>
  )
}