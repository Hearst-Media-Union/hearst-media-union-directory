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

function buildActiveSnapshots(
  importBatchId: string,
  rows: ReturnType<typeof mapActiveRow>[],
  rawRows: Record<string, unknown>[],
) {
  return rows.map((row, index) => ({
    import_batch_id: importBatchId,
    employee_number: row.employeeNumber,
    source_sheet: 'active_members' as const,
    source_action_name: null,
    source_row_json: rawRows[index],
    legal_first_name: row.legalFirstName,
    legal_last_name: row.legalLastName,
    work_email: row.workEmail,
    location: row.location,
    assignment_name: row.assignmentName,
    unit_title: row.unitTitle,
    brand: row.brand,
    unit_tier: row.unitTier,
  }))
}

function buildLeaverSnapshots(
  importBatchId: string,
  rows: ReturnType<typeof mapLeaverRow>[],
  rawRows: Record<string, unknown>[],
) {
  return rows.map((row, index) => ({
    import_batch_id: importBatchId,
    employee_number: row.employeeNumber,
    source_sheet: 'recent_leavers' as const,
    source_action_name: row.sourceActionName,
    source_row_json: rawRows[index],
    legal_first_name: row.legalFirstName,
    legal_last_name: row.legalLastName,
    work_email: row.workEmail,
    location: row.location,
    assignment_name: null,
    unit_title: row.unitTitle,
    brand: row.brand,
    unit_tier: row.unitTier,
  }))
}

function buildPromotionSnapshots(
  importBatchId: string,
  rows: ReturnType<typeof mapPromotionRow>[],
  rawRows: Record<string, unknown>[],
) {
  return rows.map((row, index) => ({
    import_batch_id: importBatchId,
    employee_number: row.employeeNumber,
    source_sheet: 'promoted_out' as const,
    source_action_name: null,
    source_row_json: rawRows[index],
    legal_first_name: row.legalFirstName,
    legal_last_name: row.legalLastName,
    work_email: null,
    location: row.location,
    assignment_name: null,
    unit_title: row.newTitle,
    brand: row.brand,
    unit_tier: null,
  }))
}

