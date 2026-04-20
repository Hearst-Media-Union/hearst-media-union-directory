import type { ActiveImportRow, LeaverImportRow, PromotionImportRow } from '../mapping/mapImportRow.js'

export type ValidMappedRows = {
  active: ActiveImportRow[]
  leavers: LeaverImportRow[]
  promotions: PromotionImportRow[]
}

function hasEmployeeNumber(row: ActiveImportRow | LeaverImportRow | PromotionImportRow): boolean {
  return Boolean(row.employeeNumber)
}

export function filterValidMappedRows(rows: {
  active: ActiveImportRow[]
  leavers: LeaverImportRow[]
  promotions: PromotionImportRow[]
}): ValidMappedRows {
  return {
    active: rows.active.filter(hasEmployeeNumber),
    leavers: rows.leavers.filter(hasEmployeeNumber),
    promotions: rows.promotions.filter(hasEmployeeNumber),
  }
}
