export type ImportExecutionMode = 'dry_run' | 'apply'

export type ApplyImportInput = {
  workbookPath: string
  sourceFilename: string
  monthLabel: string
  uploadedByUserProfileId?: string | null
}

export type ApplyImportSummary = {
  mode: 'apply'
  importBatchId: string | null
  processedCount: number
  createdCount: number
  updatedCount: number
  inactiveCount: number
  snapshotCount: number
  historyRowCount: number
  sensitiveDetailUpdateCount: number
  warningCount: number
  errorCount: number
  warnings: string[]
  errors: string[]
}

export async function applyImport(input: ApplyImportInput): Promise<ApplyImportSummary> {
  void input

  throw new Error('applyImport is not implemented yet')
}
