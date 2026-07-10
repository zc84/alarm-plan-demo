import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { alarmPlans, approvals, initialAuditEvents, notifications, operationZones, roleDefinitions, users, vehicleTasks } from '../data/mockData'
import type { ActiveContext, ApprovalRequest, AuditEvent, NotificationItem, RoleDefinition, ScopeType } from '../types'

interface AppContextValue {
  users: typeof users
  roleDefinitions: RoleDefinition[]
  alarmPlans: typeof alarmPlans
  operationZones: typeof operationZones
  approvals: ApprovalRequest[]
  notifications: NotificationItem[]
  vehicleTasks: typeof vehicleTasks
  auditEvents: AuditEvent[]
  currentContext: ActiveContext
  setCurrentUserId: (id: string) => void
  setRole: (role: RoleDefinition['key']) => void
  setScope: (scopeType: ScopeType, scopeValue: string) => void
  approveRequest: (approvalId: string, comment?: string) => void
  rejectRequest: (approvalId: string, comment: string) => void
  autoApproveOverdue: () => void
  sendReminder: (approvalId: string) => void
  bypassRequest: (approvalId: string, comment?: string) => void
  cancelApproval: (approvalId: string, reason: string) => void
  restartImpactedApprovals: (planId: string) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const STORAGE_KEYS = {
  currentContext: 'alarm_demo_current_context',
  approvals: 'alarm_demo_approvals',
  auditEvents: 'alarm_demo_audit_events',
  notifications: 'alarm_demo_notifications',
} as const

function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function resolveScopeValue(role: RoleDefinition['key'], userId: string) {
  const currentUser = users.find((entry) => entry.id === userId) ?? users[0]
  const roleDefinition = roleDefinitions.find((entry) => entry.key === role)
  const scopeType = roleDefinition?.scopeType ?? 'ALL'

  const scopeValueByType: Record<ScopeType, string> = {
    ALL: 'Upper Austria',
    DISTRICT: currentUser.district ?? 'Linz-Land',
    MUNICIPALITY: currentUser.municipality ?? 'Ansfelden',
    FIRE_DEPARTMENT: currentUser.fireDepartment ?? 'FF Ansfelden',
  }

  return {
    scopeType,
    scopeValue: scopeValueByType[scopeType],
  }
}

export function AppProvider({ children }: PropsWithChildren) {
  const [currentContext, setCurrentContext] = useState<ActiveContext>(() =>
    readStoredValue(STORAGE_KEYS.currentContext, {
      userId: users[0].id,
      role: users[0].availableRoles[0],
      scopeType: 'ALL',
      scopeValue: 'Upper Austria',
    }),
  )

  const [approvalState, setApprovalState] = useState<ApprovalRequest[]>(() => readStoredValue(STORAGE_KEYS.approvals, approvals))
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => readStoredValue(STORAGE_KEYS.auditEvents, initialAuditEvents))
  const [notificationState, setNotificationState] = useState<NotificationItem[]>(() =>
    readStoredValue(STORAGE_KEYS.notifications, notifications),
  )

  const addAuditEvent = (event: Omit<AuditEvent, 'id' | 'timestamp'>) => {
    setAuditEvents((prev) => [
      {
        id: `AUD-${prev.length + 1}`,
        timestamp: new Date().toISOString(),
        ...event,
      },
      ...prev,
    ])
  }

  const addNotification = (entry: Omit<NotificationItem, 'id' | 'createdAt'>) => {
    setNotificationState((prev) => [
      {
        id: `N-${prev.length + 1}`,
        createdAt: new Date().toISOString(),
        ...entry,
      },
      ...prev,
    ])
  }

  const approveRequest = (approvalId: string, comment?: string) => {
    setApprovalState((prev) =>
      prev.map((item) =>
        item.id === approvalId
          ? {
              ...item,
              status: 'APPROVED',
              comment,
            }
          : item,
      ),
    )

    addAuditEvent({
      actor: currentContext.role,
      action: 'Approval granted',
      target: approvalId,
    })
  }

  const rejectRequest = (approvalId: string, comment: string) => {
    setApprovalState((prev) =>
      prev.map((item) =>
        item.id === approvalId
          ? {
              ...item,
              status: 'REJECTED',
              comment,
            }
          : item,
      ),
    )

    addAuditEvent({
      actor: currentContext.role,
      action: 'Approval rejected',
      target: approvalId,
    })

    addNotification({
      title: 'Approval rejected',
      body: `${approvalId} was rejected with comment: ${comment}`,
      severity: 'WARNING',
    })
  }

