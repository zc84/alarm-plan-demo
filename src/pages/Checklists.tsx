import { PageSection } from '../components/PageSection'

const checklistItems = [
  { keyword: 'Residential fire', checklist: 'Hydrant check, breathing apparatus, evacuation officer assigned' },
  { keyword: 'Traffic accident', checklist: 'Scene safety, hydraulic rescue tools, medical triage support' },
  { keyword: 'Water rescue', checklist: 'Boat team, throw-bag line, diver standby, river traffic warning' },
]

export function ChecklistsPage() {
  return (
    <div className="page-grid">
      <PageSection title="Operational checklists" subtitle="Keyword-based checklist guidance for first response">
        <table className="table">
          <thead>
            <tr>
              <th>Keyword</th>
              <th>Checklist</th>
            </tr>
          </thead>
          <tbody>
            {checklistItems.map((entry) => (
              <tr key={entry.keyword}>
                <td>{entry.keyword}</td>
                <td>{entry.checklist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageSection>
    </div>
  )
}
