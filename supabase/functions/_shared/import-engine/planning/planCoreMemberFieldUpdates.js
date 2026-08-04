function valuesAreEqual(left, right) {
    return left === right;
}
export function planCoreMemberFieldUpdates(memberActionPlan) {
    const toUpdate = [];
    for (const action of memberActionPlan.toUpdate) {
        const updates = [];
        const comparisons = [
            {
                field: 'legalFirstName',
                previousValue: action.existingMember.legalFirstName,
                newValue: action.row.legalFirstName,
            },
            {
                field: 'legalLastName',
                previousValue: action.existingMember.legalLastName,
                newValue: action.row.legalLastName,
            },
            {
                field: 'preferredName',
                previousValue: action.existingMember.preferredName,
                newValue: action.row.preferredName,
            },
            {
                field: 'location',
                previousValue: action.existingMember.location,
                newValue: action.row.location,
            },
            {
                field: 'assignmentName',
                previousValue: action.existingMember.assignmentName,
                newValue: action.row.assignmentName,
            },
            {
                field: 'unitTitle',
                previousValue: action.existingMember.unitTitle,
                newValue: action.row.unitTitle,
            },
            {
                field: 'brand',
                previousValue: action.existingMember.brand,
                newValue: action.row.brand,
            },
            {
                field: 'unitTier',
                previousValue: action.existingMember.unitTier,
                newValue: action.row.unitTier,
            },
        ];
        for (const comparison of comparisons) {
            if (valuesAreEqual(comparison.previousValue, comparison.newValue)) {
                continue;
            }
            updates.push({
                field: comparison.field,
                previousValue: comparison.previousValue,
                newValue: comparison.newValue,
            });
        }
        if (updates.length === 0) {
            continue;
        }
        toUpdate.push({
            employeeNumber: action.employeeNumber,
            updates,
        });
    }
    const totalFieldUpdateCount = toUpdate.reduce((sum, action) => {
        return sum + action.updates.length;
    }, 0);
    return {
        toUpdate,
        summary: {
            toUpdateCount: toUpdate.length,
            totalFieldUpdateCount,
        },
    };
}
