import { useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '⌂' },
  { to: '/login', label: 'Identity & Access', icon: '◉' },
  { to: '/alarm-plans', label: 'Alarm Plans', icon: '▦' },
  { to: '/approval-center', label: 'Approval Center', icon: '✓' },
  { to: '/zones', label: 'Operational Zones', icon: '⌖' },
  { to: '/alarm-devices', label: 'Alarm Devices', icon: '⏺' },
  { to: '/deployment-order', label: 'Deployment Order', icon: '⇅' },
  { to: '/vehicle-modifications', label: 'Vehicle Changes', icon: '⚙' },
  { to: '/additional-modules', label: 'Additional Modules', icon: '⊞' },
  { to: '/phone-list', label: 'Phone List', icon: '☎' },
  { to: '/heavy-load-switching', label: 'Heavy-Load Switch', icon: '⟲' },
  { to: '/checklists', label: 'Checklists', icon: '☑' },
  { to: '/poi-management', label: 'POI Management', icon: '⌘' },
  { to: '/fire-department-info', label: 'FD Info', icon: '⚑' },
  { to: '/operation-feedback', label: 'Operation Feedback', icon: '✎' },
  { to: '/vehicle-resources', label: 'Vehicle Resources', icon: '⚒' },
  { to: '/documents-workspace', label: 'Documents', icon: '☰' },
  { to: '/integration-preview', label: 'Integration Preview', icon: '⇄' },
  { to: '/security-architecture', label: 'Security & Architecture', icon: '⛨' },
  { to: '/print-exports', label: 'Print & Exports', icon: '⎙' },
  { to: '/audit-log', label: 'Audit Log', icon: '◷' },
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
            <p>Alarm Plan Demo Workspace</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="nav-dot" aria-hidden="true">
                {item.icon}
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
            <p>
              Scope: <strong>{currentContext.scopeType} / {currentContext.scopeValue}</strong>
            </p>
            <div className="header-links">
              <Link to="/documentation">User Guide</Link>
              <Link to="/login">Switch identity context</Link>
            </div>
          </div>
          <div className="header-meta">
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
