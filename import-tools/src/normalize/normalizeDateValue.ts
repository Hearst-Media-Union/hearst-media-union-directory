import XLSX from 'xlsx'

export function normalizeDateValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'number') {
    const parsedDate = XLSX.SSF.parse_date_code(value)

    if (!parsedDate) {
      return null
    }

    const year = String(parsedDate.y).padStart(4, '0')
    const month = String(parsedDate.m).padStart(2, '0')
    const day = String(parsedDate.d).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      return null
    }

    const match = trimmedValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)

    if (!match) {
      return null
    }

    const [, month, day, year] = match

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  return null
}
