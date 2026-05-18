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

export interface MemberRepresentationContact {
  id: string
  label: string
  name: string
  email: string
}

export interface MemberDetail extends MemberListItem {
  personalEmail: string
  representation: MemberRepresentationContact[]
}
