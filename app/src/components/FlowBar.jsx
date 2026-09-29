import { Link } from 'react-router-dom'
import { PAGES, FLOW_ORDER } from '../config/pages'
import '../styles/components.css'

const STEPS = FLOW_ORDER.map((id) => ({ id, path: PAGES[id].path, label: PAGES[id].flowLabel }))

export default function FlowBar({ activePage }) {
  return (
    <div className="flow-bar">
      {STEPS.map((step, index) => (
        <span key={step.id} style={{ display: 'contents' }}>
          {index > 0 && <span className="flow-arrow">→</span>}
          {activePage === step.id ? (
            <span className="flow-step active">{step.label}</span>
          ) : (
            <Link className="flow-step" to={step.path}>
              {step.label}
            </Link>
          )}
        </span>
      ))}
    </div>
  )
}
