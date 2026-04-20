export function normalizeHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/[^\w\s#/]+/g, '')
    .replace(/\//g, ' ')
    .replace(/#/g, ' number ')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '')
}
