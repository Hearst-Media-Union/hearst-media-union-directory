export interface CommitteeMember {
  id: string
  membershipId: string
  name: string
  brand: string
  email: string
  isChair: boolean
}

export interface Committee {
  id: string
  name: string
  description: string
  members: CommitteeMember[]
}

export interface CommitteeMembershipPayload {
  memberId: string
  committeeId: string
}

export interface CommitteePayload {
  name: string
  description: string
}
