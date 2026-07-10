import { useMemo, useState } from 'react'
import { PermissionGate } from '../components/PermissionGate'
import { PageSection } from '../components/PageSection'

interface ChecklistItem {
  id: string
  keyword: string
  checklist: string
}

const initialChecklistItems: ChecklistItem[] = [
  { id: 'CL-1', keyword: 'Residential fire', checklist: 'Hydrant check, breathing apparatus, evacuation officer assigned' },
  { id: 'CL-2', keyword: 'Traffic accident', checklist: 'Scene safety, hydraulic rescue tools, medical triage support' },
  { id: 'CL-3', keyword: 'Water rescue', checklist: 'Boat team, throw-bag line, diver standby, river traffic warning' },
]

export function ChecklistsPage() {
  const [items, setItems] = useState(initialChecklistItems)
  const [search, setSearch] = useState('')

  const filteredItems = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return items

    return items.filter((entry) => `${entry.keyword} ${entry.checklist}`.toLowerCase().includes(normalized))
  }, [items, search])

  const deleteChecklist = (id: string) => {
    setItems((prev) => prev.filter((entry) => entry.id !== id))
  }

  return (
    <div className="page-grid">
      <PageSection title="Operational checklists" subtitle="Keyword-based checklist guidance for first response">
        <div className="toolbar-grid compact">
          <label>
            Search checklist
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Keyword or checklist step..." />
          </label>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Keyword</th>
              <th>Checklist</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.keyword}</td>
                <td>{entry.checklist}</td>
                <td>
                  <PermissionGate anyOf={['LWZ_EMPLOYEE', 'FIRE_CHIEF', 'SECRETARY']} fallback={<span className="muted">Read only</span>}>
                    <div className="table-actions">
                      <button type="button" className="action-btn action-secondary" onClick={() => deleteChecklist(entry.id)}>
                        <span className="action-icon" aria-hidden="true">🗑</span>
                        Delete
                      </button>
                    </div>
                  </PermissionGate>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={3} className="muted">No checklist entries found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>

      </PageSection>
    </div>
  )
}
