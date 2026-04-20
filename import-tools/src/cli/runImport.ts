import { getExistingMembers } from '../adapters/getExistingMembers.js'
import { buildDryRunReport } from '../engine/buildDryRunReport.js'
import { mapActiveRow, mapLeaverRow, mapPromotionRow } from '../mapping/mapImportRow.js'
import { normalizeRow } from '../normalize/normalizeRow.js'
import { getSheetHeaders } from '../workbook/getSheetHeaders.js'
import { loadWorkbook } from '../workbook/loadWorkbook.js'

const DEBUG = false

const filePath = process.argv[2]

if (!filePath) {
  console.error('Usage: npm run dev <path-to-xlsx>')
  process.exit(1)
}

function logSampleRow(label: string, rows: Record<string, unknown>[]): void {
  console.log(`${label}:`)

  if (rows.length === 0) {
    console.log('not present or no data')
    return
  }

  console.dir(rows[0], { depth: null })
}

function logHeaders(label: string, headers: string[]): void {
  console.log(`${label}:`)

  if (headers.length === 0) {
    console.log('not present or no headers')
    return
  }

  console.log(headers)
}

function logNormalizedSampleRow(label: string, rows: Record<string, unknown>[]): void {
  console.log(`${label}:`)

  if (rows.length === 0) {
    console.log('not present or no data')
    return
  }

  console.dir(normalizeRow(rows[0]), { depth: null })
}

function logMappedActiveSampleRow(rows: Record<string, unknown>[]): void {
  console.log('active:')

  if (rows.length === 0) {
    console.log('not present or no data')
    return
  }

  console.dir(mapActiveRow(rows[0]), { depth: null })
}

function logMappedLeaverSampleRow(rows: Record<string, unknown>[]): void {
  console.log('leavers:')

  if (rows.length === 0) {
    console.log('not present or no data')
    return
  }

  console.dir(mapLeaverRow(rows[0]), { depth: null })
}

function logMappedPromotionSampleRow(rows: Record<string, unknown>[]): void {
  console.log('promotions:')

  if (rows.length === 0) {
    console.log('not present or no data')
    return
  }

  console.dir(mapPromotionRow(rows[0]), { depth: null })
}

function logSampleMemberUpdates(
  items: {
    employeeNumber: string
    existingMember: {
      memberId: string
      employeeNumber: string
      isActive: boolean
    }
    row: {
      assignmentName: string | null
      unitTitle: string | null
      brand: string | null
    }
  }[],
  limit = 3,
): void {
  console.log('member updates:')

  if (items.length === 0) {
    console.log('none')
    return
  }

  console.table(
    items.slice(0, limit).map((item) => ({
      employeeNumber: item.employeeNumber,
      existingMemberId: item.existingMember.memberId,
      existingIsActive: item.existingMember.isActive,
      assignmentName: item.row.assignmentName,
      unitTitle: item.row.unitTitle,
      brand: item.row.brand,
    })),
  )
}

function logSampleMemberInactivations(
  items: {
    employeeNumber: string
    reason: 'leaver' | 'promotion'
    row: {
      inactiveAt: string | null
    }
  }[],
  limit = 3,
): void {
  console.log('member inactivations:')

  if (items.length === 0) {
    console.log('none')
    return
  }

  console.table(
    items.slice(0, limit).map((item) => ({
      employeeNumber: item.employeeNumber,
      reason: item.reason,
      inactiveAt: item.row.inactiveAt,
    })),
  )
}

function logSampleCoreMemberFieldUpdates(
  items: {
    employeeNumber: string
    updates: {
      field: string
      previousValue: string | null
      newValue: string | null
    }[]
  }[],
  limit = 3,
): void {
  console.log('core member field updates:')

  if (items.length === 0) {
    console.log('none')
    return
  }

  console.table(
    items.slice(0, limit).map((item) => ({
      employeeNumber: item.employeeNumber,
      updateCount: item.updates.length,
      fields: item.updates.map((update) => update.field).join(', '),
    })),
  )
}

