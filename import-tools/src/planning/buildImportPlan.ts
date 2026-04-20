import type { ValidMappedRows } from '../validation/filterValidMappedRows.js'
import type { ActiveImportRow, LeaverImportRow, PromotionImportRow } from '../mapping/mapImportRow.js'

export type ImportPlan = {
  activeCandidates: ActiveImportRow[]
  leaverCandidates: LeaverImportRow[]
  promotionCandidates: PromotionImportRow[]
  summary: {
    activeCandidateCount: number
    leaverCandidateCount: number
    promotionCandidateCount: number
    totalCandidateCount: number
  }
}

export function buildImportPlan(rows: ValidMappedRows): ImportPlan {
  const activeCandidates = rows.active
  const leaverCandidates = rows.leavers
  const promotionCandidates = rows.promotions

  return {
    activeCandidates,
    leaverCandidates,
    promotionCandidates,
    summary: {
      activeCandidateCount: activeCandidates.length,
      leaverCandidateCount: leaverCandidates.length,
      promotionCandidateCount: promotionCandidates.length,
      totalCandidateCount:
        activeCandidates.length + leaverCandidates.length + promotionCandidates.length,
    },
  }
}
