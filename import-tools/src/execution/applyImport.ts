import { createClient } from '@supabase/supabase-js'
import { loadWorkbook } from '../workbook/loadWorkbook.js'
import { mapActiveRow } from '../mapping/mapImportRow.js'
import { getExistingMembers } from '../adapters/getExistingMembers.js'
import { mapLeaverRow, mapPromotionRow } from '../mapping/mapImportRow.js'

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

  // map active, leaver, and promotion rows
  const activeRows = workbook.rows.active.map(mapActiveRow)
  const leaverRows = workbook.rows.leavers.map(mapLeaverRow)
  const promotionRows = workbook.rows.promotions.map(mapPromotionRow)

  console.log('Apply debug:')
  console.log({
    activeRowCount: activeRows.length,
    leaverRowCount: leaverRows.length,
    promotionRowCount: promotionRows.length,
    sampleActiveEmployeeNumbers: activeRows.slice(0, 5).map((row) => row.employeeNumber),
    sampleLeaverEmployeeNumbers: leaverRows.slice(0, 5).map((row) => row.employeeNumber),
    samplePromotionEmployeeNumbers: promotionRows.slice(0, 5).map((row) => row.employeeNumber),
  })

  // fetch existing members
  const existingMembers = await getExistingMembers(workbook.rows)
  const existingByEmployeeNumber = new Map(existingMembers.map((m) => [m.employeeNumber, m]))

  // determine new members to create
  const membersToCreate = activeRows.filter(
    (row) => row.employeeNumber && !existingByEmployeeNumber.has(row.employeeNumber),
  )

  // determine existing members to update
  const membersToUpdate = activeRows.filter(
    (row) => row.employeeNumber && existingByEmployeeNumber.has(row.employeeNumber),
  )

  // create import batch
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

  // create members
  if (membersToCreate.length > 0) {
    const { data: createdMembers, error: insertMembersError } = await supabase
      .from('members')
      .insert(
        membersToCreate.map((row) => ({
          employee_number: row.employeeNumber,
          member_source: 'hearst_import',
          is_active: true,
          inactive_reason: null,
          inactive_at: null,
          legal_first_name: row.legalFirstName,
          legal_last_name: row.legalLastName,
          preferred_name: row.preferredName,
          work_email: row.workEmail,
          primary_phone: row.primaryPhone,
          location: row.location,
          assignment_name: row.assignmentName,
          unit_title: row.unitTitle,
          brand: row.brand,
          unit_tier: row.unitTier,
          last_seen_import_batch_id: importBatchId,
        })),
      )
      .select(
        `
          id,
          employee_number,
          is_active,
          legal_first_name,
          legal_last_name,
          preferred_name,
          work_email,
          primary_phone,
          location,
          assignment_name,
          unit_title,
          brand,
          unit_tier
        `,
      )

    if (insertMembersError) {
      throw new Error(`Failed to create members: ${insertMembersError.message}`)
    }

    for (const member of createdMembers ?? []) {
      if (!member.employee_number) {
        continue
      }

      existingByEmployeeNumber.set(member.employee_number, {
        memberId: member.id,
        employeeNumber: member.employee_number,
        isActive: member.is_active,
        legalFirstName: member.legal_first_name,
        legalLastName: member.legal_last_name,
        preferredName: member.preferred_name,
        workEmail: member.work_email,
        primaryPhone: member.primary_phone,
        location: member.location,
        assignmentName: member.assignment_name,
        unitTitle: member.unit_title,
        brand: member.brand,
        unitTier: member.unit_tier,
      })
    }
  }

  // update existing members from active sheet
  for (const row of membersToUpdate) {
    if (!row.employeeNumber) {
      continue
    }

    const existingMember = existingByEmployeeNumber.get(row.employeeNumber)

    if (!existingMember) {
      continue
    }

    const { error: updateMemberError } = await supabase
      .from('members')
      .update({
        is_active: true,
        inactive_reason: null,
        inactive_at: null,
        legal_first_name: row.legalFirstName,
        legal_last_name: row.legalLastName,
        preferred_name: row.preferredName,
        work_email: row.workEmail,
        primary_phone: row.primaryPhone,
        location: row.location,
        assignment_name: row.assignmentName,
        unit_title: row.unitTitle,
        brand: row.brand,
        unit_tier: row.unitTier,
        last_seen_import_batch_id: importBatchId,
      })
      .eq('id', existingMember.memberId)

    if (updateMemberError) {
      throw new Error(
        `Failed to update member ${existingMember.memberId}: ${updateMemberError.message}`,
      )
    }
  }

  let inactiveCount = 0

  console.log('Apply debug match check:')
  console.log({
    sampleExistingKeys: Array.from(existingByEmployeeNumber.keys()).slice(0, 10),
    matchingLeavers: leaverRows
      .filter((row) => row.employeeNumber && existingByEmployeeNumber.has(row.employeeNumber))
      .slice(0, 5)
      .map((row) => row.employeeNumber),
    matchingPromotions: promotionRows
      .filter((row) => row.employeeNumber && existingByEmployeeNumber.has(row.employeeNumber))
      .slice(0, 5)
      .map((row) => row.employeeNumber),
  })

  // process leavers
  for (const row of leaverRows) {
    if (!row.employeeNumber) {
      continue
    }

    const existingMember = existingByEmployeeNumber.get(row.employeeNumber)

    if (!existingMember) {
      continue
    }

    const { error } = await supabase
      .from('members')
      .update({
        is_active: false,
        inactive_reason: row.sourceActionName
          ? row.sourceActionName.trim().toLowerCase().replace(/\s+/g, '_')
          : 'left_company',
        inactive_at: row.inactiveAt,
        last_seen_import_batch_id: importBatchId,
      })
      .eq('id', existingMember.memberId)

    if (error) {
      throw new Error(`Failed to inactivate member ${existingMember.memberId}: ${error.message}`)
    }

    inactiveCount++
  }

  // process promotions
  for (const row of promotionRows) {
    if (!row.employeeNumber) {
      continue
    }

    const existingMember = existingByEmployeeNumber.get(row.employeeNumber)

    if (!existingMember) {
      continue
    }

    const { error } = await supabase
      .from('members')
      .update({
        is_active: false,
        inactive_reason: 'promoted_out_of_union',
        inactive_at: row.inactiveAt,
        last_seen_import_batch_id: importBatchId,
      })
      .eq('id', existingMember.memberId)

    if (error) {
      throw new Error(`Failed to inactivate member ${existingMember.memberId}: ${error.message}`)
    }

    inactiveCount++
  }
  return {
    mode: 'apply',
    importBatchId,
    processedCount,
    createdCount: membersToCreate.length,
    updatedCount: membersToUpdate.length,
    inactiveCount,
    snapshotCount: 0,
    historyRowCount: 0,
    sensitiveDetailUpdateCount: 0,
    warningCount: 0,
    errorCount: 0,
    warnings: [],
    errors: [],
  }
}
