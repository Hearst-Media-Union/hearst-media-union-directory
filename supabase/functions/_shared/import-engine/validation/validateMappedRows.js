function validateSheetRows(rows) {
    const missingEmployeeNumberCount = rows.filter((row) => !row.employeeNumber).length;
    return {
        totalRows: rows.length,
        validRows: rows.length - missingEmployeeNumberCount,
        missingEmployeeNumberCount,
    };
}
export function validateMappedRows(rows) {
    return {
        active: validateSheetRows(rows.active),
        leavers: validateSheetRows(rows.leavers),
        promotions: validateSheetRows(rows.promotions),
    };
}
