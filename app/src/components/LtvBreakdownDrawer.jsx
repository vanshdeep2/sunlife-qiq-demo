import DonutWithCentre from './DonutWithCentre'
import InsightModal from './InsightModal'
import {
  AT_RISK_LINES,
  AT_RISK_RISK_SUBTITLE,
  AT_RISK_SIDE_LEGEND,
  AT_RISK_TITLE,
  COACHING_VALUE_LINES,
} from '../data/ltvCopy'
import { fmtMoney, fmtMoneyK } from '../utils/format'
import { IS_TWO_SIDED } from '../config/brand'
import { LTV_LABELS } from '../utils/ltvLabels'

/** A one-sided client has a single at-risk colour family, so the marketplace
 * side key is not rendered at all. */
const SHOW_SIDE_LEGEND = IS_TWO_SIDED && AT_RISK_SIDE_LEGEND.length > 1

const AT_RISK_DONUT_COLORS = AT_RISK_LINES.map((line) => line.dotColor)
const COACHING_DONUT_COLORS = COACHING_VALUE_LINES.map((line) => line.dotColor)
const PERIOD_LABEL = '5 weeks · Estimate'

function BreakdownBucket({ line, value, valueClass, display }) {
  return (
    <div className="drawer-bucket ltv-breakdown-bucket">
      <div className={`drawer-bucket-val ${valueClass}`}>{display ?? fmtMoney(value)}</div>
      <div className="drawer-bucket-lbl">{line.title}</div>
      <div className="drawer-bucket-formula">{line.label}</div>
      <div className="drawer-bucket-formula ltv-breakdown-desc">{line.description}</div>
    </div>
  )
}

function SideColourKey() {
  return (
    <div className="fin-side-key fin-side-key--drawer" aria-label="Marketplace side colour key">
      {AT_RISK_SIDE_LEGEND.map((item) => (
        <div key={item.label} className="fin-side-key-item">
          <span className="leg-dot" style={{ background: item.color }} />
          <span className="fin-side-key-label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function LtvBreakdownDrawer({ panel, ltv, onClose }) {
  if (!panel) {
    return (
      <InsightModal open={false} onClose={onClose} title="">
        {null}
      </InsightModal>
    )
  }

  if (panel === 'coaching') {
    return (
      <InsightModal
        open
        onClose={onClose}
        title={LTV_LABELS.coachingDrawerTitle}
        subtitle={LTV_LABELS.coachingDrawerSubtitle}
      >
        <div className="drawer-section">
          <div className="drawer-section-lbl">
            This period · Total{' '}
            <span style={{ color: 'var(--green)' }}>{fmtMoney(ltv.periodProtected)}</span>
          </div>

          <div className="ltv-breakdown-grid">
            <div className="ltv-breakdown-donut-cell">
              <DonutWithCentre
                data={COACHING_VALUE_LINES.map((line) => ltv[line.key])}
                colors={COACHING_DONUT_COLORS}
                total={ltv.periodProtected}
                valueClass="val-green"
                label={PERIOD_LABEL}
                size={148}
                cutout="75%"
                animate
                variant="drawer"
              />
            </div>

            {COACHING_VALUE_LINES.map((line) => (
              <BreakdownBucket
                key={line.key}
                line={line}
                value={ltv[line.key]}
                valueClass="val-green"
              />
            ))}
          </div>

          <div className="alert-box alert-green">
            Annualised value protected: {fmtMoneyK(ltv.valueProtected)} · Estimate
          </div>
        </div>
      </InsightModal>
    )
  }

  // At-risk panel. Two-sided: demand + supply combined. One-sided: demand
  // only — there is no supply bucket in AT_RISK_LINES to render.
  // (Also accepts the legacy 'supply' panel id.)
  const riskPanel = panel === 'risk' || panel === 'supply'
  if (!riskPanel) return null

  return (
    <InsightModal
      open
      onClose={onClose}
      title={AT_RISK_TITLE}
      subtitle={AT_RISK_RISK_SUBTITLE}
    >
      <div className="drawer-section">
        <div className="drawer-section-lbl">
          This period · Total{' '}
          <span style={{ color: 'var(--red)' }}>{fmtMoney(ltv.periodExposure)}</span>
        </div>

        {SHOW_SIDE_LEGEND && <SideColourKey />}

        <div className="ltv-breakdown-grid">
          <div className="ltv-breakdown-donut-cell">
            <DonutWithCentre
              data={AT_RISK_LINES.map((line) => ltv[line.key])}
              colors={AT_RISK_DONUT_COLORS}
              total={ltv.periodExposure}
              valueClass="val-red"
              label={PERIOD_LABEL}
              size={148}
              cutout="75%"
              animate
              variant="drawer"
            />
          </div>

          {AT_RISK_LINES.map((line) => (
            <BreakdownBucket
              key={line.key}
              line={line}
              value={ltv[line.key]}
              valueClass={line.valueClass}
            />
          ))}
        </div>

        <div className="alert-box alert-red">
          {LTV_LABELS.riskDrawerAnnualisedLabel}: {fmtMoneyK(ltv.totalExposure)}
          {IS_TWO_SIDED && (
            <>
              {' '}
              · Supply-side NBA addressable (annualised) {fmtMoneyK(ltv.supplyAddressable)}
            </>
          )}
        </div>
      </div>
    </InsightModal>
  )
}
