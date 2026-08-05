import XLSX from 'xlsx'

export type WorkbookSheets = {
  active: XLSX.WorkSheet
  leavers?: XLSX.WorkSheet
  promotions?: XLSX.WorkSheet
}

export type ExistingWorksheetRows = {
  active: Record<string, unknown>[]
  leavers: Record<string, unknown>[]
  promotions: Record<string, unknown>[]
}

export type MatchedSheetNames = {
  active: string
  leavers?: string
  promotions?: string
}

type LoadedWorkbook = {
  workbook: XLSX.WorkBook
  sheets: WorkbookSheets
  rows: ExistingWorksheetRows
  sheetNames: string[]
  matchedSheetNames: MatchedSheetNames
}

function findLeaversSheetName(sheetNames: string[]): string | undefined {
  return sheetNames.find((sheetName) => /leavers$/i.test(sheetName.trim()))
}

function findPromotionsSheetName(sheetNames: string[]): string | undefined {
  return sheetNames.find((sheetName) => sheetName.trim().toLowerCase() === 'out of unit promotions')
}

function parseSheetRows(sheet: XLSX.WorkSheet | undefined): Record<string, unknown>[] {
  if (!sheet) {
    return []
  }

  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: null,
  })
}

function loadParsedWorkbook(workbook: XLSX.WorkBook): LoadedWorkbook {
  const sheetNames = workbook.SheetNames

  const activeSheetName = sheetNames.find((sheetName) => {
    const normalizedSheetName = sheetName.trim().toLowerCase()

    return normalizedSheetName === 'employee data' || normalizedSheetName === 'ee data'
  })

  if (!activeSheetName) {
    throw new Error(
      `Missing required active employee sheet. Expected Employee Data or EE Data. Found: ${sheetNames.join(', ')}`,
    )
  }

  const leaversSheetName = findLeaversSheetName(sheetNames)
  const promotionsSheetName = findPromotionsSheetName(sheetNames)

  const activeSheet = workbook.Sheets[activeSheetName]

  if (!activeSheet) {
    throw new Error(`Unable to load required sheet: ${activeSheetName}`)
  }

  const leaversSheet = leaversSheetName ? workbook.Sheets[leaversSheetName] : undefined
  const promotionsSheet = promotionsSheetName ? workbook.Sheets[promotionsSheetName] : undefined

  return {
    workbook,
    sheets: {
      active: activeSheet,
      leavers: leaversSheet,
      promotions: promotionsSheet,
    },
    rows: {
      active: parseSheetRows(activeSheet),
      leavers: parseSheetRows(leaversSheet),
      promotions: parseSheetRows(promotionsSheet),
    },
    sheetNames,
    matchedSheetNames: {
      active: activeSheetName,
      leavers: leaversSheetName,
      promotions: promotionsSheetName,
    },
  }
}

export function loadWorkbook(filePath: string): LoadedWorkbook {
  return loadParsedWorkbook(XLSX.readFile(filePath))
}

export function loadWorkbookFromBuffer(buffer: Uint8Array): LoadedWorkbook {
  return loadParsedWorkbook(XLSX.read(buffer, { type: 'array' }))
}
