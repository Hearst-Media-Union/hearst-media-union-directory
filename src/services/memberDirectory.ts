import { supabase } from '@/lib/supabaseClient'
import { fetchLeadershipAssignmentsLookup } from '@/services/leadership'
import { deriveMemberArea } from '@/utils/deriveMemberArea'
import { getMemberRepresentationContacts } from '@/utils/getMemberRepresentationContacts'
import type { LeadershipItem } from '@/types/leadership'
import type { MemberDetail, MemberListItem } from '@/types/member'

type MemberProfileMatchRow = {
  id: string
}

type MemberCommitteeRow = {
  committees:
    | {
        name: string
      }[]
    | null
}

type MemberDirectoryRow = {
  id: string
  legal_first_name: string
  legal_last_name: string
  preferred_name: string | null
  work_email: string | null
  personal_email: string | null
  primary_phone: string | null
  brand: string | null
  assignment_name: string | null
  unit_title: string | null
  location: string | null
  member_committees: MemberCommitteeRow[]
}

const committeeAbbreviations: Record<string, string> = {
  'New Member Committee': 'NMC',
  'Social Committee': 'SOC',
  'Comms Committee': 'COMM',
  'Equity Committee': 'EQ',
  'Chaos Committee': 'CHA',
  'Labor Management Committee': 'LMC',
  'Area Captain': 'AC',
  'Brand Steward': 'BS',
}

let leadershipAssignmentsCache: LeadershipItem[] | null = null

async function getLeadershipAssignmentsCache() {
  if (leadershipAssignmentsCache) {
    return leadershipAssignmentsCache
  }

  leadershipAssignmentsCache = await fetchLeadershipAssignmentsLookup()

  return leadershipAssignmentsCache
}

function getDisplayName(member: MemberDirectoryRow) {
  if (member.preferred_name) {
    return member.preferred_name
  }

  return `${member.legal_first_name} ${member.legal_last_name}`
}

function getCommitteeTagLabel(committeeName: string) {
  return committeeAbbreviations[committeeName] || committeeName
}

function getDerivedArea(member: MemberDirectoryRow) {
  return deriveMemberArea({
    brand: member.brand || '',
    location: member.location || '',
  })
}

function mapMemberDirectoryRow(member: MemberDirectoryRow): MemberListItem {
  return {
    id: member.id,
    name: getDisplayName(member),
    email: member.work_email || '',
    phone: member.primary_phone || '',
    brand: member.brand || '',
    title: member.assignment_name || '',
    unit: member.unit_title || '',
    area: getDerivedArea(member),
    committees: member.member_committees
      .flatMap((memberCommittee) => memberCommittee.committees ?? [])
      .map((committee) => committee.name)
      .map(getCommitteeTagLabel),
  }
}

async function mapMemberDetailRow(member: MemberDirectoryRow): Promise<MemberDetail> {
  const area = getDerivedArea(member)

  const leadershipAssignments = await getLeadershipAssignmentsCache()

  const representation = getMemberRepresentationContacts({
    brand: member.brand || '',
    area,
    leadershipAssignments,
  })
  return {
    id: member.id,
    name: getDisplayName(member),
    email: member.work_email || '',
    personalEmail: member.personal_email || '',
    phone: member.primary_phone || '',
    brand: member.brand || '',
    title: member.assignment_name || '',
    unit: member.unit_title || '',
    area,
    committees: member.member_committees
      .flatMap((memberCommittee) => memberCommittee.committees ?? [])
      .map((committee) => committee.name)
      .map(getCommitteeTagLabel),
    representation,
  }
}

export async function fetchMemberDirectory() {
  const { data, error } = await supabase
    .from('members')
    .select(
      `
        id,
        legal_first_name,
        legal_last_name,
        preferred_name,
        work_email,
        personal_email,
        primary_phone,
        brand,
        assignment_name,
        unit_title,
        location,
        member_committees (
          committees (
            name
          )
        )
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

export async function fetchMemberDetail(memberId: string) {
  const { data, error } = await supabase
    .from('members')
    .select(
      `
        id,
        legal_first_name,
        legal_last_name,
        preferred_name,
        work_email,
        personal_email,
        primary_phone,
        brand,
        assignment_name,
        unit_title,
        location,
        member_committees (
          committees (
            name
          )
        )
      `,
    )
    .eq('id', memberId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return await mapMemberDetailRow(data as MemberDirectoryRow)
}

export async function fetchActiveMemberProfileMatchByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase()

  const { data, error } = await supabase
    .from('members')
    .select('id')
    .eq('is_active', true)
    .or(`work_email.eq.${normalizedEmail},personal_email.eq.${normalizedEmail}`)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data as MemberProfileMatchRow | null
}
