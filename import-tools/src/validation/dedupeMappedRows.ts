import type { ValidMappedRows } from './filterValidMappedRows.js'
import type { ActiveImportRow, LeaverImportRow, PromotionImportRow } from '../mapping/mapImportRow.js'

type RowWithEmployeeNumber = {
  employeeNumber: string | null
}

export type DedupedMappedRows = {
  active: ActiveImportRow[]
  leavers: LeaverImportRow[]
  promotions: PromotionImportRow[]
}

function dedupeSheetRows<T extends RowWithEmployeeNumber>(rows: T[]): T[] {
  const lastSeenRows = new Map<string, T>()

  for (const row of rows) {
    if (!row.employeeNumber) {
      continue
    }

    lastSeenRows.set(row.employeeNumber, row)
  }

  return Array.from(lastSeenRows.values())
}

export function dedupeMappedRows(rows: ValidMappedRows): DedupedMappedRows {
  return {
    active: dedupeSheetRows(rows.active),
    leavers: dedupeSheetRows(rows.leavers),
    promotions: dedupeSheetRows(rows.promotions),
  }
}
