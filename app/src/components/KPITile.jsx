import '../styles/operations.css'
import '../styles/ccm.css'

const colourMap = {
  green: { val: 'val-green', chg: 'chg-green' },
  amber: { val: 'val-amber', chg: 'chg-amber' },
  red: { val: 'val-red', chg: 'chg-red' },
  muted: { val: '', chg: '' },
}

export default function KPITile({
  label,
  value,
  target,
  variance,
  varianceDirection,
  colour = 'muted',
  tooltip,
  onClick,
  drillLabel = 'Details →',
  changeText,
  note,
  children,
}) {
  const classes = colourMap[colour] || colourMap.muted
  const Wrapper = onClick ? 'button' : 'div'
  const wrapperProps = onClick ? { type: 'button', onClick } : {}
  const changeLine = changeText || variance

  return (
    <Wrapper className={`chart-card${onClick ? '' : ' no-click'}`} {...wrapperProps}>
      <div className="chart-top">
        <div className="chart-top-main">
          <div className="chart-title">
            <span>{label}</span>
            {tooltip && (
              <span
                className="kpi-info-btn"
                style={{ display: 'inline-flex', marginLeft: 6, verticalAlign: 'middle' }}
              >
                i
                <span className="kpi-tooltip">{tooltip}</span>
              </span>
            )}
          </div>
          <div className={`chart-current ${classes.val}`}>{value}</div>
          {target && <div className="chart-meta">{target}</div>}
          {changeLine && (
            <div className={`chart-var ${classes.chg}`}>
              {varianceDirection && (
                <span>{varianceDirection === 'up' ? '↑' : '↓'} </span>
              )}
              {changeLine}
            </div>
          )}
        </div>
        {onClick && <span className="chart-drill">{drillLabel}</span>}
      </div>
      {children && <div className="chart-area">{children}</div>}
      {note && <div className="chart-note">{note}</div>}
    </Wrapper>
  )
}
