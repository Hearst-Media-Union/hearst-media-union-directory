function valuesAreDifferent(currentValue, nextValue) {
    return currentValue !== nextValue;
}
export function planSensitiveDetailActions(memberActionPlan) {
    const toUpdate = [];
    for (const action of memberActionPlan.toUpdate) {
        const updates = [];
        const row = action.row;
        const existingMember = action.existingMember;
        if (valuesAreDifferent(existingMember.workEmail, row.workEmail)) {
            updates.push({ field: 'workEmail', newValue: row.workEmail });
        }
        if (valuesAreDifferent(existingMember.primaryPhone, row.primaryPhone)) {
            updates.push({ field: 'primaryPhone', newValue: row.primaryPhone });
        }
        if (valuesAreDifferent(existingMember.dateOfBirth, row.dateOfBirth)) {
            updates.push({ field: 'dateOfBirth', newValue: row.dateOfBirth });
        }
        if (valuesAreDifferent(existingMember.gender, row.gender)) {
            updates.push({ field: 'gender', newValue: row.gender });
        }
        if (valuesAreDifferent(existingMember.ethnicity, row.ethnicity)) {
            updates.push({ field: 'ethnicity', newValue: row.ethnicity });
        }
        if (valuesAreDifferent(existingMember.annualSalaryOrHourlyRate, row.annualSalaryOrHourlyRate)) {
            updates.push({
                field: 'annualSalaryOrHourlyRate',
                newValue: row.annualSalaryOrHourlyRate,
            });
        }
        if (updates.length > 0) {
            toUpdate.push({
                employeeNumber: action.employeeNumber,
                updates,
            });
        }
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
