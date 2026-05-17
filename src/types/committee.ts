export interface CommitteeMember {
  id: string
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
