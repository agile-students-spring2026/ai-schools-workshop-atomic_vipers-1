import { District, SearchParams, SearchResult } from './types'
import { fallbackDistricts } from './fallback-data'

export function getAllDistricts(): District[] {
  return fallbackDistricts
}

function filterDistricts(
  districts: District[],
  params: SearchParams
): District[] {
  let filtered = [...districts]

  if (params.query) {
    const q = params.query.toLowerCase()
    filtered = filtered.filter(
      d =>
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.stateAbbreviation.toLowerCase() === q ||
        d.city.toLowerCase().includes(q)
    )
  }

  if (params.state) {
    const stateFilter = params.state.toLowerCase()
    filtered = filtered.filter(
      d =>
        d.state.toLowerCase() === stateFilter ||
        d.stateAbbreviation.toLowerCase() === stateFilter
    )
  }

  if (params.locale) {
    filtered = filtered.filter(d => d.locale === params.locale)
  }

  return filtered
}

function sortDistricts(
  districts: District[],
  sortBy: string = 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
): District[] {
  const sorted = [...districts]

  sorted.sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'enrollment':
        comparison = a.enrollment - b.enrollment
        break
      case 'graduationRate':
        comparison = (a.graduationRate ?? 0) - (b.graduationRate ?? 0)
        break
      case 'expenditurePerPupil':
        comparison =
          (a.expenditurePerPupil ?? 0) - (b.expenditurePerPupil ?? 0)
        break
      default:
        comparison = a.name.localeCompare(b.name)
    }

    return sortOrder === 'desc' ? -comparison : comparison
  })

  return sorted
}

function paginateDistricts(
  districts: District[],
  page: number,
  limit: number
): District[] {
  const start = (page - 1) * limit
  return districts.slice(start, start + limit)
}

export async function searchDistricts(
  params: SearchParams
): Promise<SearchResult> {
  const districts = getAllDistricts()

  const filtered = filterDistricts(districts, params)
  const sorted = sortDistricts(
    filtered,
    params.sortBy,
    params.sortOrder
  )
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const paginated = paginateDistricts(sorted, page, limit)

  return {
    districts: paginated,
    total: filtered.length,
    page,
    limit,
  }
}

export async function getDistrictById(
  id: string
): Promise<District | null> {
  return fallbackDistricts.find(d => d.id === id) ?? null
}

export async function getDistrictsByIds(
  ids: string[]
): Promise<District[]> {
  const results = await Promise.all(ids.map(id => getDistrictById(id)))
  return results.filter((d): d is District => d !== null)
}

export {
  filterDistricts,
  sortDistricts,
  paginateDistricts,
}
