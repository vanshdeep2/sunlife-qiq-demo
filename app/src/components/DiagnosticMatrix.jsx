import {
  CSAT_COLUMN_META,
  ROW_LABELS,
} from '../data/qualityConstants'

export default function DiagnosticMatrix({
  matrix,
  behaviourBand,
  onBehaviourChange,
  onCellClick,
}) {
  const behaviourOk = behaviourBand === 'good'

  return (
    <div className="qa-card">
      <h2 className="qa-card-title">CSAT × Outcome Diagnostic Matrix</h2>

      <div className="qa-behaviour-toggles" role="group" aria-label="Agent behaviour band">
        <button
          type="button"
          className={`qa-behaviour-pill${behaviourBand === 'good' ? ' active' : ''}`}
          onClick={() => onBehaviourChange('good')}
        >
          Good Agent Behaviour (4-5)
        </button>
        <button
          type="button"
          className={`qa-behaviour-pill${behaviourBand === 'poor' ? ' active' : ''}`}
          onClick={() => onBehaviourChange('poor')}
        >
          Poor Agent Behaviour (1-3)
        </button>
      </div>
      <p className="qa-behaviour-caption">
        {behaviourBand === 'good'
          ? 'Calls where agent behaviour scored 4-5.'
          : 'Calls where agent behaviour scored 1-3.'}
      </p>

      <div className="qa-matrix-wrap">
        <table className="qa-matrix-table">
          <thead>
            <tr>
              <th className="qa-row-head" scope="col">
                Outcome
              </th>
              {CSAT_COLUMN_META.map((col) => (
                <th key={col.key} className={col.className} scope="col">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROW_LABELS.map((rowMeta, rowIdx) => (
              <tr key={rowIdx}>
                <td className="qa-row-label">
                  {rowMeta.lines.map((line) => (
                    <div key={line.text} className="qa-row-line">
                      <span className={line.ok ? 'qa-mark-ok' : 'qa-mark-bad'}>
                        {line.ok ? '✓' : '✗'}
                      </span>
                      <span>{line.text}</span>
                    </div>
                  ))}
                  <div className="qa-row-line">
                    <span className={behaviourOk ? 'qa-mark-ok' : 'qa-mark-bad'}>
                      {behaviourOk ? '✓' : '✗'}
                    </span>
                    <span>
                      {behaviourOk ? 'Good Agent Behaviour' : 'Poor Agent Behaviour'}
                    </span>
                  </div>
                </td>
                {CSAT_COLUMN_META.map((col, colIdx) => {
                  const cell = matrix.cells[rowIdx][colIdx]
                  const empty = cell.count === 0
                  const hot =
                    behaviourBand === 'poor' && col.key === 'negative' && !empty
                  return (
                    <td
                      key={col.key}
                      className={`qa-matrix-cell ${col.className}${hot ? ' qa-col-hot' : ''}`}
                    >
                      <button
                        type="button"
                        className={`qa-cell-btn${hot ? ' qa-cell-hot' : ''}`}
                        disabled={empty}
                        onClick={() => onCellClick(cell)}
                        aria-label={`${cell.pct.toFixed(2)} percent, ${col.label}, row ${rowIdx + 1}`}
                      >
                        <span className="qa-cell-pct">{cell.pct.toFixed(2)}%</span>
                        {!empty && cell.meanQa != null && (
                          <span className="qa-cell-qs">QS {cell.meanQa.toFixed(1)}</span>
                        )}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
