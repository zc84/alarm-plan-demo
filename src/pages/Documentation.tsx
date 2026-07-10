import { PageSection } from '../components/PageSection'

export function DocumentationPage() {
  return (
    <div className="page-grid">
      <PageSection title="Documentation" subtitle="Feature-based UI guide for this client-side demo">
        <ul className="item-list">
          <li>
            <strong>Roles & users are required by spec</strong>
            <p>
              Yes — this is a core RFP requirement. The app must support role-based visibility and actions, multi-role users, and
              active context selection after login. In this demo, this is implemented in Login &amp; Role and reflected by permission
              gates throughout feature screens.
            </p>
          </li>
          <li>
            <strong>Purpose of this demo</strong>
            <p>
              This client-side React demo visualizes alarm-plan workflows, approvals, operational zones, and related modules from
              the RFP without backend services.
            </p>
          </li>
          <li>
            <strong>Authentication model</strong>
            <p>Login/roles/scopes are simulated in the browser. No real Keycloak/OIDC integration is performed in this prototype.</p>
          </li>
          <li>
            <strong>Data model</strong>
            <p>All records are loaded from local TypeScript mock data and runtime state in the app context.</p>
          </li>
          <li>
            <strong>Workflow behavior</strong>
            <p>
              Approval actions, validations, coverage warnings, and status transitions are simulated locally to demonstrate UI/UX and
              process logic.
            </p>
          </li>
          <li>
            <strong>Persistence behavior</strong>
            <p>
              Selected user context, approvals, notifications, and audit events are persisted in browser localStorage to keep demo
              progress between refreshes.
            </p>
          </li>
          <li>
            <strong>Production differences</strong>
            <p>
              A real rollout would add backend authorization, persistence, audit hardening, integration endpoints, and secure API
              communication.
            </p>
          </li>
        </ul>
      </PageSection>

      <PageSection title="Feature-by-feature UI behavior" subtitle="What each screen does from a user perspective">
        <ul className="item-list">
          <li>
            <strong>Dashboard</strong>
            <p>
              Shows KPI cards for approvals, drafts, missing zone coverage, and vehicle tasks. Notification feed shows latest workflow
              messages.
            </p>
          </li>
          <li>
            <strong>Login &amp; Role</strong>
            <p>
              User chooses demo user, active role, and scope. This directly changes visible permissions and action availability across
              the app.
            </p>
          </li>
          <li>
            <strong>Alarm Plans</strong>
            <p>
              Filter by category/status, search by ID/title/owner, view status badges and dependency counts. Authorized roles can use
              “Duplicate to draft”.
            </p>
          </li>
          <li>
            <strong>Alarm Plan Editor</strong>
            <p>
              Wizard-style authoring flow with selectable zones, departments, keyword input, validation cards, and draft-vs-previous
              comparison table. Submit button is role-gated and blocked if validation fails.
            </p>
          </li>
          <li>
            <strong>Approval Center</strong>
            <p>
              Pending approvals can be approved/rejected with comments. Includes reminder, LWZ bypass, initiator cancel, restart
              impacted approvals, and overdue auto-approval simulation.
            </p>
          </li>
          <li>
            <strong>Operational Zones</strong>
            <p>
              Zone filter/search plus geoviewer-style status pills. Authorized roles can upload zone files (.jpg/.png/.pdf/.geojson)
              and see uploaded file metadata in-session.
            </p>
          </li>
          <li>
            <strong>Alarm Devices</strong>
            <p>
              Matrix-style view for category/group/time-reference mapping with coverage warnings (demo data driven).
            </p>
          </li>
          <li>
            <strong>Deployment Order</strong>
            <p>
              Internal order supports move up/down interactions for authorized roles; external order is read-only generated preview.
            </p>
          </li>
          <li>
            <strong>Vehicle Modifications</strong>
            <p>
              Displays change tasks (new/removed/replacement required vehicles) and replacement suggestions.
            </p>
          </li>
          <li>
            <strong>Additional Modules</strong>
            <p>
              Hub page linking to dedicated screens: Phone List, Heavy-Load Switch, Checklists, POI Management, Fire Department Info,
              Operation Feedback, Vehicle Resources, and Documents Workspace.
            </p>
          </li>
          <li>
            <strong>Print &amp; Exports</strong>
            <p>
              Supports browser print, downloadable JSON export (plans/zones/approvals), and CSV export (plan registry).
            </p>
          </li>
          <li>
            <strong>Audit Log</strong>
            <p>
              Shows timeline of state-changing actions with actor/action/target/timestamp, including approval workflow events.
            </p>
          </li>
          <li>
            <strong>Integration Preview + Security &amp; Architecture</strong>
            <p>
              Explain staging and transfer behavior, interface boundaries, and production security model differences vs this demo.
            </p>
          </li>
        </ul>
      </PageSection>

      <PageSection title="How to navigate" subtitle="Suggested walkthrough for reviewers">
        <ol className="step-list">
          <li>Go to Login &amp; Role and switch user/role/scope context.</li>
          <li>Review Alarm Plans and open the Alarm Plan Editor wizard.</li>
          <li>Use Approval Center to approve/reject and observe state changes.</li>
          <li>Inspect Operational Zones, Integration Preview, and Audit Log.</li>
          <li>Use Print &amp; Exports for simulated export/print actions.</li>
        </ol>
      </PageSection>
    </div>
  )
}
