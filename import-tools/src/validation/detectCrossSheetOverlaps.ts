import type { DedupedMappedRows } from './dedupeMappedRows.js'

type RowWithEmployeeNumber = {
  employeeNumber: string | null
}

export type CrossSheetOverlapResult = {
  activeAndLeavers: string[]
  activeAndPromotions: string[]
  leaversAndPromotions: string[]
  summary: {
    activeAndLeaversCount: number
    activeAndPromotionsCount: number
    leaversAndPromotionsCount: number
    totalOverlapCount: number
  }
}

function getEmployeeNumberSet<T extends RowWithEmployeeNumber>(rows: T[]): Set<string> {
  return new Set(
    rows
      .map((row) => row.employeeNumber)
      .filter((employeeNumber): employeeNumber is string => Boolean(employeeNumber)),
  )
}

function getSortedIntersection(left: Set<string>, right: Set<string>): string[] {
  return Array.from(left)
    .filter((value) => right.has(value))
    .sort()
}

export function detectCrossSheetOverlaps(rows: DedupedMappedRows): CrossSheetOverlapResult {
  const activeEmployeeNumbers = getEmployeeNumberSet(rows.active)
  const leaverEmployeeNumbers = getEmployeeNumberSet(rows.leavers)
  const promotionEmployeeNumbers = getEmployeeNumberSet(rows.promotions)

  const activeAndLeavers = getSortedIntersection(activeEmployeeNumbers, leaverEmployeeNumbers)
  const activeAndPromotions = getSortedIntersection(activeEmployeeNumbers, promotionEmployeeNumbers)
  const leaversAndPromotions = getSortedIntersection(
    leaverEmployeeNumbers,
    promotionEmployeeNumbers,
  )

  return {
    activeAndLeavers,
    activeAndPromotions,
    leaversAndPromotions,
    summary: {
      activeAndLeaversCount: activeAndLeavers.length,
      activeAndPromotionsCount: activeAndPromotions.length,
      leaversAndPromotionsCount: leaversAndPromotions.length,
      totalOverlapCount:
        activeAndLeavers.length + activeAndPromotions.length + leaversAndPromotions.length,
    },
  }
}
