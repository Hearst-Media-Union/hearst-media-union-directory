import { createClient } from '@supabase/supabase-js'
import { mapActiveRow, mapLeaverRow, mapPromotionRow } from '../mapping/mapImportRow.js'
import type { ExistingMemberRecord } from './buildExistingMemberLookup.js'

type WorksheetRowsInput = {
  active: Record<string, unknown>[]
  leavers: Record<string, unknown>[]
  promotions: Record<string, unknown>[]
}

type MemberSensitiveDetailsRow = {
  member_id: string
  annual_salary_or_hourly_rate: number | null
  date_of_birth: string | null
  gender: string | null
  ethnicity: string | null
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
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const missingVariables: string[] = []

if (!supabaseUrl) {
  missingVariables.push('SUPABASE_URL')
}

if (!serviceRoleKey) {
  missingVariables.push('SUPABASE_SERVICE_ROLE_KEY')
}

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    `Missing required environment variables:\n\n- ${missingVariables.join('\n- ')}\n\nCreate a .env file in the import-tools directory and define these values before running the importer.`,
  )
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

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

function mapMemberRowToExistingMemberRecord(
  row: MemberRow,
  sensitiveDetailsByMemberId: Map<string, MemberSensitiveDetailsRow>,
): ExistingMemberRecord {
  const sensitiveDetails = sensitiveDetailsByMemberId.get(row.id)

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
    dateOfBirth: sensitiveDetails?.date_of_birth ?? null,
    gender: sensitiveDetails?.gender ?? null,
    ethnicity: sensitiveDetails?.ethnicity ?? null,
    annualSalaryOrHourlyRate: sensitiveDetails?.annual_salary_or_hourly_rate ?? null,
  }
}

function chunkValues<T>(values: T[], size: number): T[][] {
  const chunks: T[][] = []

  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size))
  }

  return chunks
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

  const memberIds = memberRows.map((member) => member.id)

  if (memberIds.length === 0) {
    return []
  }

  const sensitiveDetailsRows: MemberSensitiveDetailsRow[] = []

  for (const memberIdChunk of chunkValues(memberIds, 100)) {
    const { data: sensitiveDetailsData, error: sensitiveDetailsError } = await supabase
      .from('member_sensitive_details')
      .select(
        `
        member_id,
        annual_salary_or_hourly_rate,
        date_of_birth,
        gender,
        ethnicity
      `,
      )
      .in('member_id', memberIdChunk)

    if (sensitiveDetailsError) {
      throw new Error(
        `Failed to fetch existing member sensitive details: ${sensitiveDetailsError.message}`,
      )
    }

    sensitiveDetailsRows.push(...((sensitiveDetailsData ?? []) as MemberSensitiveDetailsRow[]))
  }

  const sensitiveDetailsByMemberId = new Map(
    sensitiveDetailsRows.map((row) => [row.member_id, row]),
  )

  return memberRows.map((memberRow) =>
    mapMemberRowToExistingMemberRecord(memberRow, sensitiveDetailsByMemberId),
  )
}
