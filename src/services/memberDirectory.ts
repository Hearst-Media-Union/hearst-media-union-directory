import { supabase } from '@/lib/supabaseClient'
import type { MemberListItem } from '@/types/member'

type MemberDirectoryRow = {
  legal_first_name: string
  legal_last_name: string
  preferred_name: string | null
  work_email: string | null
  primary_phone: string | null
  brand: string | null
  assignment_name: string | null
  unit_title: string | null
  location: string | null
}

function getDisplayName(member: MemberDirectoryRow) {
  if (member.preferred_name) {
    return member.preferred_name
  }

  return `${member.legal_first_name} ${member.legal_last_name}`
}

function mapMemberDirectoryRow(member: MemberDirectoryRow): MemberListItem {
  return {
    name: getDisplayName(member),
    email: member.work_email || '',
    phone: member.primary_phone || '',
    brand: member.brand || '',
    title: member.assignment_name || '',
    unit: member.unit_title || '',
    area: member.location || '',
    committees: [],
  }
}

export async function fetchMemberDirectory() {
  const { data, error } = await supabase
    .from('members')
    .select(
      `
        legal_first_name,
        legal_last_name,
        preferred_name,
        work_email,
        primary_phone,
        brand,
        assignment_name,
        unit_title,
        location
      `,
    )
    .eq('is_active', true)
    .order('legal_last_name', { ascending: true })
    .order('legal_first_name', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as MemberDirectoryRow[]

  return rows.map(mapMemberDirectoryRow)
}
