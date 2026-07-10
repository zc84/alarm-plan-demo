import { useState } from 'react'
import { PageSection } from '../components/PageSection'

export function DocumentsWorkspacePage() {
  const [files, setFiles] = useState<string[]>([])

  return (
    <div className="page-grid">
      <PageSection title="Document workspace" subtitle="Local document upload simulation for operational support files">
        <label className="file-upload-button">
          Upload documents
          <input
            type="file"
            multiple
            onChange={(event) => {
              const uploaded = event.target.files ? Array.from(event.target.files).map((file) => file.name) : []
              setFiles((prev) => [...uploaded, ...prev])
            }}
          />
        </label>

        {files.length > 0 ? (
          <ul className="item-list top-gap">
            {files.map((file, index) => (
              <li key={`${file}-${index}`}>{file}</li>
            ))}
          </ul>
        ) : (
          <p className="muted top-gap">No documents uploaded yet.</p>
        )}
      </PageSection>
    </div>
  )
}
