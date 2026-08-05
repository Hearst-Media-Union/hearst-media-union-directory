function dedupeSheetRows(rows) {
    const lastSeenRows = new Map();
    for (const row of rows) {
        if (!row.employeeNumber) {
            continue;
        }
        lastSeenRows.set(row.employeeNumber, row);
    }
    return Array.from(lastSeenRows.values());
}
export function dedupeMappedRows(rows) {
    return {
        active: dedupeSheetRows(rows.active),
        leavers: dedupeSheetRows(rows.leavers),
        promotions: dedupeSheetRows(rows.promotions),
    };
}
