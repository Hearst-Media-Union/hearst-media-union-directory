import type { ExistingMemberLookup, ExistingMemberRecord } from '../adapters/buildExistingMemberLookup.js'
import type { ImportPlan } from './buildImportPlan.js'
import type { ActiveImportRow, LeaverImportRow, PromotionImportRow } from '../mapping/mapImportRow.js'

export type MemberCreateAction = {
  type: 'create'
  employeeNumber: string
  row: ActiveImportRow
}

export type MemberUpdateAction = {
  type: 'update'
  employeeNumber: string
  existingMember: ExistingMemberRecord
  row: ActiveImportRow
}

export type MemberInactivateAction = {
  type: 'inactivate'
  employeeNumber: string
  existingMember: ExistingMemberRecord
  row: LeaverImportRow | PromotionImportRow
  reason: 'leaver' | 'promotion'
}

export type MemberActionPlan = {
  toCreate: MemberCreateAction[]
  toUpdate: MemberUpdateAction[]
  toInactivate: MemberInactivateAction[]
  summary: {
    toCreateCount: number
    toUpdateCount: number
    toInactivateCount: number
    totalActionCount: number
  }
}

export function planMemberActions(
  importPlan: ImportPlan,
  existingMemberLookup: ExistingMemberLookup,
): MemberActionPlan {
  const toCreate: MemberCreateAction[] = []
  const toUpdate: MemberUpdateAction[] = []
  const toInactivate: MemberInactivateAction[] = []

  for (const row of importPlan.activeCandidates) {
    const employeeNumber = row.employeeNumber

    if (!employeeNumber) {
      continue
    }

    const existingMember = existingMemberLookup.get(employeeNumber)

    if (!existingMember) {
      toCreate.push({
        type: 'create',
        employeeNumber,
        row,
      })
      continue
    }

    toUpdate.push({
      type: 'update',
      employeeNumber,
      existingMember,
      row,
    })
  }

  for (const row of importPlan.leaverCandidates) {
    const employeeNumber = row.employeeNumber

    if (!employeeNumber) {
      continue
    }

    const existingMember = existingMemberLookup.get(employeeNumber)

    if (!existingMember || !existingMember.isActive) {
      continue
    }

    toInactivate.push({
      type: 'inactivate',
      employeeNumber,
      existingMember,
      row,
      reason: 'leaver',
    })
  }

  for (const row of importPlan.promotionCandidates) {
    const employeeNumber = row.employeeNumber

    if (!employeeNumber) {
      continue
    }

    const existingMember = existingMemberLookup.get(employeeNumber)

    if (!existingMember || !existingMember.isActive) {
      continue
    }

    toInactivate.push({
      type: 'inactivate',
      employeeNumber,
      existingMember,
      row,
      reason: 'promotion',
    })
  }

  return {
    toCreate,
    toUpdate,
    toInactivate,
    summary: {
      toCreateCount: toCreate.length,
      toUpdateCount: toUpdate.length,
      toInactivateCount: toInactivate.length,
      totalActionCount: toCreate.length + toUpdate.length + toInactivate.length,
    },
  }
}