function logSampleSensitiveDetailUpdates(
  items: {
    employeeNumber: string
    updates: { field: string; newValue: string | number | null }[]
  }[],
  limit = 3,
): void {
  console.log('sensitive detail updates:')

  if (items.length === 0) {
    console.log('none')
    return
  }

  console.table(
    items.slice(0, limit).map((item) => ({
      employeeNumber: item.employeeNumber,
      updateCount: item.updates.length,
      fields: item.updates.map((update) => update.field).join(', '),
    })),
  )
}

function logSampleHistoryRows(
  items: {
    employeeNumber: string
    actionType: string
    reason: string
  }[],
  limit = 3,
): void {
  console.log('history rows:')

  if (items.length === 0) {
    console.log('none')
    return
  }

  console.table(items.slice(0, limit))
}

try {
  const workbook = loadWorkbook(filePath)
  const existingMembers = getExistingMembers(workbook.rows)
  const dryRunReport = buildDryRunReport(filePath, existingMembers)

  console.log('Dry run report:')
  console.dir(
    {
      workbook: dryRunReport.workbook,
      counts: dryRunReport.counts,
      validation: dryRunReport.validation,
      duplicates: dryRunReport.duplicates,
      overlaps: dryRunReport.overlaps,
      importPlan: dryRunReport.importPlan,
      memberActionPlan: dryRunReport.memberActionPlan,
      coreMemberFieldUpdatePlan: dryRunReport.coreMemberFieldUpdatePlan,
      sensitiveDetailPlan: dryRunReport.sensitiveDetailPlan,
      historyActionPlan: dryRunReport.historyActionPlan,
    },
    { depth: null },
  )
  console.log('')
  console.log('Sample planned actions:')
  logSampleMemberUpdates(dryRunReport.sampleActions.memberUpdates)
  console.log('')
  logSampleMemberInactivations(dryRunReport.sampleActions.memberInactivations)
  console.log('')
  logSampleCoreMemberFieldUpdates(dryRunReport.sampleActions.coreMemberFieldUpdates)
  console.log('')
  logSampleSensitiveDetailUpdates(dryRunReport.sampleActions.sensitiveDetailUpdates)
  console.log('')
  logSampleHistoryRows(dryRunReport.sampleActions.historyRows)

  if (DEBUG) {
    console.log('')
    console.log('Headers:')
    logHeaders('active', getSheetHeaders(dryRunReport.debug.sheets.active))
    console.log('')
    logHeaders('leavers', getSheetHeaders(dryRunReport.debug.sheets.leavers))
    console.log('')
    logHeaders('promotions', getSheetHeaders(dryRunReport.debug.sheets.promotions))
    console.log('')
    console.log('Raw sample rows:')
    logSampleRow('active', dryRunReport.debug.rows.active)
    console.log('')
    logSampleRow('leavers', dryRunReport.debug.rows.leavers)
    console.log('')
    logSampleRow('promotions', dryRunReport.debug.rows.promotions)
    console.log('')
    console.log('Normalized sample rows:')
    logNormalizedSampleRow('active', dryRunReport.debug.rows.active)
    console.log('')
    logNormalizedSampleRow('leavers', dryRunReport.debug.rows.leavers)
    console.log('')
    logNormalizedSampleRow('promotions', dryRunReport.debug.rows.promotions)
    console.log('')
    console.log('Mapped sample rows:')
    logMappedActiveSampleRow(dryRunReport.debug.rows.active)
    console.log('')
    logMappedLeaverSampleRow(dryRunReport.debug.rows.leavers)
    console.log('')
    logMappedPromotionSampleRow(dryRunReport.debug.rows.promotions)
  }
} catch (error) {
  console.error('Import failed:')

  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error(error)
  }

  process.exit(1)
}