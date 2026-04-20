import type { CoreMemberFieldUpdatePlan } from './planCoreMemberFieldUpdates.js'
import type { MemberActionPlan } from './planMemberActions.js'
import type { SensitiveDetailActionPlan } from './planSensitiveDetailActions.js'

export type MemberHistoryActionType =
  | 'created'
  | 'core_field_updated'
  | 'sensitive_field_updated'
  | 'inactivated'

export type HistoryAction = {
  employeeNumber: string
  actionType: MemberHistoryActionType
  reason: string
}

export type HistoryActionPlan = {
  rows: HistoryAction[]
  summary: {
    createdCount: number
    coreFieldUpdatedCount: number
    sensitiveFieldUpdatedCount: number
    inactivatedCount: number
    totalHistoryRowCount: number
  }
}

function getCoreFieldHistoryReason(field: string): string {
  switch (field) {
    case 'legalFirstName':
      return 'legal_first_name_changed'
    case 'legalLastName':
      return 'legal_last_name_changed'
    case 'preferredName':
      return 'preferred_name_changed'
    case 'location':
      return 'location_changed'
    case 'assignmentName':
      return 'assignment_changed'
    case 'unitTitle':
      return 'unit_title_changed'
    case 'brand':
      return 'brand_changed'
    case 'unitTier':
      return 'unit_tier_changed'
    default:
      return 'core_member_field_changed'
  }
}

function getSensitiveFieldHistoryReason(field: string): string {
  switch (field) {
    case 'workEmail':
      return 'work_email_changed'
    case 'primaryPhone':
      return 'primary_phone_changed'
    case 'dateOfBirth':
      return 'date_of_birth_changed'
    case 'gender':
      return 'gender_changed'
    case 'ethnicity':
      return 'ethnicity_changed'
    case 'annualSalaryOrHourlyRate':
      return 'compensation_changed'
    default:
      return 'sensitive_field_changed'
  }
}

export function planHistoryActions(
  memberActionPlan: MemberActionPlan,
  coreMemberFieldUpdatePlan: CoreMemberFieldUpdatePlan,
  sensitiveDetailPlan: SensitiveDetailActionPlan,
): HistoryActionPlan {
  const rows: HistoryAction[] = []

  for (const action of memberActionPlan.toCreate) {
    rows.push({
      employeeNumber: action.employeeNumber,
      actionType: 'created',
      reason: 'active_import_new_member',
    })
  }

  for (const action of coreMemberFieldUpdatePlan.toUpdate) {
    for (const update of action.updates) {
      rows.push({
        employeeNumber: action.employeeNumber,
        actionType: 'core_field_updated',
        reason: getCoreFieldHistoryReason(update.field),
      })
    }
  }

  for (const action of sensitiveDetailPlan.toUpdate) {
    for (const update of action.updates) {
      rows.push({
        employeeNumber: action.employeeNumber,
        actionType: 'sensitive_field_updated',
        reason: getSensitiveFieldHistoryReason(update.field),
      })
    }
  }

  for (const action of memberActionPlan.toInactivate) {
    rows.push({
      employeeNumber: action.employeeNumber,
      actionType: 'inactivated',
      reason: action.reason === 'leaver' ? 'leaver_import' : 'promotion_import',
    })
  }

  const createdCount = rows.filter((row) => row.actionType === 'created').length
  const coreFieldUpdatedCount = rows.filter(
    (row) => row.actionType === 'core_field_updated',
  ).length
  const sensitiveFieldUpdatedCount = rows.filter(
    (row) => row.actionType === 'sensitive_field_updated',
  ).length
  const inactivatedCount = rows.filter((row) => row.actionType === 'inactivated').length

  return {
    rows,
    summary: {
      createdCount,
      coreFieldUpdatedCount,
      sensitiveFieldUpdatedCount,
      inactivatedCount,
      totalHistoryRowCount: rows.length,
    },
  }
}