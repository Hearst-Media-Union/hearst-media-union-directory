import { supabase } from '@/lib/supabaseClient'
import type { AdminMemberPayload } from '@/types/member'

export async function createAdminMember(payload: AdminMemberPayload) {
  const preferredName =
    payload.preferredName.trim() ||
    `${payload.legalFirstName.trim()} ${payload.legalLastName.trim()}`

  const { error } = await supabase.from('members').insert({
    member_source: 'admin',
    legal_first_name: payload.legalFirstName.trim(),
    legal_last_name: payload.legalLastName.trim(),
    preferred_name: preferredName,
    work_email: payload.workEmail.trim(),
    personal_email: payload.personalEmail.trim() || null,
    primary_phone: payload.phone.trim() || null,
    assignment_name: payload.title.trim() || null,
    is_active: true,
  })

  if (error) {
    throw new Error(error.message)
  }
}
