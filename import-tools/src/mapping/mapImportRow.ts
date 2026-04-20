import { normalizeDateValue } from '../normalize/normalizeDateValue.js'
import { normalizeRow } from '../normalize/normalizeRow.js'

export type ActiveImportRow = {
  employeeNumber: string | null
  legalFirstName: string | null
  legalLastName: string | null
  preferredName: string | null
  workEmail: string | null
  primaryPhone: string | null
  location: string | null
  assignmentName: string | null
  unitTitle: string | null
  brand: string | null
  unitTier: string | null
  annualSalaryOrHourlyRate: number | null
  gender: string | null
  ethnicity: string | null
  dateOfBirth: string | null
  rawRow: Record<string, unknown>
}

export type LeaverImportRow = {
  employeeNumber: string | null
  legalFirstName: string | null
  legalLastName: string | null
  preferredName: string | null
  workEmail: string | null
  primaryPhone: string | null
  location: string | null
  unitTitle: string | null
  brand: string | null
  unitTier: string | null
  sourceActionName: string | null
  inactiveAt: string | null
  rawRow: Record<string, unknown>
}

export type PromotionImportRow = {
  employeeNumber: string | null
  legalFirstName: string | null
  legalLastName: string | null
  location: string | null
  brand: string | null
  newTitle: string | null
  inactiveAt: string | null
  rawRow: Record<string, unknown>
}

function normalizeStringValue(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmedValue = value.trim()

    return trimmedValue ? trimmedValue : null
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return null
}

function normalizeNumberValue(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

export function mapActiveRow(row: Record<string, unknown>): ActiveImportRow {
  const normalizedRow = normalizeRow(row)

  return {
    employeeNumber: normalizeStringValue(normalizedRow.employee_number),
    legalFirstName: normalizeStringValue(normalizedRow.legal_first_name),
    legalLastName: normalizeStringValue(normalizedRow.legal_last_name),
    preferredName: normalizeStringValue(normalizedRow.preferred_name),
    workEmail: normalizeStringValue(normalizedRow.email_address),
    primaryPhone: normalizeStringValue(normalizedRow.primary_telephone_number),
    location: normalizeStringValue(normalizedRow.location),
    assignmentName: normalizeStringValue(normalizedRow.assignment_name),
    unitTitle: normalizeStringValue(normalizedRow.unit_title),
    brand: normalizeStringValue(normalizedRow.brand),
    unitTier: normalizeStringValue(normalizedRow.unit_tier),
    annualSalaryOrHourlyRate: normalizeNumberValue(normalizedRow.annual_salary_hourly_rate),
    gender: normalizeStringValue(normalizedRow.gender),
    ethnicity: normalizeStringValue(normalizedRow.ethnicity),
    dateOfBirth: normalizeDateValue(normalizedRow.date_of_birth),
    rawRow: row,
  }
}

export function mapLeaverRow(row: Record<string, unknown>): LeaverImportRow {
  const normalizedRow = normalizeRow(row)

  return {
    employeeNumber: normalizeStringValue(normalizedRow.employee_number),
    legalFirstName: normalizeStringValue(normalizedRow.legal_first_name),
    legalLastName: normalizeStringValue(normalizedRow.legal_last_name),
    preferredName: normalizeStringValue(normalizedRow.preferred_name),
    workEmail: normalizeStringValue(normalizedRow.email_address),
    primaryPhone: normalizeStringValue(normalizedRow.primary_telephone_number),
    location: normalizeStringValue(normalizedRow.work_location),
    unitTitle: normalizeStringValue(normalizedRow.unit_title),
    brand: normalizeStringValue(normalizedRow.brand),
    unitTier: normalizeStringValue(normalizedRow.unit_tier),
    sourceActionName: normalizeStringValue(normalizedRow.action_name),
    inactiveAt: normalizeDateValue(normalizedRow.date_of_termination),
    rawRow: row,
  }
}

export function mapPromotionRow(row: Record<string, unknown>): PromotionImportRow {
  const normalizedRow = normalizeRow(row)

  return {
    employeeNumber: normalizeStringValue(normalizedRow.person_number),
    legalFirstName: normalizeStringValue(normalizedRow.first_name),
    legalLastName: normalizeStringValue(normalizedRow.last_name),
    location: normalizeStringValue(normalizedRow.work_location),
    brand: normalizeStringValue(normalizedRow.brand),
    newTitle: normalizeStringValue(normalizedRow.new_title),
    inactiveAt: normalizeDateValue(normalizedRow.out_of_unit_promotion_date),
    rawRow: row,
  }
}
