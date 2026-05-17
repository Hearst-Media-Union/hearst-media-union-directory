export interface ResourceItem {
  id: string
  title: string
  description: string
  url: string
}

export interface ResourceCategory {
  name: string
  description: string
  resources: ResourceItem[]
}
