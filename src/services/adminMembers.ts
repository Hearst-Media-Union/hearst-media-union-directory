import { supabase } from '@/lib/supabaseClient'
import type { AdminMemberPayload, AdminMemberUpdatePayload } from '@/types/member'

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
