function hasEmployeeNumber(row) {
    return Boolean(row.employeeNumber);
}
export function filterValidMappedRows(rows) {
    return {
        active: rows.active.filter(hasEmployeeNumber),
        leavers: rows.leavers.filter(hasEmployeeNumber),
        promotions: rows.promotions.filter(hasEmployeeNumber),
    };
}
