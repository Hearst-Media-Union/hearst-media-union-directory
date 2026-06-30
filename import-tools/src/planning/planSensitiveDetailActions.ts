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

function valuesAreDifferent(
  currentValue: string | number | null,
  nextValue: string | number | null,
): boolean {
  return currentValue !== nextValue
}

export function planSensitiveDetailActions(
  memberActionPlan: MemberActionPlan,
): SensitiveDetailActionPlan {
  const toUpdate: SensitiveDetailUpdateAction[] = []

  for (const action of memberActionPlan.toUpdate) {
    const updates: SensitiveFieldUpdate[] = []

    const row = action.row
    const existingMember = action.existingMember

    if (valuesAreDifferent(existingMember.workEmail, row.workEmail)) {
      updates.push({ field: 'workEmail', newValue: row.workEmail })
    }

    if (valuesAreDifferent(existingMember.primaryPhone, row.primaryPhone)) {
      updates.push({ field: 'primaryPhone', newValue: row.primaryPhone })
    }

    if (valuesAreDifferent(existingMember.dateOfBirth, row.dateOfBirth)) {
      updates.push({ field: 'dateOfBirth', newValue: row.dateOfBirth })
    }

    if (valuesAreDifferent(existingMember.gender, row.gender)) {
      updates.push({ field: 'gender', newValue: row.gender })
    }

    if (valuesAreDifferent(existingMember.ethnicity, row.ethnicity)) {
      updates.push({ field: 'ethnicity', newValue: row.ethnicity })
    }

    if (valuesAreDifferent(existingMember.annualSalaryOrHourlyRate, row.annualSalaryOrHourlyRate)) {
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
