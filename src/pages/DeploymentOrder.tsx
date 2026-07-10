import { useMemo, useState } from 'react'
import { PermissionGate } from '../components/PermissionGate'
import { PageSection } from '../components/PageSection'

const initialInternalOrder = [
  { rank: 1, keyword: 'Residential fire', vehicle: 'TLF Asten-1', eta: '0 min' },
  { rank: 2, keyword: 'Residential fire', vehicle: 'DLK Ansfelden-1', eta: '2 min' },
  { rank: 3, keyword: 'Residential fire', vehicle: 'RLF St. Florian-2', eta: '5 min' },
]

export function DeploymentOrderPage() {
  const [internalOrder, setInternalOrder] = useState(initialInternalOrder)
  const [previewGeneratedAt, setPreviewGeneratedAt] = useState(() => new Date())
  const [handoffStatus, setHandoffStatus] = useState<'READY' | 'TRANSFERRED'>('READY')

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

  const externalOrder = useMemo(
    () =>
      internalOrder.map((entry, index) => ({
        ...entry,
        dispatchChannel: index === 0 ? 'Primary dispatch' : 'Fallback dispatch',
        source: 'Generated from approved internal ranking',
      })),
    [internalOrder],
  )

  const regenerateExternalPreview = () => {
    setPreviewGeneratedAt(new Date())
    setHandoffStatus('READY')
  }

  const exportExternalPreview = () => {
    const lines = [
      ['Rank', 'Vehicle', 'Keyword', 'ETA', 'Dispatch channel', 'Source'].join(','),
      ...externalOrder.map((entry) =>
        [entry.rank, entry.vehicle, entry.keyword, entry.eta, entry.dispatchChannel, entry.source]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(','),
      ),
    ]

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.href = url
    link.download = 'external-deployment-order-preview.csv'
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const simulateHandoff = () => {
    setHandoffStatus('TRANSFERRED')
  }

  return (
    <div className="page-grid">
      <PageSection title="Internal deployment order" subtitle="Editable ranking by keyword and alarm level">
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Vehicle</th>
              <th>Keyword</th>
              <th>ETA</th>
              <th className="deployment-order-control-col">Order control</th>
            </tr>
          </thead>
          <tbody>
            {internalOrder.map((entry, index) => (
              <tr key={`${entry.rank}-${entry.vehicle}`}>
                <td>#{entry.rank}</td>
                <td>{entry.vehicle}</td>
                <td>{entry.keyword}</td>
                <td>{entry.eta}</td>
                <td className="deployment-order-control-col">
                  <PermissionGate anyOf={['FIRE_CHIEF', 'SECRETARY', 'LWZ_EMPLOYEE']} fallback={<span className="muted">Read only</span>}>
                    <div className="table-actions deployment-order-actions">
                      <button type="button" className="action-btn action-secondary" onClick={() => moveEntry(index, -1)} disabled={index === 0}>
                        <span className="action-icon" aria-hidden="true">↑</span>
                        Move up
                      </button>
                      <button
                        type="button"
                        className="action-btn action-secondary"
                        onClick={() => moveEntry(index, 1)}
                        disabled={index === internalOrder.length - 1}
                      >
                        <span className="action-icon" aria-hidden="true">↓</span>
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
        <div className="actions">
          <button type="button" onClick={regenerateExternalPreview}>Regenerate preview</button>
          <button type="button" onClick={exportExternalPreview}>Export CSV</button>
          <PermissionGate anyOf={['FIRE_CHIEF', 'SECRETARY', 'LWZ_EMPLOYEE']} fallback={<span className="muted">Read only handoff access</span>}>
            <button type="button" onClick={simulateHandoff} disabled={handoffStatus === 'TRANSFERRED'}>
              {handoffStatus === 'TRANSFERRED' ? 'ELS handoff completed' : 'Simulate ELS handoff'}
            </button>
          </PermissionGate>
        </div>

        <p className="muted top-gap">
          Preview generated: <strong>{previewGeneratedAt.toLocaleString()}</strong> · Handoff status:{' '}
          <strong>{handoffStatus === 'TRANSFERRED' ? 'Transferred to ELS' : 'Ready for transfer'}</strong>
        </p>

        <table className="table top-gap">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Vehicle</th>
              <th>Keyword</th>
              <th>ETA</th>
              <th>Dispatch channel</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {externalOrder.map((entry) => (
              <tr key={`external-${entry.rank}-${entry.vehicle}`}>
                <td>#{entry.rank}</td>
                <td>{entry.vehicle}</td>
                <td>{entry.keyword}</td>
                <td>{entry.eta}</td>
                <td>{entry.dispatchChannel}</td>
                <td>{entry.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageSection>
    </div>
  )
}
