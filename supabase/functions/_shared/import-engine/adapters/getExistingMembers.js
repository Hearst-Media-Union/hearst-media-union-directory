import { createClient } from '@supabase/supabase-js';
import { mapActiveRow, mapLeaverRow, mapPromotionRow } from '../mapping/mapImportRow.js';
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const missingVariables = [];
if (!supabaseUrl) {
    missingVariables.push('SUPABASE_URL');
}
if (!serviceRoleKey) {
    missingVariables.push('SUPABASE_SERVICE_ROLE_KEY');
}
if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(`Missing required environment variables:\n\n- ${missingVariables.join('\n- ')}\n\nCreate a .env file in the import-tools directory and define these values before running the importer.`);
}
const supabase = createClient(supabaseUrl, serviceRoleKey);
function collectEmployeeNumbers(rows) {
    const employeeNumbers = new Set();
    for (const row of rows.active.map(mapActiveRow)) {
        if (row.employeeNumber) {
            employeeNumbers.add(row.employeeNumber);
        }
    }
    for (const row of rows.leavers.map(mapLeaverRow)) {
        if (row.employeeNumber) {
            employeeNumbers.add(row.employeeNumber);
        }
    }
    for (const row of rows.promotions.map(mapPromotionRow)) {
        if (row.employeeNumber) {
            employeeNumbers.add(row.employeeNumber);
        }
    }
    return Array.from(employeeNumbers);
}
function mapMemberRowToExistingMemberRecord(row, sensitiveDetailsByMemberId) {
    const sensitiveDetails = sensitiveDetailsByMemberId.get(row.id);
    return {
        memberId: row.id,
        employeeNumber: row.employee_number,
        isActive: row.is_active,
        legalFirstName: row.legal_first_name,
        legalLastName: row.legal_last_name,
        preferredName: row.preferred_name,
        workEmail: row.work_email,
        primaryPhone: row.primary_phone,
        location: row.location,
        assignmentName: row.assignment_name,
        unitTitle: row.unit_title,
        brand: row.brand,
        unitTier: row.unit_tier,
        dateOfBirth: sensitiveDetails?.date_of_birth ?? null,
        gender: sensitiveDetails?.gender ?? null,
        ethnicity: sensitiveDetails?.ethnicity ?? null,
        annualSalaryOrHourlyRate: sensitiveDetails?.annual_salary_or_hourly_rate ?? null,
    };
}
function chunkValues(values, size) {
    const chunks = [];
    for (let index = 0; index < values.length; index += size) {
        chunks.push(values.slice(index, index + size));
    }
    return chunks;
}
export async function getExistingMembers(rows) {
    const employeeNumbers = collectEmployeeNumbers(rows);
    if (employeeNumbers.length === 0) {
        return [];
    }
    const { data, error } = await supabase
        .from('members')
        .select(`
        id,
        employee_number,
        is_active,
        legal_first_name,
        legal_last_name,
        preferred_name,
        work_email,
        primary_phone,
        location,
        assignment_name,
        unit_title,
        brand,
        unit_tier
      `)
        .in('employee_number', employeeNumbers);
    if (error) {
        throw new Error(`Failed to fetch existing members: ${error.message}`);
    }
    const memberRows = (data ?? []);
    const memberIds = memberRows.map((member) => member.id);
    if (memberIds.length === 0) {
        return [];
    }
    const sensitiveDetailsRows = [];
    for (const memberIdChunk of chunkValues(memberIds, 100)) {
        const { data: sensitiveDetailsData, error: sensitiveDetailsError } = await supabase
            .from('member_sensitive_details')
            .select(`
        member_id,
        annual_salary_or_hourly_rate,
        date_of_birth,
        gender,
        ethnicity
      `)
            .in('member_id', memberIdChunk);
        if (sensitiveDetailsError) {
            throw new Error(`Failed to fetch existing member sensitive details: ${sensitiveDetailsError.message}`);
        }
        sensitiveDetailsRows.push(...(sensitiveDetailsData ?? []));
    }
    const sensitiveDetailsByMemberId = new Map(sensitiveDetailsRows.map((row) => [row.member_id, row]));
    return memberRows.map((memberRow) => mapMemberRowToExistingMemberRecord(memberRow, sensitiveDetailsByMemberId));
}
