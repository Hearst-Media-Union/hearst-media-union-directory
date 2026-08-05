function getEmployeeNumberSet(rows) {
    return new Set(rows
        .map((row) => row.employeeNumber)
        .filter((employeeNumber) => Boolean(employeeNumber)));
}
function getSortedIntersection(left, right) {
    return Array.from(left)
        .filter((value) => right.has(value))
        .sort();
}
export function detectCrossSheetOverlaps(rows) {
    const activeEmployeeNumbers = getEmployeeNumberSet(rows.active);
    const leaverEmployeeNumbers = getEmployeeNumberSet(rows.leavers);
    const promotionEmployeeNumbers = getEmployeeNumberSet(rows.promotions);
    const activeAndLeavers = getSortedIntersection(activeEmployeeNumbers, leaverEmployeeNumbers);
    const activeAndPromotions = getSortedIntersection(activeEmployeeNumbers, promotionEmployeeNumbers);
    const leaversAndPromotions = getSortedIntersection(leaverEmployeeNumbers, promotionEmployeeNumbers);
    return {
        activeAndLeavers,
        activeAndPromotions,
        leaversAndPromotions,
        summary: {
            activeAndLeaversCount: activeAndLeavers.length,
            activeAndPromotionsCount: activeAndPromotions.length,
            leaversAndPromotionsCount: leaversAndPromotions.length,
            totalOverlapCount: activeAndLeavers.length + activeAndPromotions.length + leaversAndPromotions.length,
        },
    };
}
