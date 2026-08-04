import { buildExistingMemberLookup } from '../adapters/buildExistingMemberLookup.js';
import { mapImportRows } from '../mapping/mapImportRows.js';
import { buildImportPlan } from '../planning/buildImportPlan.js';
import { planCoreMemberFieldUpdates } from '../planning/planCoreMemberFieldUpdates.js';
import { planHistoryActions } from '../planning/planHistoryActions.js';
import { planMemberActions } from '../planning/planMemberActions.js';
import { planSensitiveDetailActions } from '../planning/planSensitiveDetailActions.js';
import { dedupeMappedRows } from '../validation/dedupeMappedRows.js';
import { detectCrossSheetOverlaps } from '../validation/detectCrossSheetOverlaps.js';
import { detectDuplicateEmployeeNumbers } from '../validation/detectDuplicateEmployeeNumbers.js';
import { filterValidMappedRows } from '../validation/filterValidMappedRows.js';
import { validateMappedRows } from '../validation/validateMappedRows.js';
import { loadWorkbook, loadWorkbookFromBuffer } from '../workbook/loadWorkbook.js';
function buildReportFromWorkbook(workbook, existingMembers) {
    const { sheetNames, matchedSheetNames, rows, sheets } = workbook;
    const mappedRows = mapImportRows(rows);
    const validation = validateMappedRows(mappedRows);
    const validRows = filterValidMappedRows(mappedRows);
    const duplicates = detectDuplicateEmployeeNumbers(validRows);
    const dedupedRows = dedupeMappedRows(validRows);
    const overlaps = detectCrossSheetOverlaps(dedupedRows);
    const existingMemberLookup = buildExistingMemberLookup(existingMembers);
    const importPlan = buildImportPlan(dedupedRows);
    const memberActionPlan = planMemberActions(importPlan, existingMemberLookup);
    const coreMemberFieldUpdatePlan = planCoreMemberFieldUpdates(memberActionPlan);
    const sensitiveDetailPlan = planSensitiveDetailActions(memberActionPlan);
    const historyActionPlan = planHistoryActions(memberActionPlan, coreMemberFieldUpdatePlan, sensitiveDetailPlan);
    return {
        workbook: {
            allSheetNames: sheetNames,
            matchedSheetNames,
        },
        counts: {
            raw: {
                active: rows.active.length,
                leavers: rows.leavers.length,
                promotions: rows.promotions.length,
            },
            mapped: {
                active: mappedRows.active.length,
                leavers: mappedRows.leavers.length,
                promotions: mappedRows.promotions.length,
            },
            valid: {
                active: validRows.active.length,
                leavers: validRows.leavers.length,
                promotions: validRows.promotions.length,
            },
            deduped: {
                active: dedupedRows.active.length,
                leavers: dedupedRows.leavers.length,
                promotions: dedupedRows.promotions.length,
            },
            existingMembers: existingMembers.length,
            existingMemberLookupEntries: existingMemberLookup.size,
        },
        validation,
        duplicates,
        overlaps: overlaps.summary,
        importPlan: importPlan.summary,
        memberActionPlan: memberActionPlan.summary,
        coreMemberFieldUpdatePlan: coreMemberFieldUpdatePlan.summary,
        sensitiveDetailPlan: sensitiveDetailPlan.summary,
        historyActionPlan: historyActionPlan.summary,
        sampleActions: {
            memberUpdates: memberActionPlan.toUpdate,
            memberInactivations: memberActionPlan.toInactivate,
            coreMemberFieldUpdates: coreMemberFieldUpdatePlan.toUpdate,
            sensitiveDetailUpdates: sensitiveDetailPlan.toUpdate,
            historyRows: historyActionPlan.rows,
        },
        debug: {
            sheets,
            rows,
            mappedRows,
            dedupedRows,
        },
    };
}
export function buildDryRunReport(filePath, existingMembers) {
    return buildReportFromWorkbook(loadWorkbook(filePath), existingMembers);
}
export function buildDryRunReportFromBuffer(buffer, existingMembers) {
    return buildReportFromWorkbook(loadWorkbookFromBuffer(buffer), existingMembers);
}
