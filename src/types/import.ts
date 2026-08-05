export type ImportSheetCounts = {
  active: number
  leavers: number
  promotions: number
}

export type ImportDuplicateEmployeeNumberResult = {
  duplicateEmployeeNumbers: string[]
  duplicateCount: number
}

export type ImportDuplicateResult = {
  active: ImportDuplicateEmployeeNumberResult
  leavers: ImportDuplicateEmployeeNumberResult
  promotions: ImportDuplicateEmployeeNumberResult
}

export type ImportOverlapSummary = {
  activeAndLeaversCount: number
  activeAndPromotionsCount: number
  leaversAndPromotionsCount: number
  totalOverlapCount: number
}

export type ImportDryRunResponse = {
  workbookFile: {
    name: string
    size: number
  }
  report: {
    workbook: {
      allSheetNames: string[]
      matchedSheetNames: {
        active: string
        leavers?: string
        promotions?: string
      }
    }
    counts: {
      raw: ImportSheetCounts
      mapped: ImportSheetCounts
      valid: ImportSheetCounts
      deduped: ImportSheetCounts
      existingMembers: number
      existingMemberLookupEntries: number
    }
    validation: {
      active: {
        invalidRowCount: number
      }
      leavers: {
        invalidRowCount: number
      }
      promotions: {
        invalidRowCount: number
      }
    }
    duplicates: ImportDuplicateResult
    overlaps: ImportOverlapSummary
    importPlan: Record<string, unknown>
    memberActionPlan: {
      createCount: number
      updateCount: number
      inactivateCount: number
    }
    coreMemberFieldUpdatePlan: {
      updateCount: number
    }
    sensitiveDetailPlan: {
      updateCount: number
    }
    historyActionPlan: {
      rowCount: number
    }
    sampleActions: Record<string, unknown>
  }
}
