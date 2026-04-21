import { createClient } from '@supabase/supabase-js'
import { loadWorkbook } from '../workbook/loadWorkbook.js'

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

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

function countProcessedRows(workbook: ReturnType<typeof loadWorkbook>): number {
  return (
    workbook.rows.active.length + workbook.rows.leavers.length + workbook.rows.promotions.length
  )
}

export async function applyImport(input: ApplyImportInput): Promise<ApplyImportSummary> {
  const workbook = loadWorkbook(input.workbookPath)
  const processedCount = countProcessedRows(workbook)

  const { data, error } = await supabase
    .from('import_batches')
    .insert({
      month_label: input.monthLabel,
      source_filename: input.sourceFilename,
      uploaded_by: input.uploadedByUserProfileId ?? null,
      status: 'processing',
      processed_count: processedCount,
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to create import batch: ${error.message}`)
  }

  const importBatchId = data?.id ?? null

  return {
    mode: 'apply',
    importBatchId,
    processedCount,
    createdCount: 0,
    updatedCount: 0,
    inactiveCount: 0,
    snapshotCount: 0,
    historyRowCount: 0,
    sensitiveDetailUpdateCount: 0,
    warningCount: 0,
    errorCount: 0,
    warnings: [],
    errors: [],
  }
}
