import { useMemo, useState } from 'react'
import { PermissionGate } from '../components/PermissionGate'
import { PageSection } from '../components/PageSection'
import { useAppContext } from '../context/AppContext'
import { formatStatus } from '../utils/formatStatus'
import type { ApprovalRequest } from '../types'

const approvalStatuses: ApprovalRequest['status'][] = ['PENDING', 'APPROVED', 'REJECTED', 'AUTO_APPROVED']

export function ApprovalCenterPage() {
  const {
    approvals,
    approveRequest,
    rejectRequest,
    setApprovalStatus,
    currentContext,
    autoApproveOverdue,
  } = useAppContext()
  const [comments, setComments] = useState<Record<string, string>>({})
  const [statusDrafts, setStatusDrafts] = useState<Record<string, string>>({})
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({})

  const toggleComment = (id: string) => setOpenComments((prev) => ({ ...prev, [id]: !prev[id] }))

  const applyStatus = (item: ApprovalRequest) => {
    const target = (statusDrafts[item.id] ?? item.status) as ApprovalRequest['status']
    const comment = comments[item.id]

    if (target === 'APPROVED') {
      approveRequest(item.id, comment)
    } else if (target === 'REJECTED') {
      rejectRequest(item.id, comment || 'Rejected without additional details')
    } else {
      setApprovalStatus(item.id, target, comment)
    }
  }

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
        <ul className="stats-grid stats-grid-kpi">
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
      </PageSection>

      <PageSection title="Approval center" subtitle="Review requests, capture comments, and keep deadlines under control">
        <table className="table">
          <thead>
            <tr>
              <th className="cell-id">Plan</th>
              <th>Stage</th>
              <th>Assignee role</th>
              <th>Status</th>
              <th>Due date</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((item) => (
              <tr key={item.id}>
                <td className="cell-id">{item.planId}</td>
                <td>{item.stage}</td>
                <td>{item.assigneeRole}</td>
                <td>
                  <span className={`status-badge status-${item.status.toLowerCase()}`}>{formatStatus(item.status)}</span>
                </td>
                <td>{new Date(item.dueDate).toLocaleDateString('en-GB')}</td>
                <td>
                  <span className={`status-badge ${formatCountdown(item.dueDate) === 'Overdue' ? 'status-rejected' : 'status-draft'}`}>
                    {formatCountdown(item.dueDate)}
                  </span>
                </td>
                <td>
                  {(() => {
                    const hasComment = Boolean(comments[item.id]?.trim())
                    const isEditing = Boolean(openComments[item.id])

                    return (
                      <div className="approval-actions">
                        <div className="decision-group">
                          <select
                            className="decision-select"
                            aria-label="Set approval status"
                            value={statusDrafts[item.id] ?? item.status}
                            onChange={(event) => setStatusDrafts((prev) => ({ ...prev, [item.id]: event.target.value }))}
                          >
                            {approvalStatuses.map((status) => (
                              <option key={status} value={status}>
                                {formatStatus(status)}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="decision-apply"
                            onClick={() => applyStatus(item)}
                            aria-label="Apply status change"
                            title="Apply status change"
                          >
                            ✓
                          </button>
                        </div>

                        <button
                          type="button"
                          className={`comment-toggle${hasComment ? ' has-comment' : ''}`}
                          aria-expanded={isEditing}
                          onClick={() => toggleComment(item.id)}
                        >
                          <span aria-hidden="true">💬</span>
                          {isEditing ? 'Hide comment' : hasComment ? 'Edit comment' : 'Add comment'}
                        </button>

                        {isEditing ? (
                          <textarea
                            className="comment-field"
                            rows={2}
                            value={comments[item.id] ?? ''}
                            onChange={(event) =>
                              setComments((prev) => ({
                                ...prev,
                                [item.id]: event.target.value,
                              }))
                            }
                            placeholder="Add a review comment (optional)"
                          />
                        ) : hasComment ? (
                          <p className="comment-preview" title={comments[item.id]}>
                            {comments[item.id]}
                          </p>
                        ) : null}
                      </div>
                    )
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PermissionGate anyOf={['LWZ_EMPLOYEE']}>
          <div className="actions section-footer-actions top-gap">
            <button type="button" className="action-btn action-primary" onClick={autoApproveOverdue}>
              <span className="action-icon" aria-hidden="true">✓</span>
              Run auto-approval
            </button>
          </div>
        </PermissionGate>
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

    </div>
  )
}
