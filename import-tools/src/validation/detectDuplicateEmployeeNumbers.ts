type RowWithEmployeeNumber = {
  employeeNumber: string | null
}

export type DuplicateEmployeeNumberResult = {
  duplicateEmployeeNumbers: string[]
  duplicateCount: number
}

export type ImportDuplicateResult = {
  active: DuplicateEmployeeNumberResult
  leavers: DuplicateEmployeeNumberResult
  promotions: DuplicateEmployeeNumberResult
}

function detectSheetDuplicates<T extends RowWithEmployeeNumber>(
  rows: T[],
): DuplicateEmployeeNumberResult {
  const counts = new Map<string, number>()

  for (const row of rows) {
    if (!row.employeeNumber) {
      continue
    }

    counts.set(row.employeeNumber, (counts.get(row.employeeNumber) ?? 0) + 1)
  }

  const duplicateEmployeeNumbers = Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([employeeNumber]) => employeeNumber)
    .sort()

  return {
    duplicateEmployeeNumbers,
    duplicateCount: duplicateEmployeeNumbers.length,
  }
}

export function detectDuplicateEmployeeNumbers(rows: {
  active: RowWithEmployeeNumber[]
  leavers: RowWithEmployeeNumber[]
  promotions: RowWithEmployeeNumber[]
}): ImportDuplicateResult {
  return {
    active: detectSheetDuplicates(rows.active),
    leavers: detectSheetDuplicates(rows.leavers),
    promotions: detectSheetDuplicates(rows.promotions),
  }
}
