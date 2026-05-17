import { supabase } from '@/lib/supabaseClient'
import type { Committee, CommitteeMember } from '@/types/committee'

type CommitteeMemberProfileRow = {
  id: string
  legal_first_name: string
  legal_last_name: string
  preferred_name: string | null
  work_email: string | null
  brand: string | null
}

type CommitteeMemberRow = {
  members: CommitteeMemberProfileRow | CommitteeMemberProfileRow[] | null
}

type CommitteeRow = {
  id: string
  name: string
  description: string | null
  member_committees: CommitteeMemberRow[]
}

function getDisplayName(member: CommitteeMemberProfileRow) {
  if (member.preferred_name) {
    return member.preferred_name
  }

  return `${member.legal_first_name} ${member.legal_last_name}`
}

function mapCommitteeMemberRow(row: CommitteeMemberRow): CommitteeMember | null {
  const member = Array.isArray(row.members) ? row.members[0] : row.members

  if (!member) {
    return null
  }

  return {
    id: member.id,
    name: getDisplayName(member),
    brand: member.brand || '',
    email: member.work_email || '',
    isChair: false,
  }
}

function mapCommitteeRow(row: CommitteeRow): Committee {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    members: row.member_committees
      .map(mapCommitteeMemberRow)
      .filter((member): member is CommitteeMember => member !== null)
      .sort((firstMember, secondMember) => firstMember.name.localeCompare(secondMember.name)),
  }
}

export async function fetchCommittees() {
  const { data, error } = await supabase
    .from('committees')
    .select(
      `
        id,
        name,
        description,
        member_committees (
          members (
            id,
            legal_first_name,
            legal_last_name,
            preferred_name,
            work_email,
            brand
          )
        )
      `,
    )
    .order('name', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as CommitteeRow[]

  return rows.map(mapCommitteeRow)
}
