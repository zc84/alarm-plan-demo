import { useState } from 'react'
import { PermissionGate } from '../components/PermissionGate'
import { PageSection } from '../components/PageSection'

const initialInternalOrder = [
  { rank: 1, keyword: 'Residential fire', vehicle: 'TLF Asten-1', eta: '0 min' },
  { rank: 2, keyword: 'Residential fire', vehicle: 'DLK Ansfelden-1', eta: '2 min' },
  { rank: 3, keyword: 'Residential fire', vehicle: 'RLF St. Florian-2', eta: '5 min' },
]

export function DeploymentOrderPage() {
  const [internalOrder, setInternalOrder] = useState(initialInternalOrder)

  const moveEntry = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= internalOrder.length) return

    setInternalOrder((prev) => {
      const copy = [...prev]
      const [item] = copy.splice(index, 1)
      copy.splice(nextIndex, 0, item)
      return copy.map((entry, position) => ({ ...entry, rank: position + 1 }))
    })
  }

  return (
    <div className="page-grid two-cols">
      <PageSection title="Internal deployment order" subtitle="Editable ranking by keyword and alarm level">
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Vehicle</th>
              <th>Keyword</th>
              <th>ETA</th>
              <th>Order control</th>
            </tr>
          </thead>
          <tbody>
            {internalOrder.map((entry, index) => (
              <tr key={`${entry.rank}-${entry.vehicle}`}>
                <td>#{entry.rank}</td>
                <td>{entry.vehicle}</td>
                <td>{entry.keyword}</td>
                <td>{entry.eta}</td>
                <td>
                  <PermissionGate anyOf={['FIRE_CHIEF', 'SECRETARY', 'LWZ_EMPLOYEE']} fallback={<span className="muted">Read only</span>}>
                    <div className="actions">
                      <button type="button" onClick={() => moveEntry(index, -1)} disabled={index === 0}>
                        Move up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveEntry(index, 1)}
                        disabled={index === internalOrder.length - 1}
                      >
                        Move down
                      </button>
                    </div>
                  </PermissionGate>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageSection>

      <PageSection title="External deployment order" subtitle="Read-only sequence derived automatically from approved alarm plans">
        <p className="muted">This demo presents a preview of the generated order and interface handoff logic.</p>
      </PageSection>
    </div>
  )
}
