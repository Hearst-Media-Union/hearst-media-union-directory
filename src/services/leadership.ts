import { supabase } from '@/lib/supabaseClient'
import { deriveMemberArea } from '@/utils/deriveMemberArea'
import type { LeadershipItem, LeadershipRole, LeadershipScopeType } from '@/types/leadership'

type LeadershipMemberRow = {
  id: string
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

type CreateLeadershipAssignmentInput = {
  memberId: string
  role: LeadershipRole
  scopeType: LeadershipScopeType
  scopeValue: string
}

function getDisplayName(member: LeadershipMemberRow) {
  if (member.preferred_name) {
    return member.preferred_name
  }

  return `${member.legal_first_name} ${member.legal_last_name}`
}

function getLeadershipScopeValue(row: LeadershipAssignmentRow, member: LeadershipMemberRow) {
  if (row.scope_type !== 'location') {
    return row.scope_value
  }

  return deriveMemberArea({
    brand: member.brand || '',
    location: row.scope_value,
  })
}

export function mapLeadershipAssignmentRow(row: LeadershipAssignmentRow): LeadershipItem | null {
  const member = Array.isArray(row.members) ? row.members[0] : row.members

  if (!member) {
    return null
  }

  return {
    id: row.id,
    memberId: member.id,
    name: getDisplayName(member),
    role: row.leadership_role,
    scopeType: row.scope_type,
    scopeValue: getLeadershipScopeValue(row, member),
    brand: member.brand || '',
    area: member.location || '',
    unit: member.unit_title || '',
    email: member.work_email || '',
  }
}

export async function fetchLeadershipAssignmentsLookup() {
  const { data, error } = await supabase.from('leadership_assignments').select(
    `
        id,
        leadership_role,
        scope_type,
        scope_value,
        members (
          id,
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

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as LeadershipAssignmentRow[]

  return rows
    .map(mapLeadershipAssignmentRow)
    .filter((item): item is LeadershipItem => item !== null)
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
          id,
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

export async function createLeadershipAssignment({
  memberId,
  role,
  scopeType,
  scopeValue,
}: CreateLeadershipAssignmentInput) {
  const { error } = await supabase.from('leadership_assignments').insert({
    member_id: memberId,
    leadership_role: role,
    scope_type: scopeType,
    scope_value: scopeValue,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function deleteLeadershipAssignment(assignmentId: string) {
  const { error } = await supabase.from('leadership_assignments').delete().eq('id', assignmentId)

  if (error) {
    throw new Error(error.message)
  }
}
