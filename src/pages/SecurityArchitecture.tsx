import { PageSection } from '../components/PageSection'

export function SecurityArchitecturePage() {
  return (
    <div className="page-grid">
      <PageSection title="Security & architecture concept (demo)" subtitle="Clear boundaries between prototype behavior and production expectations">
        <ul className="item-list">
          <li>Production target: Keycloak (OIDC), JWT verification, and server-side authorization.</li>
          <li>Demo scope: client-side role and scope simulation only, no real authentication.</li>
          <li>Architecture principles: OWASP Top 10 coverage, security-by-design, and auditable workflows.</li>
          <li>Integration isolation: controlled access through a dedicated interface server boundary.</li>
          <li>Delivery expectations: SBOM, GDPR alignment, and test evidence as handover requirements.</li>
        </ul>
      </PageSection>

    </div>
  )
}
