import DrawerShell from './DrawerShell'
import ProvenanceBadge from './ProvenanceBadge'
import { METHODOLOGY } from '../data/publicVoc'
import '../styles/provenance.css'

const KIND = { Real: 'public', Synthetic: 'modelled', Mixed: 'mixed' }

/** "How this demo was built": the same table as section 1 of the research doc (methodology.json). */
export default function MethodologyDrawer({ open, onClose }) {
  return (
    <DrawerShell
      open={open}
      onClose={onClose}
      title="How this demo was built"
      subtitle="Which data is real and public, which is modelled, and at what scale."
      panelClassName="method-drawer"
    >
      <p className="method-summary">{METHODOLOGY.summary}</p>
      <div className="method-table">
        <div className="method-row method-head">
          <span>Data layer</span>
          <span>Source</span>
          <span>Scale</span>
          <span>Type</span>
        </div>
        {METHODOLOGY.rows.map((r) => (
          <div className="method-row" key={`${r.layer}-${r.source}`}>
            <span className="method-layer">{r.layer}</span>
            <span>
              {r.url ? (
                <a href={r.url} target="_blank" rel="noreferrer">
                  {r.source}
                </a>
              ) : (
                r.source
              )}
            </span>
            <span>{r.scale}</span>
            <span>
              <ProvenanceBadge kind={KIND[r.provenance] ?? 'modelled'} />
            </span>
          </div>
        ))}
      </div>
      <p className="method-takeaway">
        <strong>When you present it: </strong>
        {METHODOLOGY.takeaway}
      </p>
    </DrawerShell>
  )
}