function buildSensitiveDetailRows(
  activeRows: ReturnType<typeof mapActiveRow>[],
  existingByEmployeeNumber: Map<string, { memberId: string }>,
) {
  return activeRows
    .filter((row) => row.employeeNumber)
    .map((row) => {
      const existing = existingByEmployeeNumber.get(row.employeeNumber!)

      if (!existing) {
        return null
      }

      return {
        member_id: existing.memberId,
        annual_salary_or_hourly_rate: row.annualSalaryOrHourlyRate,
        date_of_birth: row.dateOfBirth,
        gender: row.gender,
        ethnicity: row.ethnicity,
      }
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
}

export async function applyImport(input: ApplyImportInput): Promise<ApplyImportSummary> {
  const workbook = loadWorkbook(input.workbookPath)
  const processedCount = countProcessedRows(workbook)

  // map active, leaver, and promotion rows
  const activeRows = workbook.rows.active.map(mapActiveRow)
  const leaverRows = workbook.rows.leavers.map(mapLeaverRow)
  const promotionRows = workbook.rows.promotions.map(mapPromotionRow)

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

  if (!importBatchId) {
    throw new Error('Import batch was created without an id')
  }

  let inactiveCount = 0
  let historyRowCount = 0

  const snapshotRows = [
    ...buildActiveSnapshots(importBatchId, activeRows, workbook.rows.active),
    ...buildLeaverSnapshots(importBatchId, leaverRows, workbook.rows.leavers),
    ...buildPromotionSnapshots(importBatchId, promotionRows, workbook.rows.promotions),
  ]

  if (snapshotRows.length > 0) {
    const { error: snapshotInsertError } = await supabase
      .from('import_snapshots')
      .insert(snapshotRows)

    if (snapshotInsertError) {
      throw new Error(`Failed to create import snapshots: ${snapshotInsertError.message}`)
    }
  }

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

    // ---- HISTORY DETECTION ----
    const historyRows: Array<{
      member_id: string
      import_batch_id: string
      change_source: 'import'
      field_name: string
      old_value: string | null
      new_value: string | null
    }> = []

    // assignment_name
    if ((existingMember.assignmentName ?? null) !== (row.assignmentName ?? null)) {
      historyRows.push({
        member_id: existingMember.memberId,
        import_batch_id: importBatchId,
        change_source: 'import',
        field_name: 'assignment_name',
        old_value: existingMember.assignmentName ?? null,
        new_value: row.assignmentName ?? null,
      })
    }

    // unit_title
    if ((existingMember.unitTitle ?? null) !== (row.unitTitle ?? null)) {
      historyRows.push({
        member_id: existingMember.memberId,
        import_batch_id: importBatchId,
        change_source: 'import',
        field_name: 'unit_title',
        old_value: existingMember.unitTitle ?? null,
        new_value: row.unitTitle ?? null,
      })
    }

    // is_active (reactivation)
    if (existingMember.isActive === false) {
      historyRows.push({
        member_id: existingMember.memberId,
        import_batch_id: importBatchId,
        change_source: 'import',
        field_name: 'is_active',
        old_value: 'false',
        new_value: 'true',
      })
    }

    // insert history rows if any
    if (historyRows.length > 0) {
      const { error: historyError } = await supabase
        .from('member_change_history')
        .insert(historyRows)

      if (historyError) {
        throw new Error(
          `Failed to insert history for member ${existingMember.memberId}: ${historyError.message}`,
        )
      }

      historyRowCount += historyRows.length
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

    existingByEmployeeNumber.set(row.employeeNumber, {
      ...existingMember,
      isActive: true,
      legalFirstName: row.legalFirstName,
      legalLastName: row.legalLastName,
      preferredName: row.preferredName,
      workEmail: row.workEmail,
      primaryPhone: row.primaryPhone,
      location: row.location,
      assignmentName: row.assignmentName,
      unitTitle: row.unitTitle,
      brand: row.brand,
      unitTier: row.unitTier,
    })
  }

  // process leavers
  for (const row of leaverRows) {
    if (!row.employeeNumber) {
      continue
    }

    const existingMember = existingByEmployeeNumber.get(row.employeeNumber)

    if (!existingMember) {
      continue
    }

    const inactiveReason = row.sourceActionName
      ? row.sourceActionName.trim().toLowerCase().replace(/\s+/g, '_')
      : 'left_company'

    if (existingMember.isActive === true) {
      const { error: historyError } = await supabase.from('member_change_history').insert({
        member_id: existingMember.memberId,
        import_batch_id: importBatchId,
        change_source: 'import',
        field_name: 'is_active',
        old_value: 'true',
        new_value: 'false',
      })

      if (historyError) {
        throw new Error(
          `Failed to insert history for member ${existingMember.memberId}: ${historyError.message}`,
        )
      }

      historyRowCount++
    }

    const { error } = await supabase
      .from('members')
      .update({
        is_active: false,
        inactive_reason: inactiveReason,
        inactive_at: row.inactiveAt,
        last_seen_import_batch_id: importBatchId,
      })
      .eq('id', existingMember.memberId)

    if (error) {
      throw new Error(`Failed to inactivate member ${existingMember.memberId}: ${error.message}`)
    }

    existingByEmployeeNumber.set(row.employeeNumber, {
      ...existingMember,
      isActive: false,
    })

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

    if (existingMember.isActive === true) {
      const { error: historyError } = await supabase.from('member_change_history').insert({
        member_id: existingMember.memberId,
        import_batch_id: importBatchId,
        change_source: 'import',
        field_name: 'is_active',
        old_value: 'true',
        new_value: 'false',
      })

      if (historyError) {
        throw new Error(
          `Failed to insert history for member ${existingMember.memberId}: ${historyError.message}`,
        )
      }

      historyRowCount++
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

    existingByEmployeeNumber.set(row.employeeNumber, {
      ...existingMember,
      isActive: false,
    })

    inactiveCount++
  }

  const sensitiveRows = buildSensitiveDetailRows(activeRows, existingByEmployeeNumber)

  if (sensitiveRows.length > 0) {
    const { error: sensitiveError } = await supabase
      .from('member_sensitive_details')
      .upsert(sensitiveRows, { onConflict: 'member_id' })

    if (sensitiveError) {
      throw new Error(`Failed to upsert sensitive details: ${sensitiveError.message}`)
    }
  }

  return {
    mode: 'apply',
    importBatchId,
    processedCount,
    createdCount: membersToCreate.length,
    updatedCount: membersToUpdate.length,
    inactiveCount,
    snapshotCount: snapshotRows.length,
    historyRowCount,
    sensitiveDetailUpdateCount: sensitiveRows.length,
    warningCount: 0,
    errorCount: 0,
    warnings: [],
    errors: [],
  }
}
