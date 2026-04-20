import type { ActiveImportRow, LeaverImportRow, PromotionImportRow } from '../mapping/mapImportRow.js'

export type ExistingMemberRecord = {
  memberId: string
  employeeNumber: string
  isActive: boolean
  legalFirstName: string | null
  legalLastName: string | null
  preferredName: string | null
  workEmail: string | null
  primaryPhone: string | null
  location: string | null
  assignmentName: string | null
  unitTitle: string | null
  brand: string | null
  unitTier: string | null
}

export type ExistingMemberLookup = Map<string, ExistingMemberRecord>

export function buildExistingMemberLookup(members: ExistingMemberRecord[]): ExistingMemberLookup {
  const lookup: ExistingMemberLookup = new Map()

  for (const member of members) {
    lookup.set(member.employeeNumber, member)
  }

  return lookup
}

function buildExistingMemberFromActiveRow(
  row: ActiveImportRow,
  memberId: string,
): ExistingMemberRecord | null {
  if (!row.employeeNumber) {
    return null
  }

  return {
    memberId,
    employeeNumber: row.employeeNumber,
    isActive: true,
    legalFirstName: row.legalFirstName,
    legalLastName: row.legalLastName,
    preferredName: row.preferredName,
    workEmail: row.workEmail,
    primaryPhone: row.primaryPhone,
    location: row.location,
    assignmentName: row.assignmentName,
    unitTitle: row.unitTitle,
    brand: row.brand,
    unitTier: row.unitTier,
  }
}

function buildExistingMemberFromLeaverRow(
  row: LeaverImportRow,
  memberId: string,
): ExistingMemberRecord | null {
  if (!row.employeeNumber) {
    return null
  }

  return {
    memberId,
    employeeNumber: row.employeeNumber,
    isActive: true,
    legalFirstName: row.legalFirstName,
    legalLastName: row.legalLastName,
    preferredName: row.preferredName,
    workEmail: row.workEmail,
    primaryPhone: row.primaryPhone,
    location: row.location,
    assignmentName: null,
    unitTitle: row.unitTitle,
    brand: row.brand,
    unitTier: row.unitTier,
  }
}

function buildExistingMemberFromPromotionRow(
  row: PromotionImportRow,
  memberId: string,
): ExistingMemberRecord | null {
  if (!row.employeeNumber) {
    return null
  }

  return {
    memberId,
    employeeNumber: row.employeeNumber,
    isActive: true,
    legalFirstName: row.legalFirstName,
    legalLastName: row.legalLastName,
    preferredName: null,
    workEmail: null,
    primaryPhone: null,
    location: row.location,
    assignmentName: null,
    unitTitle: row.newTitle,
    brand: row.brand,
    unitTier: null,
  }
}

export function buildStubExistingMembers(input: {
  active: ActiveImportRow[]
  leavers: LeaverImportRow[]
  promotions: PromotionImportRow[]
}): ExistingMemberRecord[] {
  const members: ExistingMemberRecord[] = []

  for (const [index, row] of input.active.slice(0, 5).entries()) {
    const member = buildExistingMemberFromActiveRow(row, `stub-active-member-${index + 1}`)

    if (member) {
      members.push(member)
    }
  }

  for (const [index, row] of input.leavers.slice(0, 3).entries()) {
    const member = buildExistingMemberFromLeaverRow(row, `stub-leaver-member-${index + 1}`)

    if (member) {
      members.push(member)
    }
  }

  for (const [index, row] of input.promotions.slice(0, 1).entries()) {
    const member = buildExistingMemberFromPromotionRow(row, `stub-promotion-member-${index + 1}`)

    if (member) {
      members.push(member)
    }
  }

  return members
}
