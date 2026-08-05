import { withSupabase } from 'npm:@supabase/server'
import { buildDryRunReportFromBuffer } from '../_shared/import-engine/engine/buildDryRunReport.js'
import {
  mapActiveRow,
  mapLeaverRow,
  mapPromotionRow,
} from '../_shared/import-engine/mapping/mapImportRow.js'
import { loadWorkbookFromBuffer } from '../_shared/import-engine/workbook/loadWorkbook.js'

const workbookFieldName = 'workbook'
const acceptedWorkbookExtension = '.xlsx'
const acceptedWorkbookMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

type WorksheetRows = {
  active: Record<string, unknown>[]
  leavers: Record<string, unknown>[]
  promotions: Record<string, unknown>[]
}

type MemberRow = {
  id: string
  employee_number: string
  is_active: boolean
  legal_first_name: string | null
  legal_last_name: string | null
  preferred_name: string | null
  work_email: string | null
  primary_phone: string | null
  location: string | null
  assignment_name: string | null
  unit_title: string | null
  brand: string | null
  unit_tier: string | null
}

type MemberSensitiveDetailsRow = {
  member_id: string
  annual_salary_or_hourly_rate: number | null
  date_of_birth: string | null
  gender: string | null
  ethnicity: string | null
}

type ExistingMemberRecord = {
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
  dateOfBirth: string | null
  gender: string | null
  ethnicity: string | null
  annualSalaryOrHourlyRate: number | null
}

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { status })
}

function collectEmployeeNumbers(rows: WorksheetRows): string[] {
  const employeeNumbers = new Set<string>()

  for (const row of rows.active.map(mapActiveRow)) {
    if (row.employeeNumber) {
      employeeNumbers.add(row.employeeNumber)
    }
  }

  for (const row of rows.leavers.map(mapLeaverRow)) {
    if (row.employeeNumber) {
      employeeNumbers.add(row.employeeNumber)
    }
  }

  for (const row of rows.promotions.map(mapPromotionRow)) {
    if (row.employeeNumber) {
      employeeNumbers.add(row.employeeNumber)
    }
  }

  return Array.from(employeeNumbers)
}

function chunkValues<T>(values: T[], size: number): T[][] {
  const chunks: T[][] = []

  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size))
  }

  return chunks
}

function mapExistingMember(
  member: MemberRow,
  sensitiveDetailsByMemberId: Map<string, MemberSensitiveDetailsRow>,
): ExistingMemberRecord {
  const sensitiveDetails = sensitiveDetailsByMemberId.get(member.id)

  return {
    memberId: member.id,
    employeeNumber: member.employee_number,
    isActive: member.is_active,
    legalFirstName: member.legal_first_name,
    legalLastName: member.legal_last_name,
    preferredName: member.preferred_name,
    workEmail: member.work_email,
    primaryPhone: member.primary_phone,
    location: member.location,
    assignmentName: member.assignment_name,
    unitTitle: member.unit_title,
    brand: member.brand,
    unitTier: member.unit_tier,
    dateOfBirth: sensitiveDetails?.date_of_birth ?? null,
    gender: sensitiveDetails?.gender ?? null,
    ethnicity: sensitiveDetails?.ethnicity ?? null,
    annualSalaryOrHourlyRate: sensitiveDetails?.annual_salary_or_hourly_rate ?? null,
  }
}

