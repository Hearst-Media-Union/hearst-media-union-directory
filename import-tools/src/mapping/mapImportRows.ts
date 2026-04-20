import {
  mapActiveRow,
  mapLeaverRow,
  mapPromotionRow,
  type ActiveImportRow,
  type LeaverImportRow,
  type PromotionImportRow,
} from './mapImportRow.js'

export type MappedImportRows = {
  active: ActiveImportRow[]
  leavers: LeaverImportRow[]
  promotions: PromotionImportRow[]
}

export function mapImportRows(rows: {
  active: Record<string, unknown>[]
  leavers: Record<string, unknown>[]
  promotions: Record<string, unknown>[]
}): MappedImportRows {
  return {
    active: rows.active.map(mapActiveRow),
    leavers: rows.leavers.map(mapLeaverRow),
    promotions: rows.promotions.map(mapPromotionRow),
  }
}
