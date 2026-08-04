function detectSheetDuplicates(rows) {
    const counts = new Map();
    for (const row of rows) {
        if (!row.employeeNumber) {
            continue;
        }
        counts.set(row.employeeNumber, (counts.get(row.employeeNumber) ?? 0) + 1);
    }
    const duplicateEmployeeNumbers = Array.from(counts.entries())
        .filter(([, count]) => count > 1)
        .map(([employeeNumber]) => employeeNumber)
        .sort();
    return {
        duplicateEmployeeNumbers,
        duplicateCount: duplicateEmployeeNumbers.length,
    };
}
export function detectDuplicateEmployeeNumbers(rows) {
    return {
        active: detectSheetDuplicates(rows.active),
        leavers: detectSheetDuplicates(rows.leavers),
        promotions: detectSheetDuplicates(rows.promotions),
    };
}
