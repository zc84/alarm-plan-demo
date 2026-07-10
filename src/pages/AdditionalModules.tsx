import { Link } from 'react-router-dom'
import { PageSection } from '../components/PageSection'

const modules = [
  { label: 'Phone directory', route: '/phone-list' },
  { label: 'Heavy-load mode switching', route: '/heavy-load-switching' },
  { label: 'Operational checklists', route: '/checklists' },
  { label: 'POI management', route: '/poi-management' },
  { label: 'Fire department profile extensions', route: '/fire-department-info' },
  { label: 'Mission feedback', route: '/operation-feedback' },
  { label: 'Custom vehicles & resources', route: '/vehicle-resources' },
  { label: 'Document workspace', route: '/documents-workspace' },
]

export function AdditionalModulesPage() {
  return (
    <div className="page-grid">
      <PageSection title="Additional modules" subtitle="Feature extensions mapped to RFP scope">
        <ul className="stats-grid">
          {modules.map((module) => (
            <li key={module.label}>
              <span>{module.label}</span>
              <strong>
                <Link to={module.route}>Open module</Link>
              </strong>
            </li>
          ))}
        </ul>
      </PageSection>

    </div>
  )
}