  const autoApproveOverdue = () => {
    const now = Date.now()
    const overdueItems = approvalState.filter((item) => item.status === 'PENDING' && new Date(item.dueDate).getTime() < now)

    if (overdueItems.length === 0) {
      return
    }

    setApprovalState((prev) =>
      prev.map((item) =>
        item.status === 'PENDING' && new Date(item.dueDate).getTime() < now
          ? {
              ...item,
              status: 'AUTO_APPROVED',
              comment: 'Auto-approved after missed deadline in demo workflow',
            }
          : item,
      ),
    )

    addAuditEvent({
      actor: 'SYSTEM',
      action: 'Auto-approved overdue approvals',
      target: `${overdueItems.length} request(s)`,
    })
  }

  const sendReminder = (approvalId: string) => {
    const item = approvalState.find((entry) => entry.id === approvalId)
    if (!item) return

    addNotification({
      title: 'Approval reminder sent',
      body: `Reminder sent for ${item.planId} (${item.stage})`,
      severity: 'INFO',
    })

    addAuditEvent({
      actor: currentContext.role,
      action: 'Reminder sent',
      target: approvalId,
    })
  }

  const bypassRequest = (approvalId: string, comment?: string) => {
    setApprovalState((prev) =>
      prev.map((item) =>
        item.id === approvalId
          ? {
              ...item,
              status: 'APPROVED',
              comment: comment || 'Bypassed by LWZ in demo flow',
            }
          : item,
      ),
    )

    addAuditEvent({
      actor: currentContext.role,
      action: 'Approval bypassed',
      target: approvalId,
    })
  }

  const cancelApproval = (approvalId: string, reason: string) => {
    setApprovalState((prev) =>
      prev.map((item) =>
        item.id === approvalId
          ? {
              ...item,
              status: 'REJECTED',
              comment: `Cancelled by initiator: ${reason}`,
            }
          : item,
      ),
    )

    addAuditEvent({
      actor: currentContext.role,
      action: 'Approval cancelled',
      target: approvalId,
    })
  }

  const restartImpactedApprovals = (planId: string) => {
    setApprovalState((prev) =>
      prev.map((item) =>
        item.planId === planId && ['PBKDT', 'AFK'].includes(item.stage)
          ? {
              ...item,
              status: 'PENDING',
              comment: 'Restarted due to impacted changes in plan draft',
            }
          : item,
      ),
    )

    addAuditEvent({
      actor: currentContext.role,
      action: 'Restarted impacted approvals',
      target: planId,
    })
  }

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.currentContext, JSON.stringify(currentContext))
  }, [currentContext])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.approvals, JSON.stringify(approvalState))
  }, [approvalState])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.auditEvents, JSON.stringify(auditEvents))
  }, [auditEvents])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notificationState))
  }, [notificationState])

  const value = useMemo<AppContextValue>(
    () => ({
      users,
      roleDefinitions,
      alarmPlans,
      operationZones,
      approvals: approvalState,
      notifications: notificationState,
      vehicleTasks,
      auditEvents,
      currentContext,
      setCurrentUserId: (id: string) => {
        const user = users.find((entry) => entry.id === id) ?? users[0]
        const defaultRole = user.availableRoles[0]
        const defaultScope = resolveScopeValue(defaultRole, user.id)

        setCurrentContext((prev) => ({
          ...prev,
          userId: user.id,
          role: defaultRole,
          scopeType: defaultScope.scopeType,
          scopeValue: defaultScope.scopeValue,
        }))
      },
      setRole: (role) =>
        setCurrentContext((prev) => {
          const nextScope = resolveScopeValue(role, prev.userId)

          return {
            ...prev,
            role,
            scopeType: nextScope.scopeType,
            scopeValue: nextScope.scopeValue,
          }
        }),
      setScope: (scopeType, scopeValue) => setCurrentContext((prev) => ({ ...prev, scopeType, scopeValue })),
      approveRequest,
      rejectRequest,
      autoApproveOverdue,
      sendReminder,
      bypassRequest,
      cancelApproval,
      restartImpactedApprovals,
    }),
    [approvalState, auditEvents, currentContext, notificationState],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }

  return context
}
