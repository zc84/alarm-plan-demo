import { PageSection } from '../components/PageSection'

const phoneEntries = [
  { function: 'LWZ Duty Officer', contact: '+43 732 7000 100', availability: '24/7' },
  { function: 'District BFK Linz-Land', contact: '+43 732 7000 220', availability: 'Daytime + on-call' },
  { function: 'Water Rescue Control', contact: '+43 732 7000 330', availability: '24/7' },
]

export function PhoneListPage() {
  return (
    <div className="page-grid">
      <PageSection title="Phone list" subtitle="Operational contact directory for dispatch and coordination">
        <table className="table">
          <thead>
            <tr>
              <th>Function</th>
              <th>Phone</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {phoneEntries.map((entry) => (
              <tr key={entry.function}>
                <td>{entry.function}</td>
                <td>{entry.contact}</td>
                <td>{entry.availability}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageSection>
    </div>
  )
}
