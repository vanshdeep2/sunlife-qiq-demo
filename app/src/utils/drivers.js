export function driverSignal(row) {
  if (row.name === 'Account Standing' || row.esc >= 15) {
    return { label: 'Primary driver', cls: 'signal-red' }
  }
  if (row.name === 'Verification' || row.name.includes('Payout')) {
    return { label: 'Process dependency', cls: 'signal-amber' }
  }
  if (row.fcr >= 75 && row.esc < 9) return { label: 'Stable volume', cls: 'signal-amber' }
  if (row.volume >= 900) return { label: 'High volume', cls: 'signal-amber' }
  return { label: 'Watch', cls: 'signal-amber' }
}

export function fcrClass(pct) {
  if (pct >= 90) return 'fcr-good'
  if (pct >= 80) return 'fcr-warn'
  return 'fcr-bad'
}