export default {
  fetch: withSupabase({ auth: 'user' }, async (request, context) => {
    if (request.method !== 'POST') {
      return jsonResponse(
        {
          error: 'Method not allowed. Use POST.',
        },
        405,
      )
    }

    const { data: isAdmin, error: adminCheckError } = await context.supabase.rpc('is_admin')

    if (adminCheckError) {
      console.error('Unable to verify administrator access:', adminCheckError)

      return jsonResponse(
        {
          error: 'Unable to verify administrator access.',
        },
        500,
      )
    }

    if (!isAdmin) {
      return jsonResponse(
        {
          error: 'Administrator access is required.',
        },
        403,
      )
    }

    const contentType = request.headers.get('content-type') ?? ''

    if (!contentType.includes('multipart/form-data')) {
      return jsonResponse(
        {
          error: 'Expected a multipart/form-data request.',
        },
        415,
      )
    }

    const formData = await request.formData()
    const workbookFile = formData.get(workbookFieldName)

    if (!(workbookFile instanceof File)) {
      return jsonResponse(
        {
          error: `Missing workbook file in form field "${workbookFieldName}".`,
        },
        400,
      )
    }

    const normalizedFileName = workbookFile.name.trim().toLowerCase()
    const hasAcceptedExtension = normalizedFileName.endsWith(acceptedWorkbookExtension)
    const hasAcceptedMimeType =
      workbookFile.type === acceptedWorkbookMimeType || workbookFile.type === ''

    if (!hasAcceptedExtension || !hasAcceptedMimeType) {
      return jsonResponse(
        {
          error: 'Workbook must be an .xlsx file.',
        },
        400,
      )
    }

    if (workbookFile.size === 0) {
      return jsonResponse(
        {
          error: 'Workbook file is empty.',
        },
        400,
      )
    }

    try {
      const workbookBuffer = new Uint8Array(await workbookFile.arrayBuffer())
      const workbook = loadWorkbookFromBuffer(workbookBuffer)
      const employeeNumbers = collectEmployeeNumbers(workbook.rows)

      let existingMembers: ExistingMemberRecord[] = []

      if (employeeNumbers.length > 0) {
        const { data: memberData, error: memberError } = await context.supabase
          .from('members')
          .select(
            `
                id,
                employee_number,
                is_active,
                legal_first_name,
                legal_last_name,
                preferred_name,
                work_email,
                primary_phone,
                location,
                assignment_name,
                unit_title,
                brand,
                unit_tier
              `,
          )
          .in('employee_number', employeeNumbers)

        if (memberError) {
          throw new Error(`Failed to fetch existing members: ${memberError.message}`)
        }

        const memberRows = (memberData ?? []) as MemberRow[]
        const memberIds = memberRows.map((member) => member.id)
        const sensitiveDetailsRows: MemberSensitiveDetailsRow[] = []

        for (const memberIdChunk of chunkValues(memberIds, 100)) {
          const { data: sensitiveDetailsData, error: sensitiveDetailsError } =
            await context.supabase
              .from('member_sensitive_details')
              .select(
                `
                  member_id,
                  annual_salary_or_hourly_rate,
                  date_of_birth,
                  gender,
                  ethnicity
                `,
              )
              .in('member_id', memberIdChunk)

          if (sensitiveDetailsError) {
            throw new Error(
              `Failed to fetch existing member sensitive details: ${sensitiveDetailsError.message}`,
            )
          }

          sensitiveDetailsRows.push(
            ...((sensitiveDetailsData ?? []) as MemberSensitiveDetailsRow[]),
          )
        }

        const sensitiveDetailsByMemberId = new Map(
          sensitiveDetailsRows.map((row) => [row.member_id, row]),
        )

        existingMembers = memberRows.map((member) =>
          mapExistingMember(member, sensitiveDetailsByMemberId),
        )
      }

      const dryRunReport = buildDryRunReportFromBuffer(workbookBuffer, existingMembers)

      return jsonResponse({
        workbookFile: {
          name: workbookFile.name,
          size: workbookFile.size,
        },
        report: {
          workbook: dryRunReport.workbook,
          counts: dryRunReport.counts,
          validation: dryRunReport.validation,
          duplicates: dryRunReport.duplicates,
          overlaps: dryRunReport.overlaps,
          importPlan: dryRunReport.importPlan,
          memberActionPlan: dryRunReport.memberActionPlan,
          coreMemberFieldUpdatePlan: dryRunReport.coreMemberFieldUpdatePlan,
          sensitiveDetailPlan: dryRunReport.sensitiveDetailPlan,
          historyActionPlan: dryRunReport.historyActionPlan,
          sampleActions: dryRunReport.sampleActions,
        },
      })
    } catch (error: unknown) {
      console.error('Import dry run failed:', error)

      const message =
        error instanceof Error ? error.message : 'Unable to complete the import dry run.'

      return jsonResponse(
        {
          error: message,
        },
        400,
      )
    }
  }),
}
