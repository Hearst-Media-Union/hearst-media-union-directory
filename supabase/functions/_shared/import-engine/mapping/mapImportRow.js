import { normalizeDateValue } from '../normalize/normalizeDateValue.js';
import { normalizeRow } from '../normalize/normalizeRow.js';
function normalizeStringValue(value) {
    if (typeof value === 'string') {
        const trimmedValue = value.trim();
        return trimmedValue ? trimmedValue : null;
    }
    if (typeof value === 'number') {
        return String(value);
    }
    return null;
}
function normalizeNumberValue(value) {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
}
export function mapActiveRow(row) {
    const normalizedRow = normalizeRow(row);
    return {
        employeeNumber: normalizeStringValue(normalizedRow.employee_number),
        legalFirstName: normalizeStringValue(normalizedRow.legal_first_name),
        legalLastName: normalizeStringValue(normalizedRow.legal_last_name),
        preferredName: normalizeStringValue(normalizedRow.preferred_name),
        workEmail: normalizeStringValue(normalizedRow.email_address),
        primaryPhone: normalizeStringValue(normalizedRow.primary_telephone_number),
        location: normalizeStringValue(normalizedRow.location),
        assignmentName: normalizeStringValue(normalizedRow.assignment_name),
        unitTitle: normalizeStringValue(normalizedRow.unit_title),
        brand: normalizeStringValue(normalizedRow.brand),
        unitTier: normalizeStringValue(normalizedRow.unit_tier),
        annualSalaryOrHourlyRate: normalizeNumberValue(normalizedRow.annual_salary_hourly_rate),
        gender: normalizeStringValue(normalizedRow.gender),
        ethnicity: normalizeStringValue(normalizedRow.ethnicity),
        dateOfBirth: normalizeDateValue(normalizedRow.date_of_birth),
        rawRow: row,
    };
}
export function mapLeaverRow(row) {
    const normalizedRow = normalizeRow(row);
    return {
        employeeNumber: normalizeStringValue(normalizedRow.employee_number),
        legalFirstName: normalizeStringValue(normalizedRow.legal_first_name),
        legalLastName: normalizeStringValue(normalizedRow.legal_last_name),
        preferredName: normalizeStringValue(normalizedRow.preferred_name),
        workEmail: normalizeStringValue(normalizedRow.email_address),
        primaryPhone: normalizeStringValue(normalizedRow.primary_telephone_number),
        location: normalizeStringValue(normalizedRow.work_location),
        unitTitle: normalizeStringValue(normalizedRow.unit_title),
        brand: normalizeStringValue(normalizedRow.brand),
        unitTier: normalizeStringValue(normalizedRow.unit_tier),
        sourceActionName: normalizeStringValue(normalizedRow.action_name),
        inactiveAt: normalizeDateValue(normalizedRow.date_of_termination),
        rawRow: row,
    };
}
export function mapPromotionRow(row) {
    const normalizedRow = normalizeRow(row);
    return {
        employeeNumber: normalizeStringValue(normalizedRow.person_number),
        legalFirstName: normalizeStringValue(normalizedRow.first_name),
        legalLastName: normalizeStringValue(normalizedRow.last_name),
        location: normalizeStringValue(normalizedRow.work_location),
        brand: normalizeStringValue(normalizedRow.brand),
        newTitle: normalizeStringValue(normalizedRow.new_title),
        inactiveAt: normalizeDateValue(normalizedRow.out_of_unit_promotion_date),
        rawRow: row,
    };
}
