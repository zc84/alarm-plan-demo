import { useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/login', label: 'Login & Role' },
  { to: '/alarm-plans', label: 'Alarm Plans' },
  { to: '/approval-center', label: 'Approval Center' },
  { to: '/zones', label: 'Operational Zones' },
  { to: '/alarm-devices', label: 'Alarm Devices' },
  { to: '/deployment-order', label: 'Deployment Order' },
  { to: '/vehicle-modifications', label: 'Vehicle Changes' },
  { to: '/additional-modules', label: 'Additional Modules' },
  { to: '/phone-list', label: 'Phone List' },
  { to: '/heavy-load-switching', label: 'Heavy-Load Switch' },
  { to: '/checklists', label: 'Checklists' },
  { to: '/poi-management', label: 'POI Management' },
  { to: '/fire-department-info', label: 'FD Info' },
  { to: '/operation-feedback', label: 'Operation Feedback' },
  { to: '/vehicle-resources', label: 'Vehicle Resources' },
  { to: '/documents-workspace', label: 'Documents' },
  { to: '/integration-preview', label: 'Integration Preview' },
  { to: '/security-architecture', label: 'Security & Architecture' },
  { to: '/print-exports', label: 'Print & Exports' },
  { to: '/audit-log', label: 'Audit Log' },
]

export function Layout() {
  const { currentContext, users, roleDefinitions } = useAppContext()
  const user = users.find((entry) => entry.id === currentContext.userId) ?? users[0]
  const role = roleDefinitions.find((entry) => entry.key === currentContext.role)
  const userRoleLabels = user.availableRoles
    .map((roleKey) => roleDefinitions.find((entry) => entry.key === roleKey)?.label ?? roleKey)
    .join(', ')

  useEffect(() => {
    const theme =
      currentContext.role === 'LWZ_EMPLOYEE' || currentContext.role === 'STATE_COMMAND'
        ? 'lwz'
        : currentContext.role === 'FIRE_CHIEF' || currentContext.role === 'SECRETARY'
          ? 'command'
          : currentContext.role === 'FIREFIGHTER'
            ? 'field'
            : 'district'

    document.body.setAttribute('data-role-theme', theme)

    return () => {
      document.body.removeAttribute('data-role-theme')
    }
  }, [currentContext.role])

  return (
    <div className={`app-shell role-${currentContext.role.toLowerCase().replaceAll('_', '-')}`}>
      <aside className="sidebar">
        <div className="brand">
          <img className="brand-logo" src="/ooelfv-logo.svg" alt="OÖ Landes-Feuerwehrverband" />
          <div>
            <h1>OÖLFV Alarm Planning</h1>
            <p>Landes-Feuerwehrverband Style Workspace</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="nav-dot" aria-hidden="true">
                {item.label.slice(0, 2).toUpperCase()}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="header-card">
          <div className="header-main">
            <p className="eyebrow">Active Operator</p>
            <h2>
              {user.name} ({userRoleLabels})
            </h2>
            <p>
              Role: <strong>{role?.label}</strong>
            </p>
            <div className="header-links">
              <Link to="/documentation">Documentation</Link>
              <Link to="/login">Change user</Link>
            </div>
          </div>
          <div className="header-meta">
            <div className="meta-chip">
              <span className="meta-label">Scope</span>
              <strong>
                {currentContext.scopeType} / {currentContext.scopeValue}
              </strong>
              <small>ALL means state-wide visibility across Upper Austria.</small>
            </div>
            <p>
              Last sync: <strong>just now</strong>
            </p>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  )
}
