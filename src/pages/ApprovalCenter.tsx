import { useMemo, useState } from 'react'
import { PermissionGate } from '../components/PermissionGate'
import { PageSection } from '../components/PageSection'
import { useAppContext } from '../context/AppContext'

export function ApprovalCenterPage() {
  const {
    approvals,
    approveRequest,
    rejectRequest,
    currentContext,
    sendReminder,
    bypassRequest,
    cancelApproval,
    restartImpactedApprovals,
    autoApproveOverdue,
  } = useAppContext()
  const [comments, setComments] = useState<Record<string, string>>({})

  const pendingForCurrentRole = useMemo(
    () => approvals.filter((item) => item.status === 'PENDING' && item.assigneeRole === currentContext.role),
    [approvals, currentContext.role],
  )

  const completedApprovals = approvals.filter((item) => item.status !== 'PENDING')

  const formatCountdown = (dueDate: string) => {
    const distance = new Date(dueDate).getTime() - Date.now()
    const days = Math.ceil(distance / (1000 * 60 * 60 * 24))

    if (days < 0) return 'Overdue'
    if (days === 0) return 'Due today'
    return `${days} day${days > 1 ? 's' : ''}`
  }

  return (
    <div className="page-grid">
      <PageSection title="Approval workload" subtitle="Role-specific queue and workflow health indicators">
        <ul className="stats-grid">
          <li>
            <span>Assigned to active role</span>
            <strong>{pendingForCurrentRole.length}</strong>
          </li>
          <li>
            <span>Total pending approvals</span>
            <strong>{approvals.filter((item) => item.status === 'PENDING').length}</strong>
          </li>
          <li>
            <span>Completed decisions</span>
            <strong>{completedApprovals.length}</strong>
          </li>
        </ul>
        <PermissionGate anyOf={['LWZ_EMPLOYEE']}>
          <div className="top-gap">
            <button type="button" onClick={autoApproveOverdue}>
              Run auto-approval for overdue requests
            </button>
          </div>
        </PermissionGate>
      </PageSection>

      <PageSection title="Approval center" subtitle="Review requests, capture comments, and keep deadlines under control">
        <table className="table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Stage</th>
              <th>Assignee role</th>
              <th>Status</th>
              <th>Due date</th>
              <th>Deadline</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((item) => (
              <tr key={item.id}>
                <td>{item.planId}</td>
                <td>{item.stage}</td>
                <td>{item.assigneeRole}</td>
                <td>
                  <span className={`status-badge status-${item.status.toLowerCase()}`}>{item.status}</span>
                </td>
                <td>{new Date(item.dueDate).toLocaleDateString('en-GB')}</td>
                <td>
                  <span className={`status-badge ${formatCountdown(item.dueDate) === 'Overdue' ? 'status-rejected' : 'status-draft'}`}>
                    {formatCountdown(item.dueDate)}
                  </span>
                </td>
                <td>
                  <input
                    value={comments[item.id] ?? ''}
                    onChange={(event) =>
                      setComments((prev) => ({
                        ...prev,
                        [item.id]: event.target.value,
                      }))
                    }
                    placeholder="Add review comment"
                  />
                </td>
                <td>
                  <div className="actions">
                    <button
                      type="button"
                      disabled={item.status !== 'PENDING'}
                      onClick={() => approveRequest(item.id, comments[item.id])}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={item.status !== 'PENDING'}
                      onClick={() => rejectRequest(item.id, comments[item.id] || 'Rejected without additional details')}
                    >
                      Reject
                    </button>
                    <button type="button" disabled={item.status !== 'PENDING'} onClick={() => sendReminder(item.id)}>
                      Send reminder
                    </button>
                    <PermissionGate anyOf={['LWZ_EMPLOYEE']}>
                      <button
                        type="button"
                        disabled={item.status !== 'PENDING' || currentContext.role !== 'LWZ_EMPLOYEE'}
                        onClick={() => bypassRequest(item.id, comments[item.id])}
                      >
                        LWZ bypass
                      </button>
                    </PermissionGate>
                    <PermissionGate anyOf={['FIRE_CHIEF', 'SECRETARY']}>
                      <button type="button" disabled={item.status !== 'PENDING'} onClick={() => cancelApproval(item.id, comments[item.id] || 'Initiator cancelled')}>
                        Cancel
                      </button>
                    </PermissionGate>
                    <PermissionGate anyOf={['FIRE_CHIEF', 'LWZ_EMPLOYEE']}>
                      <button type="button" onClick={() => restartImpactedApprovals(item.planId)}>
                        Restart impacted
                      </button>
                    </PermissionGate>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageSection>

      <PageSection title="Workflow timeline" subtitle="Standard escalation chain for the release process">
        <ol className="step-list">
          <li>Draft created by authorized fire department role.</li>
          <li>Initiator starts release process after validation checks pass.</li>
          <li>Assigned departments / PBKDT confirm assignments.</li>
          <li>AFK review and forwarding.</li>
          <li>BFK review and forwarding.</li>
          <li>LWZ final confirmation and ELS transfer handoff simulation.</li>
        </ol>
      </PageSection>

      <PageSection title="Decision guidance" subtitle="Recommended approval discipline for operational quality">
        <ul className="item-list">
          <li>Record meaningful comments for both approvals and rejections to keep traceability high.</li>
          <li>Escalate overdue requests early to avoid blocked publishing and outdated procedures.</li>
          <li>Use stage ownership consistently so district and state responsibilities remain clear.</li>
        </ul>
      </PageSection>
    </div>
  )
}
