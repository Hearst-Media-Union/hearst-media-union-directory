// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment

import '@supabase/functions-js/edge-runtime.d.ts'
import { withSupabase } from '@supabase/server'

const workbookFieldName = 'workbook'
const acceptedWorkbookExtension = '.xlsx'
const acceptedWorkbookMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { status })
}

export default {
  fetch: withSupabase({ auth: ['publishable'] }, async (request) => {
    if (request.method !== 'POST') {
      return jsonResponse(
        {
          error: 'Method not allowed. Use POST.',
        },
        405,
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
    const workbook = formData.get(workbookFieldName)

    if (!(workbook instanceof File)) {
      return jsonResponse(
        {
          error: `Missing workbook file in form field "${workbookFieldName}".`,
        },
        400,
      )
    }

    const normalizedFileName = workbook.name.trim().toLowerCase()
    const hasAcceptedExtension = normalizedFileName.endsWith(acceptedWorkbookExtension)
    const hasAcceptedMimeType = workbook.type === acceptedWorkbookMimeType || workbook.type === ''

    if (!hasAcceptedExtension || !hasAcceptedMimeType) {
      return jsonResponse(
        {
          error: 'Workbook must be an .xlsx file.',
        },
        400,
      )
    }

    if (workbook.size === 0) {
      return jsonResponse(
        {
          error: 'Workbook file is empty.',
        },
        400,
      )
    }

    const workbookBuffer = new Uint8Array(await workbook.arrayBuffer())

    return jsonResponse({
      workbook: {
        name: workbook.name,
        size: workbook.size,
        type: workbook.type || acceptedWorkbookMimeType,
        byteLength: workbookBuffer.byteLength,
      },
    })
  }),
}
