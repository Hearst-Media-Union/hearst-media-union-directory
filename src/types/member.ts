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

export interface AdminMemberPayload {
  legalFirstName: string
  legalLastName: string
  preferredName: string
  workEmail: string
  personalEmail: string
  phone: string
  title: string
}

export type MemberSource = 'import' | 'admin'

export interface AdminEditableMember {
  id: string
  employeeNumber: string
  unionId: string
  memberSource: MemberSource
  isActive: boolean
  inactiveReason: string
  legalFirstName: string
  legalLastName: string
  preferredName: string
  workEmail: string
  personalEmail: string
  phone: string
  location: string
  title: string
  unit: string
  brand: string
  unitTier: string
  annualSalaryOrHourlyRate: string
  dateOfBirth: string
  gender: string
  ethnicity: string
}
