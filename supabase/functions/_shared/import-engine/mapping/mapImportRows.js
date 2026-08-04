import { mapActiveRow, mapLeaverRow, mapPromotionRow, } from './mapImportRow.js';
export function mapImportRows(rows) {
    return {
        active: rows.active.map(mapActiveRow),
        leavers: rows.leavers.map(mapLeaverRow),
        promotions: rows.promotions.map(mapPromotionRow),
    };
}
