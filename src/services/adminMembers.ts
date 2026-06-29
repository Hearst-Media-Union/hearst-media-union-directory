import { supabase } from '@/lib/supabaseClient'
import type {
  AdminEditableMember,
  AdminMemberPayload,
  MemberListItem,
  MemberSource,
} from '@/types/member'

export async function createAdminMember(payload: AdminMemberPayload) {
  const preferredName =
    payload.preferredName.trim() ||
    `${payload.legalFirstName.trim()} ${payload.legalLastName.trim()}`

  const { error } = await supabase.from('members').insert({
    member_source: 'admin',
    legal_first_name: payload.legalFirstName.trim(),
    legal_last_name: payload.legalLastName.trim(),
    preferred_name: preferredName,
    preferred_name_source: 'admin',
    work_email: payload.workEmail.trim(),
    personal_email: payload.personalEmail.trim() || null,
    personal_email_source: 'admin',
    primary_phone: payload.phone.trim() || null,
    primary_phone_source: 'admin',
    assignment_name: payload.title.trim() || null,
    is_active: true,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function updateAdminMember(payload: AdminEditableMember) {
  const { error } = await supabase.rpc('update_admin_member', {
    p_member_id: payload.id,
    p_employee_number: payload.employeeNumber.trim() || null,
    p_union_id: payload.unionId.trim() || null,
    p_is_active: payload.isActive,
    p_inactive_reason: payload.inactiveReason.trim() || null,
    p_legal_first_name: payload.legalFirstName.trim(),
    p_legal_last_name: payload.legalLastName.trim(),
    p_preferred_name: payload.preferredName.trim() || null,
    p_work_email: payload.workEmail.trim() || null,
    p_personal_email: payload.personalEmail.trim() || null,
    p_primary_phone: payload.phone.trim() || null,
    p_location: payload.location.trim() || null,
    p_assignment_name: payload.title.trim() || null,
    p_unit_title: payload.unit.trim() || null,
    p_brand: payload.brand.trim() || null,
    p_unit_tier: payload.unitTier.trim() || null,
    p_annual_salary_or_hourly_rate: payload.annualSalaryOrHourlyRate.trim()
      ? Number(payload.annualSalaryOrHourlyRate)
      : null,
    p_date_of_birth: payload.dateOfBirth.trim() || null,
    p_gender: payload.gender.trim() || null,
    p_ethnicity: payload.ethnicity.trim() || null,
  })

  if (error) {
    throw new Error(error.message)
  }
}

type AdminEditableMemberSensitiveDetailsRow = {
  annual_salary_or_hourly_rate: number | null
  date_of_birth: string | null
  gender: string | null
  ethnicity: string | null
}

type AdminEditableMemberRow = {
  id: string
  employee_number: string | null
  union_id: string | null
  member_source: MemberSource
  is_active: boolean
  inactive_reason: string | null
  legal_first_name: string
  legal_last_name: string
  preferred_name: string | null
  work_email: string | null
  personal_email: string | null
  primary_phone: string | null
  location: string | null
  assignment_name: string | null
  unit_title: string | null
  brand: string | null
  unit_tier: string | null
  member_sensitive_details: AdminEditableMemberSensitiveDetailsRow[] | null
}

function mapAdminEditableMember(row: AdminEditableMemberRow): AdminEditableMember {
  return {
    id: row.id,
    employeeNumber: row.employee_number || '',
    unionId: row.union_id || '',
    memberSource: row.member_source,
    isActive: row.is_active,
    inactiveReason: row.inactive_reason || '',
    legalFirstName: row.legal_first_name,
    legalLastName: row.legal_last_name,
    preferredName: row.preferred_name || '',
    workEmail: row.work_email || '',
    personalEmail: row.personal_email || '',
    phone: row.primary_phone || '',
    location: row.location || '',
    title: row.assignment_name || '',
    unit: row.unit_title || '',
    brand: row.brand || '',
    unitTier: row.unit_tier || '',
    annualSalaryOrHourlyRate:
      row.member_sensitive_details?.[0]?.annual_salary_or_hourly_rate?.toString() || '',
    dateOfBirth: row.member_sensitive_details?.[0]?.date_of_birth || '',
    gender: row.member_sensitive_details?.[0]?.gender || '',
    ethnicity: row.member_sensitive_details?.[0]?.ethnicity || '',
  }
}

function getAdminMemberDisplayName(member: AdminEditableMemberRow) {
  return member.preferred_name || `${member.legal_first_name} ${member.legal_last_name}`
}

function mapAdminMemberListItem(row: AdminEditableMemberRow): MemberListItem {
  return {
    id: row.id,
    name: getAdminMemberDisplayName(row),
    email: row.work_email || '',
    phone: row.primary_phone || '',
    brand: row.brand || '',
    title: row.assignment_name || '',
    unit: row.unit_title || '',
    area: row.location || '',
    committees: [],
  }
}

export async function fetchAdminMember(memberId: string) {
  const { data, error } = await supabase
    .from('members')
    .select(
      `
        id,
        employee_number,
        union_id,
        member_source,
        is_active,
        inactive_reason,
        legal_first_name,
        legal_last_name,
        preferred_name,
        work_email,
        personal_email,
        primary_phone,
        location,
        assignment_name,
        unit_title,
        brand,
        unit_tier
      `,
    )
    .eq('id', memberId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const { data: sensitiveDetailsData, error: sensitiveDetailsError } = await supabase
    .from('member_sensitive_details')
    .select(
      `
        annual_salary_or_hourly_rate,
        date_of_birth,
        gender,
        ethnicity
      `,
    )
    .eq('member_id', memberId)
    .maybeSingle()

  if (sensitiveDetailsError) {
    throw new Error(sensitiveDetailsError.message)
  }

  return mapAdminEditableMember({
    ...(data as Omit<AdminEditableMemberRow, 'member_sensitive_details'>),
    member_sensitive_details: sensitiveDetailsData ? [sensitiveDetailsData] : null,
  })
}

export async function fetchAdminMemberDirectory(includeInactiveMembers: boolean) {
  let query = supabase
    .from('members')
    .select(
      `
        id,
        employee_number,
        union_id,
        member_source,
        is_active,
        inactive_reason,
        legal_first_name,
        legal_last_name,
        preferred_name,
        work_email,
        personal_email,
        primary_phone,
        location,
        assignment_name,
        unit_title,
        brand,
        unit_tier
      `,
    )
    .order('legal_last_name', { ascending: true })
    .order('legal_first_name', { ascending: true })

  if (!includeInactiveMembers) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as AdminEditableMemberRow[]).map(mapAdminMemberListItem)
}
