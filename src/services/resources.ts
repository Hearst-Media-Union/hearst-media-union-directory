import { supabase } from '@/lib/supabaseClient'
import type { ResourceCategory, ResourceItem } from '@/types/resource'

type ResourceRow = {
  id: string
  title: string
  description: string | null
  url: string | null
}

function mapResourceRow(row: ResourceRow): ResourceItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    url: row.url || '',
  }
}

export async function fetchResources() {
  const { data, error } = await supabase
    .from('resources')
    .select(
      `
      id,
      title,
      description,
      url
    `,
    )
    .order('title', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  const resources = ((data ?? []) as ResourceRow[]).map(mapResourceRow)

  const resourceCategory: ResourceCategory = {
    name: 'Resources',
    description: '',
    resources,
  }

  return [resourceCategory]
}
