import { PageSection } from '../components/PageSection'

export function FireDepartmentInfoPage() {
  return (
    <div className="page-grid">
      <PageSection title="Fire department additional information" subtitle="Extended profile fields for planning and coordination">
        <table className="table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Special capability</th>
              <th>Fallback station</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>FF Ansfelden</td>
              <td>Hazmat first response</td>
              <td>FF Asten</td>
              <td>Night shift staffing reduced on weekdays.</td>
            </tr>
            <tr>
              <td>FF Marchtrenk</td>
              <td>Water rescue support</td>
              <td>OEWR Central</td>
              <td>Boat readiness check every Monday.</td>
            </tr>
          </tbody>
        </table>
      </PageSection>
    </div>
  )
}
