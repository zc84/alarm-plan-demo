import { useState } from 'react'
import { PageSection } from '../components/PageSection'
import { useAppContext } from '../context/AppContext'

export function PrintExportsPage() {
  const { alarmPlans, operationZones, approvals } = useAppContext()
  const [lastExportMessage, setLastExportMessage] = useState('')

  const downloadFile = (fileName: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = fileName
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const exportJson = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      alarmPlans,
      operationZones,
      approvals,
    }

    downloadFile('alarm-plan-demo-export.json', JSON.stringify(payload, null, 2), 'application/json')
    setLastExportMessage('JSON export generated locally.')
  }

  const exportCsv = () => {
    const rows = [
      ['Plan ID', 'Title', 'Category', 'Status', 'Version'],
      ...alarmPlans.map((plan) => [plan.id, plan.title, plan.category, plan.status, String(plan.version)]),
    ]

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
    downloadFile('alarm-plans.csv', csv, 'text/csv;charset=utf-8')
    setLastExportMessage('CSV export generated locally.')
  }

  return (
    <div className="page-grid">
      <PageSection title="Print & exports" subtitle="Print-ready views and simulated PDF/email delivery actions">
        <div className="actions">
          <button type="button" onClick={() => window.print()}>
            Start browser print
          </button>
          <button type="button">Simulate PDF delivery</button>
          <button type="button" onClick={exportJson}>
            Export JSON
          </button>
          <button type="button" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
        {lastExportMessage ? <p className="muted top-gap">{lastExportMessage}</p> : null}
      </PageSection>

    </div>
  )
}
