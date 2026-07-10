import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { PageSection } from '../components/PageSection'
import { useAppContext } from '../context/AppContext'

const scopeOptions = {
  ALL: ['Upper Austria'],
  DISTRICT: ['Linz-Land', 'Wels-Land', 'Steyr-Land'],
  MUNICIPALITY: ['Ansfelden', 'Asten', 'Marchtrenk'],
  FIRE_DEPARTMENT: ['FF Ansfelden', 'FF Asten', 'FF Marchtrenk'],
} as const

export function LoginRoleSelectPage() {
  const { currentContext, users, roleDefinitions, setCurrentUserId, setRole, setScope } = useAppContext()
  const user = users.find((entry) => entry.id === currentContext.userId) ?? users[0]
  const [showAdvanced, setShowAdvanced] = useState(false)

  const formatUserLabel = (id: string) => {
    const entry = users.find((item) => item.id === id)
    if (!entry) return id

    const roles = entry.availableRoles
      .map((roleKey) => roleDefinitions.find((role) => role.key === roleKey)?.label ?? roleKey)
      .join(', ')

    return `${entry.name} (${roles})`
  }

  const roleEntries = roleDefinitions.filter((entry) => user.availableRoles.includes(entry.key))

  const onScopeTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextType = event.target.value as keyof typeof scopeOptions
    setScope(nextType, scopeOptions[nextType][0])
  }

  return (
    <div className="page-grid">
      <PageSection title="Mock login & role selection" subtitle="Simulation of Keycloak/OIDC claims and multi-role context switching">
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

        <div className="actions top-gap">
          <button type="button" onClick={() => setShowAdvanced((prev) => !prev)}>
            {showAdvanced ? 'Hide advanced role/scope' : 'Show advanced role/scope'}
          </button>
        </div>

        {showAdvanced ? (
          <div className="form-grid top-gap">
            <label>
              Active role
              <select value={currentContext.role} onChange={(event) => setRole(event.target.value as typeof currentContext.role)}>
                {roleEntries.map((entry) => (
                  <option key={entry.key} value={entry.key}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Scope type
              <select value={currentContext.scopeType} onChange={onScopeTypeChange}>
                {Object.keys(scopeOptions).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Scope value
              <select
                value={currentContext.scopeValue}
                onChange={(event) => setScope(currentContext.scopeType, event.target.value)}
              >
                {scopeOptions[currentContext.scopeType].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
      </PageSection>

      <PageSection title="Role model notes" subtitle="How this context selection supports realistic validation">
        <ul className="item-list">
          <li>Switching users and scopes allows rapid testing of permission-sensitive screens.</li>
          <li>Multi-role support reflects real-world workflows where one person may serve multiple functions.</li>
          <li>Scope-aware logic keeps district, municipality, and department boundaries explicit.</li>
        </ul>
      </PageSection>
    </div>
  )
}
