export interface MemberListItem {
  id: string
  name: string
  email: string
  phone: string
  brand: string
  title: string
  unit: string
  area: string
  committees: string[]
}

export interface MemberDetail extends MemberListItem {
  personalEmail: string
  representation: string[]
}
