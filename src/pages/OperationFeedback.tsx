import { useState } from 'react'
import { PageSection } from '../components/PageSection'

export function OperationFeedbackPage() {
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="page-grid">
      <PageSection title="Operation feedback" subtitle="Post-assignment feedback capture for continuous improvement">
        <label>
          Feedback comment
          <input
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="What should be improved in this assignment flow?"
          />
        </label>
        <div className="actions top-gap">
          <button
            type="button"
            onClick={() => {
              if (!feedback.trim()) return
              setSubmitted(true)
              setFeedback('')
            }}
          >
            Submit feedback
          </button>
        </div>
        {submitted ? <p className="muted top-gap">Feedback stored locally in demo session.</p> : null}
      </PageSection>
    </div>
  )
}
