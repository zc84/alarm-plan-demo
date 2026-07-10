import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Layout } from './components/Layout'
import { AdditionalModulesPage } from './pages/AdditionalModules'
import { AlarmDevicesPage } from './pages/AlarmDevices'
import { AlarmPlanEditorPage } from './pages/AlarmPlanEditor'
import { AlarmPlansPage } from './pages/AlarmPlans'
import { ApprovalCenterPage } from './pages/ApprovalCenter'
import { AuditLogPage } from './pages/AuditLog'
import { DashboardPage } from './pages/Dashboard'
import { DocumentationPage } from './pages/Documentation'
import { DocumentsWorkspacePage } from './pages/DocumentsWorkspace'
import { DeploymentOrderPage } from './pages/DeploymentOrder'
import { ChecklistsPage } from './pages/Checklists'
import { FireDepartmentInfoPage } from './pages/FireDepartmentInfo'
import { HeavyLoadSwitchingPage } from './pages/HeavyLoadSwitching'
import { IntegrationPreviewPage } from './pages/IntegrationPreview'
import { LoginRoleSelectPage } from './pages/LoginRoleSelect'
import { OperationFeedbackPage } from './pages/OperationFeedback'
import { OperationalZonesPage } from './pages/OperationalZones'
import { PhoneListPage } from './pages/PhoneList'
import { PoiManagementPage } from './pages/PoiManagement'
import { PrintExportsPage } from './pages/PrintExports'
import { SecurityArchitecturePage } from './pages/SecurityArchitecture'
import { VehicleResourcesPage } from './pages/VehicleResources'
import { VehicleModificationsPage } from './pages/VehicleModifications'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginRoleSelectPage />} />
        <Route path="/alarm-plans" element={<AlarmPlansPage />} />
        <Route path="/alarm-plan-editor" element={<AlarmPlanEditorPage />} />
        <Route path="/approval-center" element={<ApprovalCenterPage />} />
        <Route path="/zones" element={<OperationalZonesPage />} />
        <Route path="/alarm-devices" element={<AlarmDevicesPage />} />
        <Route path="/deployment-order" element={<DeploymentOrderPage />} />
        <Route path="/vehicle-modifications" element={<VehicleModificationsPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/additional-modules" element={<AdditionalModulesPage />} />
        <Route path="/phone-list" element={<PhoneListPage />} />
        <Route path="/heavy-load-switching" element={<HeavyLoadSwitchingPage />} />
        <Route path="/checklists" element={<ChecklistsPage />} />
        <Route path="/poi-management" element={<PoiManagementPage />} />
        <Route path="/fire-department-info" element={<FireDepartmentInfoPage />} />
        <Route path="/operation-feedback" element={<OperationFeedbackPage />} />
        <Route path="/vehicle-resources" element={<VehicleResourcesPage />} />
        <Route path="/documents-workspace" element={<DocumentsWorkspacePage />} />
        <Route path="/integration-preview" element={<IntegrationPreviewPage />} />
        <Route path="/security-architecture" element={<SecurityArchitecturePage />} />
        <Route path="/print-exports" element={<PrintExportsPage />} />
        <Route path="/audit-log" element={<AuditLogPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
