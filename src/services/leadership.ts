import { supabase } from '@/lib/supabaseClient'
import type { LeadershipItem, LeadershipRole, LeadershipScopeType } from '@/types/leadership'

type LeadershipMemberRow = {
  legal_first_name: string
  legal_last_name: string
  preferred_name: string | null
  work_email: string | null
  brand: string | null
  unit_title: string | null
  location: string | null
}

type LeadershipAssignmentRow = {
  id: string
  leadership_role: LeadershipRole
  scope_type: LeadershipScopeType
  scope_value: string
  members: LeadershipMemberRow | LeadershipMemberRow[] | null
}

function getDisplayName(member: LeadershipMemberRow) {
  if (member.preferred_name) {
    return member.preferred_name
  }

  return `${member.legal_first_name} ${member.legal_last_name}`
}

function mapLeadershipAssignmentRow(row: LeadershipAssignmentRow): LeadershipItem | null {
  const member = Array.isArray(row.members) ? row.members[0] : row.members

  if (!member) {
    return null
  }

  return {
    id: row.id,
    name: getDisplayName(member),
    role: row.leadership_role,
    scopeType: row.scope_type,
    scopeValue: row.scope_value,
    brand: member.brand || '',
    area: member.location || '',
    unit: member.unit_title || '',
    email: member.work_email || '',
  }
}

export async function fetchLeadershipAssignments() {
  const { data, error } = await supabase
    .from('leadership_assignments')
    .select(
      `
        id,
        leadership_role,
        scope_type,
        scope_value,
        members (
          legal_first_name,
          legal_last_name,
          preferred_name,
          work_email,
          brand,
          unit_title,
          location
        )
      `,
    )
    .order('scope_value', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as LeadershipAssignmentRow[]

  return rows
    .map(mapLeadershipAssignmentRow)
    .filter((item): item is LeadershipItem => item !== null)
}
