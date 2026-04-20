import XLSX from 'xlsx'

export function getSheetHeaders(sheet: XLSX.WorkSheet | undefined): string[] {
  if (!sheet || !sheet['!ref']) {
    return []
  }

  const range = XLSX.utils.decode_range(sheet['!ref'])
  const headerRowIndex = range.s.r
  const headers: string[] = []

  for (let columnIndex = range.s.c; columnIndex <= range.e.c; columnIndex += 1) {
    const cellAddress = XLSX.utils.encode_cell({
      c: columnIndex,
      r: headerRowIndex,
    })

    const cell = sheet[cellAddress]
    const rawValue = cell?.v

    headers.push(typeof rawValue === 'string' ? rawValue : String(rawValue ?? ''))
  }

  return headers
}
