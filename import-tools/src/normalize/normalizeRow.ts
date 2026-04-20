import { normalizeHeader } from './normalizeHeader.js'

export function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
  const normalizedRow: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(row)) {
    const normalizedKey = normalizeHeader(key)
    normalizedRow[normalizedKey] = value
  }

  return normalizedRow
}
