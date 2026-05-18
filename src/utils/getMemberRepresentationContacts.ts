import type { LeadershipItem } from '@/types/leadership'
import type { MemberRepresentationContact } from '@/types/member'

type RepresentationInput = {
  brand: string
  area: string
  leadershipAssignments: LeadershipItem[]
}

function mapLeadershipContact(
  assignment: LeadershipItem,
  label: string,
): MemberRepresentationContact {
  return {
    id: assignment.id,
    label,
    name: assignment.name,
    email: assignment.email,
  }
}

export function getMemberRepresentationContacts({
  brand,
  area,
  leadershipAssignments,
}: RepresentationInput) {
  const areaCaptainContacts = leadershipAssignments
    .filter((assignment) => assignment.role === 'area_captain')
    .filter((assignment) => assignment.scopeValue === area)
    .map((assignment) => mapLeadershipContact(assignment, 'Area Captain'))

  const brandStewardContacts = leadershipAssignments
    .filter((assignment) => assignment.role === 'shop_steward')
    .filter((assignment) => assignment.scopeValue === brand || assignment.scopeValue === area)
    .map((assignment) => mapLeadershipContact(assignment, 'Brand Steward'))

  return [...areaCaptainContacts, ...brandStewardContacts]
}
