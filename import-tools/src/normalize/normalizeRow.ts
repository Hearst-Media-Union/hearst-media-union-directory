import { normalizeHeader } from './normalizeHeader.js'

export function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
  const normalizedRow: Record<string, unknown> = {}

  const headerAliases: Record<string, string> = {
    work_location: 'location',
    termination_date: 'date_of_termination',
    prreferred_name: 'preferred_name',
  }

  for (const [key, value] of Object.entries(row)) {
    const normalizedKey = normalizeHeader(key)
    const canonicalKey = headerAliases[normalizedKey] ?? normalizedKey

    normalizedRow[canonicalKey] = value
  }

  return normalizedRow
}
