import type {
  AlarmPlan,
  ApprovalRequest,
  AuditEvent,
  DemoUser,
  NotificationItem,
  OperationZone,
  RoleDefinition,
  VehicleTask,
} from '../types'

export const roleDefinitions: RoleDefinition[] = [
  { key: 'LWZ_EMPLOYEE', label: 'LWZ Staff Member', scopeType: 'ALL' },
  { key: 'EUS_EMPLOYEE', label: 'EuS / LKS', scopeType: 'ALL' },
  { key: 'STATE_COMMAND', label: 'State Fire Command', scopeType: 'ALL' },
  { key: 'BFK', label: 'BFK', scopeType: 'DISTRICT' },
  { key: 'AFK', label: 'AFK', scopeType: 'DISTRICT' },
  { key: 'PBKDT', label: 'PBKDT', scopeType: 'MUNICIPALITY' },
  { key: 'FIRE_CHIEF', label: 'Fire Chief', scopeType: 'FIRE_DEPARTMENT' },
  { key: 'SECRETARY', label: 'Department Secretary', scopeType: 'FIRE_DEPARTMENT' },
  { key: 'FIREFIGHTER', label: 'Firefighter', scopeType: 'FIRE_DEPARTMENT' },
  { key: 'OEWR', label: 'Austrian Water Rescue', scopeType: 'DISTRICT' },
]

export const users: DemoUser[] = [
  {
    id: 'u-1',
    name: 'Anna Leitner',
    availableRoles: ['LWZ_EMPLOYEE', 'AFK'],
    district: 'Linz-Land',
    municipality: 'Ansfelden',
    fireDepartment: 'FF Ansfelden',
  },
  {
    id: 'u-2',
    name: 'Markus Hofer',
    availableRoles: ['FIRE_CHIEF', 'FIREFIGHTER'],
    district: 'Linz-Land',
    municipality: 'Asten',
    fireDepartment: 'FF Asten',
  },
  {
    id: 'u-3',
    name: 'Sabine Moser',
    availableRoles: ['PBKDT', 'SECRETARY'],
    district: 'Wels-Land',
    municipality: 'Marchtrenk',
    fireDepartment: 'FF Marchtrenk',
  },
]

export const alarmPlans: AlarmPlan[] = [
  {
    id: 'AP-2026-001',
    title: 'Mandatory Area Linz South',
    category: 'PB',
    status: 'APPROVED',
    version: 4,
    ownerFireDepartment: 'FF Ansfelden',
    assignedFireDepartments: ['FF Ansfelden', 'FF Asten'],
    zones: ['OZ-101', 'OZ-104'],
    keywords: ['Residential fire', 'Traffic accident'],
    updatedAt: '2026-07-02T10:30:00Z',
  },
  {
    id: 'AP-2026-014',
    title: 'Waterway Plan Traun',
    category: 'GW',
    status: 'IN_REVIEW',
    version: 2,
    ownerFireDepartment: 'FF Marchtrenk',
    assignedFireDepartments: ['FF Marchtrenk', 'Austrian Water Rescue Central Section'],
    zones: ['OZ-220'],
    keywords: ['Person in water', 'Oil spill'],
    updatedAt: '2026-07-07T08:10:00Z',
  },
  {
    id: 'AP-2026-021',
    title: 'Autobahn A1 Abschnitt 145-152',
    category: 'AUTOB',
    status: 'DRAFT',
    version: 1,
    ownerFireDepartment: 'FF Asten',
    assignedFireDepartments: ['FF Asten', 'FF St. Florian'],
    zones: ['OZ-330'],
    keywords: ['Truck fire', 'Mass casualty incident'],
    updatedAt: '2026-07-09T07:05:00Z',
  },
]

export const operationZones: OperationZone[] = [
  {
    id: 'OZ-101',
    zoneNumber: '101',
    name: 'Ansfelden Zentrum',
    municipality: 'Ansfelden',
    district: 'Linz-Land',
    category: 'PB',
    hasApprovedPlan: true,
    changePending: false,
  },
  {
    id: 'OZ-104',
    zoneNumber: '104',
    name: 'Asten Industriegebiet',
    municipality: 'Asten',
    district: 'Linz-Land',
    category: 'PB',
    hasApprovedPlan: false,
    changePending: true,
  },
  {
    id: 'OZ-220',
    zoneNumber: '220',
    name: 'Traun Flusskilometer 34-40',
    municipality: 'Marchtrenk',
    district: 'Wels-Land',
    category: 'GW',
    hasApprovedPlan: true,
    changePending: true,
  },
]

export const approvals: ApprovalRequest[] = [
  {
    id: 'AR-1',
    planId: 'AP-2026-014',
    stage: 'AFK',
    status: 'PENDING',
    assigneeRole: 'AFK',
    dueDate: '2026-07-20T12:00:00Z',
  },
  {
    id: 'AR-2',
    planId: 'AP-2026-014',
    stage: 'BFK',
    status: 'PENDING',
    assigneeRole: 'BFK',
    dueDate: '2026-07-23T12:00:00Z',
  },
]

export const vehicleTasks: VehicleTask[] = [
  {
    id: 'VT-1',
    fireDepartment: 'FF Asten',
    type: 'REMOVED_VEHICLE',
    vehicle: 'TLF-A 4000-2',
    suggestion: 'HLF3 Asten-1',
    status: 'OPEN',
  },
  {
    id: 'VT-2',
    fireDepartment: 'FF Marchtrenk',
    type: 'NEW_VEHICLE',
    vehicle: 'Drohne Lagebild-1',
    status: 'OPEN',
  },
]

export const notifications: NotificationItem[] = [
  {
    id: 'N-1',
    title: 'Approval reminder',
    body: 'Alarm plan AP-2026-014 reaches its deadline in 3 days.',
    createdAt: '2026-07-09T09:00:00Z',
    severity: 'WARNING',
  },
  {
    id: 'N-2',
    title: 'Zone update submitted',
    body: 'Operational zone OZ-220 has been submitted for review.',
    createdAt: '2026-07-08T16:40:00Z',
    severity: 'INFO',
  },
]

export const initialAuditEvents: AuditEvent[] = [
  {
    id: 'AUD-1',
    actor: 'Anna Leitner (LWZ)',
    action: 'Approval process started',
    target: 'AP-2026-014',
    timestamp: '2026-07-07T08:15:00Z',
  },
  {
    id: 'AUD-2',
    actor: 'Markus Hofer (FF Asten)',
    action: 'Vehicle replacement confirmed',
    target: 'VT-1',
    timestamp: '2026-07-08T11:22:00Z',
  },
]
