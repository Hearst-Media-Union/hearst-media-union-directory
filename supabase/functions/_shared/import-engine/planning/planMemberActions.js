export function planMemberActions(importPlan, existingMemberLookup) {
    const toCreate = [];
    const toUpdate = [];
    const toInactivate = [];
    for (const row of importPlan.activeCandidates) {
        const employeeNumber = row.employeeNumber;
        if (!employeeNumber) {
            continue;
        }
        const existingMember = existingMemberLookup.get(employeeNumber);
        if (!existingMember) {
            toCreate.push({
                type: 'create',
                employeeNumber,
                row,
            });
            continue;
        }
        toUpdate.push({
            type: 'update',
            employeeNumber,
            existingMember,
            row,
        });
    }
    for (const row of importPlan.leaverCandidates) {
        const employeeNumber = row.employeeNumber;
        if (!employeeNumber) {
            continue;
        }
        const existingMember = existingMemberLookup.get(employeeNumber);
        if (!existingMember || !existingMember.isActive) {
            continue;
        }
        toInactivate.push({
            type: 'inactivate',
            employeeNumber,
            existingMember,
            row,
            reason: 'leaver',
        });
    }
    for (const row of importPlan.promotionCandidates) {
        const employeeNumber = row.employeeNumber;
        if (!employeeNumber) {
            continue;
        }
        const existingMember = existingMemberLookup.get(employeeNumber);
        if (!existingMember || !existingMember.isActive) {
            continue;
        }
        toInactivate.push({
            type: 'inactivate',
            employeeNumber,
            existingMember,
            row,
            reason: 'promotion',
        });
    }
    return {
        toCreate,
        toUpdate,
        toInactivate,
        summary: {
            toCreateCount: toCreate.length,
            toUpdateCount: toUpdate.length,
            toInactivateCount: toInactivate.length,
            totalActionCount: toCreate.length + toUpdate.length + toInactivate.length,
        },
    };
}
