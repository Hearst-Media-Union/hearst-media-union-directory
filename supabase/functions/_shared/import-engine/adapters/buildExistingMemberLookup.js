export function buildExistingMemberLookup(members) {
    const lookup = new Map();
    for (const member of members) {
        lookup.set(member.employeeNumber, member);
    }
    return lookup;
}
function buildExistingMemberFromActiveRow(row, memberId) {
    if (!row.employeeNumber) {
        return null;
    }
    return {
        memberId,
        employeeNumber: row.employeeNumber,
        isActive: true,
        legalFirstName: row.legalFirstName,
        legalLastName: row.legalLastName,
        preferredName: row.preferredName,
        workEmail: row.workEmail,
        primaryPhone: row.primaryPhone,
        location: row.location,
        assignmentName: row.assignmentName,
        unitTitle: row.unitTitle,
        brand: row.brand,
        unitTier: row.unitTier,
        dateOfBirth: null,
        gender: null,
        ethnicity: null,
        annualSalaryOrHourlyRate: null,
    };
}
function buildExistingMemberFromLeaverRow(row, memberId) {
    if (!row.employeeNumber) {
        return null;
    }
    return {
        memberId,
        employeeNumber: row.employeeNumber,
        isActive: true,
        legalFirstName: row.legalFirstName,
        legalLastName: row.legalLastName,
        preferredName: row.preferredName,
        workEmail: row.workEmail,
        primaryPhone: row.primaryPhone,
        location: row.location,
        assignmentName: null,
        unitTitle: row.unitTitle,
        brand: row.brand,
        unitTier: row.unitTier,
        dateOfBirth: null,
        gender: null,
        ethnicity: null,
        annualSalaryOrHourlyRate: null,
    };
}
function buildExistingMemberFromPromotionRow(row, memberId) {
    if (!row.employeeNumber) {
        return null;
    }
    return {
        memberId,
        employeeNumber: row.employeeNumber,
        isActive: true,
        legalFirstName: row.legalFirstName,
        legalLastName: row.legalLastName,
        preferredName: null,
        workEmail: null,
        primaryPhone: null,
        location: row.location,
        assignmentName: null,
        unitTitle: row.newTitle,
        brand: row.brand,
        unitTier: null,
        dateOfBirth: null,
        gender: null,
        ethnicity: null,
        annualSalaryOrHourlyRate: null,
    };
}
export function buildStubExistingMembers(input) {
    const members = [];
    for (const [index, row] of input.active.slice(0, 5).entries()) {
        const member = buildExistingMemberFromActiveRow(row, `stub-active-member-${index + 1}`);
        if (member) {
            members.push(member);
        }
    }
    for (const [index, row] of input.leavers.slice(0, 3).entries()) {
        const member = buildExistingMemberFromLeaverRow(row, `stub-leaver-member-${index + 1}`);
        if (member) {
            members.push(member);
        }
    }
    for (const [index, row] of input.promotions.slice(0, 1).entries()) {
        const member = buildExistingMemberFromPromotionRow(row, `stub-promotion-member-${index + 1}`);
        if (member) {
            members.push(member);
        }
    }
    return members;
}
