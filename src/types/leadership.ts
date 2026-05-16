export type LeadershipRole = 'shop_steward' | 'area_captain'

export type LeadershipScopeType = 'brand' | 'location' | 'unit_title'

export interface LeadershipItem {
  id: string
  name: string
  role: LeadershipRole
  scopeType: LeadershipScopeType
  scopeValue: string
  brand: string
  area: string
  unit: string
  email: string
}
