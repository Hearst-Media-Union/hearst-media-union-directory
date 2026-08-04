export function buildImportPlan(rows) {
    const activeCandidates = rows.active;
    const leaverCandidates = rows.leavers;
    const promotionCandidates = rows.promotions;
    return {
        activeCandidates,
        leaverCandidates,
        promotionCandidates,
        summary: {
            activeCandidateCount: activeCandidates.length,
            leaverCandidateCount: leaverCandidates.length,
            promotionCandidateCount: promotionCandidates.length,
            totalCandidateCount: activeCandidates.length + leaverCandidates.length + promotionCandidates.length,
        },
    };
}
