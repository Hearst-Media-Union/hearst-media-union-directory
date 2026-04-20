import { buildExistingMemberLookup } from '../adapters/buildExistingMemberLookup.js'
import { mapImportRows } from '../mapping/mapImportRows.js'
import { buildImportPlan } from '../planning/buildImportPlan.js'
import { planCoreMemberFieldUpdates } from '../planning/planCoreMemberFieldUpdates.js'
import { planHistoryActions } from '../planning/planHistoryActions.js'
import { planMemberActions } from '../planning/planMemberActions.js'
import { planSensitiveDetailActions } from '../planning/planSensitiveDetailActions.js'
import { dedupeMappedRows } from '../validation/dedupeMappedRows.js'
import { detectCrossSheetOverlaps } from '../validation/detectCrossSheetOverlaps.js'
import { detectDuplicateEmployeeNumbers } from '../validation/detectDuplicateEmployeeNumbers.js'
import { filterValidMappedRows } from '../validation/filterValidMappedRows.js'
import { validateMappedRows } from '../validation/validateMappedRows.js'
import { loadWorkbook } from '../workbook/loadWorkbook.js'
import type { ExistingMemberRecord } from '../adapters/buildExistingMemberLookup.js'
import type { ExistingWorksheetRows, MatchedSheetNames, WorkbookSheets } from '../workbook/loadWorkbook.js'
import type { MappedImportRows } from '../mapping/mapImportRows.js'
import type { DedupedMappedRows } from '../validation/dedupeMappedRows.js'
import type { MemberUpdateAction, MemberInactivateAction } from '../planning/planMemberActions.js'
import type { CoreMemberFieldUpdateAction } from '../planning/planCoreMemberFieldUpdates.js'
import type { SensitiveDetailUpdateAction } from '../planning/planSensitiveDetailActions.js'
import type { HistoryAction } from '../planning/planHistoryActions.js'

export type DryRunReport = {
  workbook: {
    allSheetNames: string[]
    matchedSheetNames: MatchedSheetNames
  }
  counts: {
    raw: {
      active: number
      leavers: number
      promotions: number
    }
    mapped: {
      active: number
      leavers: number
      promotions: number
    }
    valid: {
      active: number
      leavers: number
      promotions: number
    }
    deduped: {
      active: number
      leavers: number
      promotions: number
    }
    existingMembers: number
    existingMemberLookupEntries: number
  }
  validation: ReturnType<typeof validateMappedRows>
  duplicates: ReturnType<typeof detectDuplicateEmployeeNumbers>
  overlaps: ReturnType<typeof detectCrossSheetOverlaps>['summary']
  importPlan: ReturnType<typeof buildImportPlan>['summary']
  memberActionPlan: ReturnType<typeof planMemberActions>['summary']
  coreMemberFieldUpdatePlan: ReturnType<typeof planCoreMemberFieldUpdates>['summary']
  sensitiveDetailPlan: ReturnType<typeof planSensitiveDetailActions>['summary']
  historyActionPlan: ReturnType<typeof planHistoryActions>['summary']
  sampleActions: {
    memberUpdates: MemberUpdateAction[]
    memberInactivations: MemberInactivateAction[]
    coreMemberFieldUpdates: CoreMemberFieldUpdateAction[]
    sensitiveDetailUpdates: SensitiveDetailUpdateAction[]
    historyRows: HistoryAction[]
  }
  debug: {
    sheets: WorkbookSheets
    rows: ExistingWorksheetRows
    mappedRows: MappedImportRows
    dedupedRows: DedupedMappedRows
  }
}

export function buildDryRunReport(
  filePath: string,
  existingMembers: ExistingMemberRecord[],
): DryRunReport {
  const { sheetNames, matchedSheetNames, rows, sheets } = loadWorkbook(filePath)

  const mappedRows = mapImportRows(rows)
  const validation = validateMappedRows(mappedRows)
  const validRows = filterValidMappedRows(mappedRows)
  const duplicates = detectDuplicateEmployeeNumbers(validRows)
  const dedupedRows = dedupeMappedRows(validRows)
  const overlaps = detectCrossSheetOverlaps(dedupedRows)

  const existingMemberLookup = buildExistingMemberLookup(existingMembers)

  const importPlan = buildImportPlan(dedupedRows)
  const memberActionPlan = planMemberActions(importPlan, existingMemberLookup)
  const coreMemberFieldUpdatePlan = planCoreMemberFieldUpdates(memberActionPlan)
  const sensitiveDetailPlan = planSensitiveDetailActions(memberActionPlan)
  const historyActionPlan = planHistoryActions(
    memberActionPlan,
    coreMemberFieldUpdatePlan,
    sensitiveDetailPlan,
  )

  return {
    workbook: {
      allSheetNames: sheetNames,
      matchedSheetNames,
    },
    counts: {
      raw: {
        active: rows.active.length,
        leavers: rows.leavers.length,
        promotions: rows.promotions.length,
      },
      mapped: {
        active: mappedRows.active.length,
        leavers: mappedRows.leavers.length,
        promotions: mappedRows.promotions.length,
      },
      valid: {
        active: validRows.active.length,
        leavers: validRows.leavers.length,
        promotions: validRows.promotions.length,
      },
      deduped: {
        active: dedupedRows.active.length,
        leavers: dedupedRows.leavers.length,
        promotions: dedupedRows.promotions.length,
      },
      existingMembers: existingMembers.length,
      existingMemberLookupEntries: existingMemberLookup.size,
    },
    validation,
    duplicates,
    overlaps: overlaps.summary,
    importPlan: importPlan.summary,
    memberActionPlan: memberActionPlan.summary,
    coreMemberFieldUpdatePlan: coreMemberFieldUpdatePlan.summary,
    sensitiveDetailPlan: sensitiveDetailPlan.summary,
    historyActionPlan: historyActionPlan.summary,
    sampleActions: {
      memberUpdates: memberActionPlan.toUpdate,
      memberInactivations: memberActionPlan.toInactivate,
      coreMemberFieldUpdates: coreMemberFieldUpdatePlan.toUpdate,
      sensitiveDetailUpdates: sensitiveDetailPlan.toUpdate,
      historyRows: historyActionPlan.rows,
    },
    debug: {
      sheets,
      rows,
      mappedRows,
      dedupedRows,
    },
  }
}