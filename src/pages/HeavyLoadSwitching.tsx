import { useState } from 'react'
import { PageSection } from '../components/PageSection'

export function HeavyLoadSwitchingPage() {
  const [mode, setMode] = useState<'NORMAL' | 'HEAVY_LOAD'>('NORMAL')

  return (
    <div className="page-grid">
      <PageSection title="Heavy-load switching" subtitle="Simulated high-load operation profile activation">
        <div className="actions">
          <button type="button" onClick={() => setMode('NORMAL')} disabled={mode === 'NORMAL'}>
            Normal mode
          </button>
          <button type="button" onClick={() => setMode('HEAVY_LOAD')} disabled={mode === 'HEAVY_LOAD'}>
            Heavy-load mode
          </button>
        </div>
        <p className="muted top-gap">
          Current mode: <strong>{mode}</strong>
        </p>
      </PageSection>
    </div>
  )
}
