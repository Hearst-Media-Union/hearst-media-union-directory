import type { ActiveImportRow, LeaverImportRow, PromotionImportRow } from '../mapping/mapImportRow.js'

type RowWithEmployeeNumber = {
  employeeNumber: string | null
}

export type SheetValidationResult = {
  totalRows: number
  validRows: number
  missingEmployeeNumberCount: number
}

export type ImportValidationResult = {
  active: SheetValidationResult
  leavers: SheetValidationResult
  promotions: SheetValidationResult
}

function validateSheetRows<T extends RowWithEmployeeNumber>(rows: T[]): SheetValidationResult {
  const missingEmployeeNumberCount = rows.filter((row) => !row.employeeNumber).length

  return {
    totalRows: rows.length,
    validRows: rows.length - missingEmployeeNumberCount,
    missingEmployeeNumberCount,
  }
}

export function validateMappedRows(rows: {
  active: ActiveImportRow[]
  leavers: LeaverImportRow[]
  promotions: PromotionImportRow[]
}): ImportValidationResult {
  return {
    active: validateSheetRows(rows.active),
    leavers: validateSheetRows(rows.leavers),
    promotions: validateSheetRows(rows.promotions),
  }
}
