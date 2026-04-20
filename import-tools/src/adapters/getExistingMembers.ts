import { createClient } from '@supabase/supabase-js'
import { mapActiveRow, mapLeaverRow, mapPromotionRow } from '../mapping/mapImportRow.js'
import type { ExistingMemberRecord } from './buildExistingMemberLookup.js'

type WorksheetRowsInput = {
  active: Record<string, unknown>[]
  leavers: Record<string, unknown>[]
  promotions: Record<string, unknown>[]
}

type MemberRow = {
  id: string
  employee_number: string
  is_active: boolean
  legal_first_name: string | null
  legal_last_name: string | null
  preferred_name: string | null
  work_email: string | null
  primary_phone: string | null
  location: string | null
  assignment_name: string | null
  unit_title: string | null
  brand: string | null
  unit_tier: string | null
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

function collectEmployeeNumbers(rows: WorksheetRowsInput): string[] {
  const employeeNumbers = new Set<string>()

  for (const row of rows.active.map(mapActiveRow)) {
    if (row.employeeNumber) {
      employeeNumbers.add(row.employeeNumber)
    }
  }

  for (const row of rows.leavers.map(mapLeaverRow)) {
    if (row.employeeNumber) {
      employeeNumbers.add(row.employeeNumber)
    }
  }

  for (const row of rows.promotions.map(mapPromotionRow)) {
    if (row.employeeNumber) {
      employeeNumbers.add(row.employeeNumber)
    }
  }

  return Array.from(employeeNumbers)
}

function mapMemberRowToExistingMemberRecord(row: MemberRow): ExistingMemberRecord {
  return {
    memberId: row.id,
    employeeNumber: row.employee_number,
    isActive: row.is_active,
    legalFirstName: row.legal_first_name,
    legalLastName: row.legal_last_name,
    preferredName: row.preferred_name,
    workEmail: row.work_email,
    primaryPhone: row.primary_phone,
    location: row.location,
    assignmentName: row.assignment_name,
    unitTitle: row.unit_title,
    brand: row.brand,
    unitTier: row.unit_tier,
  }
}

export async function getExistingMembers(
  rows: WorksheetRowsInput,
): Promise<ExistingMemberRecord[]> {
  const employeeNumbers = collectEmployeeNumbers(rows)

  if (employeeNumbers.length === 0) {
    return []
  }

  const { data, error } = await supabase
    .from('members')
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
    .in('employee_number', employeeNumbers)

  if (error) {
    throw new Error(`Failed to fetch existing members: ${error.message}`)
  }

  const memberRows = (data ?? []) as MemberRow[]

  return memberRows.map(mapMemberRowToExistingMemberRecord)
}
