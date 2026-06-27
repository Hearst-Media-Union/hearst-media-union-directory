import { supabase } from '@/lib/supabaseClient'
import type {
  AdminEditableMember,
  AdminMemberPayload,
  AdminMemberUpdatePayload,
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

export async function updateAdminMember(payload: AdminMemberUpdatePayload) {
  const preferredName =
    payload.preferredName.trim() ||
    `${payload.legalFirstName.trim()} ${payload.legalLastName.trim()}`

  const { error } = await supabase
    .from('members')
    .update({
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
    })
    .eq('id', payload.id)

  if (error) {
    throw new Error(error.message)
  }
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

  return mapAdminEditableMember(data as AdminEditableMemberRow)
}
