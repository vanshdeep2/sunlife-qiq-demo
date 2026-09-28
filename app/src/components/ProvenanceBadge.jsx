/**
 * Marks where a number or block comes from, so a presenter can tell real,
 * public data apart from the demo's modelled data at a glance.
 *   public   - real, sourced, checkable by the client (reviews, ratings, news)
 *   modelled - synthetic demo data generated from the story spec
 *   mixed    - real anchor + modelled figures (e.g. a storyline)
 */
import '../styles/provenance.css'

const LABELS = {
  public: { text: 'Public data', title: 'Real, public data. Every figure links to its source on the Voice of Customer page.' },
  modelled: { text: 'Modelled', title: 'Synthetic demo data, modelled to match the public evidence. Not the client’s operational data.' },
  mixed: { text: 'Public + modelled', title: 'Anchored in real public evidence; the contact-centre figures inside are modelled.' },
}

export default function ProvenanceBadge({ kind = 'modelled', className = '' }) {
  const l = LABELS[kind] ?? LABELS.modelled
  return (
    <span className={`prov-badge prov-${kind} ${className}`.trim()} title={l.title}>
      <span className="prov-dot" aria-hidden="true" />
      {l.text}
    </span>
  )
}
