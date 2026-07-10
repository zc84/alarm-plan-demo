import type { PropsWithChildren } from 'react'

interface PageSectionProps {
  title: string
  subtitle?: string
}

export function PageSection({ title, subtitle, children }: PropsWithChildren<PageSectionProps>) {
  return (
    <section className="page-section">
      <header className="page-section-header">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      <div className="page-section-body">{children}</div>
    </section>
  )
}
