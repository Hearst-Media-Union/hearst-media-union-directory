import {
  buildStubExistingMembers,
  type ExistingMemberRecord,
} from './buildExistingMemberLookup.js'
import { mapActiveRow, mapLeaverRow, mapPromotionRow } from '../mapping/mapImportRow.js'

export function getExistingMembers(rows: {
  active: Record<string, unknown>[]
  leavers: Record<string, unknown>[]
  promotions: Record<string, unknown>[]
}): ExistingMemberRecord[] {
  return buildStubExistingMembers({
    active: rows.active.map(mapActiveRow),
    leavers: rows.leavers.map(mapLeaverRow),
    promotions: rows.promotions.map(mapPromotionRow),
  })
}