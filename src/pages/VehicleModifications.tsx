import { useMemo, useState } from 'react'
import { PermissionGate } from '../components/PermissionGate'
import { PageSection } from '../components/PageSection'
import { useAppContext } from '../context/AppContext'
import type { VehicleTask } from '../types'

function formatTaskStatus(status: string) {
  return status
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatTaskType(type: VehicleTask['type']) {
  return type
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getTaskStatusBadgeClass(status: VehicleTask['status']) {
  return status === 'DONE' ? 'status-done' : 'status-open'
}

export function VehicleModificationsPage() {
  const { vehicleTasks } = useAppContext()
  const [taskState, setTaskState] = useState(vehicleTasks)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    fireDepartment: '',
    type: 'REPLACEMENT_REQUIRED' as VehicleTask['type'],
    vehicle: '',
    suggestion: '',
  })

  const canCreateTask = form.fireDepartment.trim().length > 0 && form.vehicle.trim().length > 0

  const openTaskCount = useMemo(() => taskState.filter((task) => task.status === 'OPEN').length, [taskState])
  const filteredTasks = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return taskState

    return taskState.filter((task) =>
      `${task.fireDepartment} ${task.type} ${task.vehicle} ${task.suggestion ?? ''} ${task.status}`.toLowerCase().includes(normalized),
    )
  }, [search, taskState])

  const updateSuggestion = (taskId: string, suggestion: string) => {
    setTaskState((prev) => prev.map((task) => (task.id === taskId ? { ...task, suggestion } : task)))
  }

  const setTaskStatus = (taskId: string, status: VehicleTask['status']) => {
    setTaskState((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)))
  }

  const addTask = () => {
    const normalizedDepartment = form.fireDepartment.trim()
    const normalizedVehicle = form.vehicle.trim()
    if (!normalizedDepartment || !normalizedVehicle) return

    setTaskState((prev) => [
      ...prev,
      {
        id: `VT-${Date.now()}`,
        fireDepartment: normalizedDepartment,
        type: form.type,
        vehicle: normalizedVehicle,
        suggestion: form.suggestion.trim() || undefined,
        status: 'OPEN',
      },
    ])

    setForm({ fireDepartment: '', type: 'REPLACEMENT_REQUIRED', vehicle: '', suggestion: '' })
  }

  const deleteTask = (taskId: string) => {
    setTaskState((prev) => prev.filter((task) => task.id !== taskId))
  }

  return (
    <div className="page-grid">
      <PageSection title="Vehicle modifications" subtitle="New or retired assets and replacement task tracking">
        <p className="section-description">
          Open tasks: <strong>{openTaskCount}</strong> · Use row actions to maintain proposal quality and completion state.
        </p>

        <div className="form-grid">
          <label>
            Department
            <input
              value={form.fireDepartment}
              onChange={(event) => setForm((prev) => ({ ...prev, fireDepartment: event.target.value }))}
              placeholder="FF Asten"
            />
          </label>
          <label>
            Task type
            <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as VehicleTask['type'] }))}>
              <option value="NEW_VEHICLE">New vehicle</option>
              <option value="REMOVED_VEHICLE">Removed vehicle</option>
              <option value="REPLACEMENT_REQUIRED">Replacement required</option>
            </select>
          </label>
          <label>
            Vehicle
            <input value={form.vehicle} onChange={(event) => setForm((prev) => ({ ...prev, vehicle: event.target.value }))} placeholder="HLF3 Asten-1" />
          </label>
          <label>
            Replacement proposal
            <input
              value={form.suggestion}
              onChange={(event) => setForm((prev) => ({ ...prev, suggestion: event.target.value }))}
              placeholder="Optional"
            />
          </label>
        </div>

        <div className="toolbar-grid compact">
          <label>
            Search task
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Department, vehicle, status..." />
          </label>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Type</th>
              <th>Vehicle</th>
              <th>Replacement proposal</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.fireDepartment}</td>
                <td>{formatTaskType(task.type)}</td>
                <td>{task.vehicle}</td>
                <td>
                  <input
                    value={task.suggestion ?? ''}
                    onChange={(event) => updateSuggestion(task.id, event.target.value)}
                    placeholder="Add replacement proposal"
                  />
                </td>
                <td>
                  <span className={`status-badge ${getTaskStatusBadgeClass(task.status)}`}>{formatTaskStatus(task.status)}</span>
                </td>
                <td>
                  <PermissionGate anyOf={['FIRE_CHIEF', 'SECRETARY', 'LWZ_EMPLOYEE']} fallback={<span className="muted">Read only</span>}>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="action-btn action-secondary"
                        onClick={() => setTaskStatus(task.id, 'DONE')}
                        disabled={task.status === 'DONE'}
                      >
                        <span className="action-icon" aria-hidden="true">✓</span>
                        Mark done
                      </button>
                      <button
                        type="button"
                        className="action-btn action-secondary"
                        onClick={() => setTaskStatus(task.id, 'OPEN')}
                        disabled={task.status === 'OPEN'}
                      >
                        <span className="action-icon" aria-hidden="true">↺</span>
                        Reopen
                      </button>
                      <button type="button" className="action-btn action-secondary" onClick={() => deleteTask(task.id)}>
                        <span className="action-icon" aria-hidden="true">🗑</span>
                        Delete
                      </button>
                    </div>
                  </PermissionGate>
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="muted">No vehicle tasks match your search.</td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <PermissionGate anyOf={['FIRE_CHIEF', 'SECRETARY', 'LWZ_EMPLOYEE']}>
          <div className="actions section-footer-actions top-gap">
            <button type="button" className="action-btn action-primary" onClick={addTask} disabled={!canCreateTask}>
              <span className="action-icon" aria-hidden="true">＋</span>
              Create vehicle task
            </button>
          </div>
        </PermissionGate>
      </PageSection>

    </div>
  )
}
