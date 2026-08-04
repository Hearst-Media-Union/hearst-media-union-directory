import { normalizeHeader } from './normalizeHeader.js';
export function normalizeRow(row) {
    const normalizedRow = {};
    const headerAliases = {
        work_location: 'location',
        termination_date: 'date_of_termination',
        prreferred_name: 'preferred_name',
    };
    for (const [key, value] of Object.entries(row)) {
        const normalizedKey = normalizeHeader(key);
        const canonicalKey = headerAliases[normalizedKey] ?? normalizedKey;
        normalizedRow[canonicalKey] = value;
    }
    return normalizedRow;
}
