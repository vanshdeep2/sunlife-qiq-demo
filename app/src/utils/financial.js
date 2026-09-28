/**
 * REMOVED — kept as an empty placeholder only because this folder is a synced
 * Windows mount that refuses file deletion from the build sandbox.
 *
 * This module used to export a DoorDash/Rover-lineage cost model
 * (`computeFinancials`, `handleCostPerContact`, `weeklyWaste`, `repeatCost`,
 * `escalationUpliftCost`). It imported `PAYMENT_CONTACTS` and
 * `MERCHANT_CHURN_PROXY` from `data/executiveConstants.js` — two exports that
 * no client pack after Rover produces. Nothing in `src/` imported this module,
 * so the build tree-shook it away and neither lint nor build ever failed, but
 * it was a live landmine for whoever wired it up next.
 *
 * See `clients/kyndryl/audit_report.md`, finding F4. Safe to delete this file
 * from Windows Explorer.
 *
 * If a cost model is wanted again, write it against the current data contract
 * rather than restoring this one — the two constants it depended on are not
 * semantically interchangeable with any current client's exports.
 */
export {}
