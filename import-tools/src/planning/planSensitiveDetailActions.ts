import type { MemberActionPlan } from './planMemberActions.js'

export type SensitiveFieldKey =
  | 'workEmail'
  | 'primaryPhone'
  | 'dateOfBirth'
  | 'gender'
  | 'ethnicity'
  | 'annualSalaryOrHourlyRate'

export type SensitiveFieldUpdate = {
  field: SensitiveFieldKey
  newValue: string | number | null
}

export type SensitiveDetailUpdateAction = {
  employeeNumber: string
  updates: SensitiveFieldUpdate[]
}

export type SensitiveDetailActionPlan = {
  toUpdate: SensitiveDetailUpdateAction[]
  summary: {
    toUpdateCount: number
    totalFieldUpdateCount: number
  }
}

export function planSensitiveDetailActions(
  memberActionPlan: MemberActionPlan,
): SensitiveDetailActionPlan {
  const toUpdate: SensitiveDetailUpdateAction[] = []

  for (const action of memberActionPlan.toUpdate) {
    const updates: SensitiveFieldUpdate[] = []

    const row = action.row

    if (row.workEmail !== undefined) {
      updates.push({ field: 'workEmail', newValue: row.workEmail })
    }

    if (row.primaryPhone !== undefined) {
      updates.push({ field: 'primaryPhone', newValue: row.primaryPhone })
    }

    if (row.dateOfBirth !== undefined) {
      updates.push({ field: 'dateOfBirth', newValue: row.dateOfBirth })
    }

    if (row.gender !== undefined) {
      updates.push({ field: 'gender', newValue: row.gender })
    }

    if (row.ethnicity !== undefined) {
      updates.push({ field: 'ethnicity', newValue: row.ethnicity })
    }

    if (row.annualSalaryOrHourlyRate !== undefined) {
      updates.push({
        field: 'annualSalaryOrHourlyRate',
        newValue: row.annualSalaryOrHourlyRate,
      })
    }

    if (updates.length > 0) {
      toUpdate.push({
        employeeNumber: action.employeeNumber,
        updates,
      })
    }
  }

  const totalFieldUpdateCount = toUpdate.reduce((sum, action) => {
    return sum + action.updates.length
  }, 0)

  return {
    toUpdate,
    summary: {
      toUpdateCount: toUpdate.length,
      totalFieldUpdateCount,
    },
  }
}
