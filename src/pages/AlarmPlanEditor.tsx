import { useMemo, useState } from 'react'
import { PermissionGate } from '../components/PermissionGate'
import { PageSection } from '../components/PageSection'
import { useAppContext } from '../context/AppContext'
import type { PlanCategory } from '../types'

const steps = [
  'Choose category and cover template',
  'Assign operational zones',
  'Define keywords and incident types',
  'Configure alarm levels and time references',
  'Assign fire departments and vehicles',
  'Validate minimum coverage standards',
  'Compare revisions',
  'Submit for approval',
]

const categories: PlanCategory[] = ['PB', 'AUTOB', 'GW', 'RAIL', 'SOAP', 'FKAT']
const alarmLevels = ['AL1', 'AL2', 'AL3', 'AL4']
const timeReferences = ['Always', 'Weekday daytime', 'Weekday night/weekend/holiday']

export function AlarmPlanEditorPage() {
  const { operationZones, alarmPlans } = useAppContext()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<PlanCategory>('PB')
  const [selectedZones, setSelectedZones] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(['Residential fire'])
  const [selectedAlarmLevel, setSelectedAlarmLevel] = useState('AL2')
  const [selectedTimeReference, setSelectedTimeReference] = useState('Always')
  const [assignedDepartments, setAssignedDepartments] = useState<string[]>(['FF Ansfelden'])

  const departmentPool = useMemo(() => {
    const allDepartments = alarmPlans.flatMap((plan) => [plan.ownerFireDepartment, ...plan.assignedFireDepartments])
    return Array.from(new Set(allDepartments)).sort((a, b) => a.localeCompare(b))
  }, [alarmPlans])

  const zoneCoverageGap = selectedZones.some((zoneId) => {
    const zone = operationZones.find((entry) => entry.id === zoneId)
    return zone ? !zone.hasApprovedPlan : false
  })

  const minimumEquipmentMet = assignedDepartments.length >= 2
  const canSubmit = selectedZones.length > 0 && selectedKeywords.length > 0 && !zoneCoverageGap && minimumEquipmentMet

  const toggleValue = (value: string, selected: string[], setter: (next: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter((entry) => entry !== value))
      return
    }

    setter([...selected, value])
  }

  const addKeyword = () => {
    const normalized = keywordInput.trim()
    if (!normalized || selectedKeywords.includes(normalized)) {
      return
    }

    setSelectedKeywords((prev) => [...prev, normalized])
    setKeywordInput('')
  }

  return (
    <div className="page-grid">
      <PageSection title="Alarm plan editor (wizard)" subtitle="Guided workflow simulation for authoring and validation">
        <div className="wizard-layout">
          <ol className="stepper">
            {steps.map((step, index) => (
              <li key={step} className={`stepper-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'done' : ''}`}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>

          <div className="wizard-panel">
            <div className="form-grid">
              <label>
                Alarm plan category
                <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value as PlanCategory)}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Cover sheet template
                <select defaultValue="STANDARD">
                  <option value="STANDARD">Standard cover sheet</option>
                  <option value="CATEGORY_EXTENDED">Category extended cover sheet</option>
                  <option value="LWZ_REVIEW">LWZ review cover sheet</option>
                </select>
              </label>

              <label>
                Alarm level
                <select value={selectedAlarmLevel} onChange={(event) => setSelectedAlarmLevel(event.target.value)}>
                  {alarmLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Time reference
                <select value={selectedTimeReference} onChange={(event) => setSelectedTimeReference(event.target.value)}>
                  {timeReferences.map((reference) => (
                    <option key={reference} value={reference}>
                      {reference}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="selector-grid">
              <article>
                <h4>Operational zones</h4>
                <div className="chip-grid">
                  {operationZones.map((zone) => (
                    <button
                      key={zone.id}
                      type="button"
                      className={`chip-button ${selectedZones.includes(zone.id) ? 'selected' : ''}`}
                      onClick={() => toggleValue(zone.id, selectedZones, setSelectedZones)}
                    >
                      {zone.zoneNumber} · {zone.name}
                    </button>
                  ))}
                </div>
              </article>

              <article>
                <h4>Assigned departments</h4>
                <div className="chip-grid">
                  {departmentPool.map((department) => (
                    <button
                      key={department}
                      type="button"
                      className={`chip-button ${assignedDepartments.includes(department) ? 'selected' : ''}`}
                      onClick={() => toggleValue(department, assignedDepartments, setAssignedDepartments)}
                    >
                      {department}
                    </button>
                  ))}
                </div>
              </article>
            </div>

            <div className="keyword-row">
              <label>
                Incident keyword
                <input
                  value={keywordInput}
                  onChange={(event) => setKeywordInput(event.target.value)}
                  placeholder="e.g. hazardous material leak"
                />
              </label>
              <button type="button" onClick={addKeyword}>
                Add keyword
              </button>
            </div>

            <div className="badge-row">
              {selectedKeywords.map((keyword) => (
                <span key={keyword} className="info-badge">
                  {keyword}
                </span>
              ))}
            </div>

            <div className="validation-grid">
              <article className={`validation-card ${zoneCoverageGap ? 'warning' : 'ok'}`}>
                <h4>Coverage completeness</h4>
                <p>
                  {zoneCoverageGap
                    ? 'Selected zone includes gaps with no approved plan. Release is blocked until resolved.'
                    : 'No coverage gap detected for current zone selection.'}
                </p>
              </article>
              <article className={`validation-card ${minimumEquipmentMet ? 'ok' : 'warning'}`}>
                <h4>Minimum equipment standard</h4>
                <p>
                  {minimumEquipmentMet
                    ? 'Minimum staffing/equipment threshold is met in this draft.'
                    : 'Assign at least two departments to satisfy minimum readiness requirements.'}
                </p>
              </article>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Previous approved</th>
                    <th>Current draft</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Category</td>
                    <td>PB</td>
                    <td>{selectedCategory}</td>
                    <td>{selectedCategory === 'PB' ? 'No change' : 'Changed'}</td>
                  </tr>
                  <tr>
                    <td>Assigned zones</td>
                    <td>2 zones</td>
                    <td>{selectedZones.length} zones</td>
                    <td>{selectedZones.length === 2 ? 'No change' : 'Changed'}</td>
                  </tr>
                  <tr>
                    <td>Keywords</td>
                    <td>Residential fire</td>
                    <td>{selectedKeywords.join(', ') || '-'}</td>
                    <td>{selectedKeywords.length === 1 ? 'No change' : 'Changed'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="wizard-actions">
              <button type="button" disabled={currentStep === 0} onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}>
                Previous step
              </button>
              <button
                type="button"
                disabled={currentStep === steps.length - 1}
                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
              >
                Next step
              </button>
              <PermissionGate
                anyOf={['LWZ_EMPLOYEE', 'FIRE_CHIEF', 'SECRETARY']}
                fallback={<span className="muted">You have read-only access for release actions.</span>}
              >
                <button type="button" disabled={!canSubmit}>
                  Submit for approval
                </button>
              </PermissionGate>
            </div>
          </div>
        </div>
        <p className="muted">Validation checks and coverage warnings are calculated locally in this demo environment.</p>
      </PageSection>

    </div>
  )
}
