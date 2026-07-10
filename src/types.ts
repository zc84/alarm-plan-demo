export type PlanCategory = 'PB' | 'AUTOB' | 'GW' | 'RAIL' | 'SOAP' | 'FKAT'

export type PlanStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED'

export type ScopeType = 'ALL' | 'DISTRICT' | 'MUNICIPALITY' | 'FIRE_DEPARTMENT'

export type RoleKey =
  | 'LWZ_EMPLOYEE'
  | 'EUS_EMPLOYEE'
  | 'STATE_COMMAND'
  | 'BFK'
  | 'AFK'
  | 'PBKDT'
  | 'FIRE_CHIEF'
  | 'SECRETARY'
  | 'FIREFIGHTER'
  | 'OEWR'

export interface RoleDefinition {
  key: RoleKey
  label: string
  scopeType: ScopeType
}

export interface DemoUser {
  id: string
  name: string
  availableRoles: RoleKey[]
  district?: string
  municipality?: string
  fireDepartment?: string
}

export interface ActiveContext {
  userId: string
  role: RoleKey
  scopeType: ScopeType
  scopeValue: string
}

export interface OperationZone {
  id: string
  zoneNumber: string
  name: string
  municipality: string
  district: string
  category: PlanCategory
  hasApprovedPlan: boolean
  changePending: boolean
}

export interface AlarmPlan {
  id: string
  title: string
  category: PlanCategory
  status: PlanStatus
  version: number
  ownerFireDepartment: string
  assignedFireDepartments: string[]
  zones: string[]
  keywords: string[]
  updatedAt: string
}

export interface ApprovalRequest {
  id: string
  planId: string
  stage: 'PBKDT' | 'AFK' | 'BFK' | 'LWZ'
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'AUTO_APPROVED'
  assigneeRole: RoleKey
  dueDate: string
  comment?: string
}

export interface VehicleTask {
  id: string
  fireDepartment: string
  type: 'NEW_VEHICLE' | 'REMOVED_VEHICLE' | 'REPLACEMENT_REQUIRED'
  vehicle: string
  suggestion?: string
  status: 'OPEN' | 'DONE'
}

export interface NotificationItem {
  id: string
  title: string
  body: string
  createdAt: string
  severity: 'INFO' | 'WARNING' | 'SUCCESS'
}

export interface AuditEvent {
  id: string
  actor: string
  action: string
  target: string
  timestamp: string
}
