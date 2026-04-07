import { District, SearchParams, SearchResult, LocaleType } from './types'
import { getLocaleFromCode } from './utils'
import { fallbackDistricts } from './fallback-data'

const BASE_URL = 'https://educationdata.urban.org/api/v1'

interface UrbanApiDirectoryResult {
  leaid: string
  lea_name: string
  state_name: string
  state_mailing: string
  city_mailing: string
  urban_centric_locale: number
  enrollment: number
}

interface UrbanApiResponse {
  results: UrbanApiDirectoryResult[]
}

function mapApiResultToDistrict(result: UrbanApiDirectoryResult): District {
  return {
    id: String(result.leaid),
    name: result.lea_name,
    state: result.state_name,
    stateAbbreviation: result.state_mailing,
    city: result.city_mailing,
    locale: getLocaleFromCode(result.urban_centric_locale),
    enrollment: result.enrollment ?? 0,
    graduationRate: null,
    studentTeacherRatio: null,
    revenuePerPupil: null,
    expenditurePerPupil: null,
  }
}

export async function fetchDistrictsFromApi(
  state?: string
): Promise<District[]> {
  const year = 2021
  let url = `${BASE_URL}/school-districts/ccd/directory/${year}/`

  const params = new URLSearchParams()
  if (state) {
    params.set('state_name', state)
  }
  params.set('per_page', '100')

  const fullUrl = `${url}?${params.toString()}`

  const response = await fetch(fullUrl, {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }

  const data: UrbanApiResponse = await response.json()
  return data.results.map(mapApiResultToDistrict)
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
  let districts: District[]

  try {
    districts = await fetchDistrictsFromApi(params.state)
  } catch {
    districts = fallbackDistricts
  }

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
  const fallback = fallbackDistricts.find(d => d.id === id)

  try {
    const year = 2021
    const url = `${BASE_URL}/school-districts/ccd/directory/${year}/?leaid=${id}`
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return fallback ?? null
    }

    const data: UrbanApiResponse = await response.json()
    if (data.results.length === 0) {
      return fallback ?? null
    }

    return mapApiResultToDistrict(data.results[0])
  } catch {
    return fallback ?? null
  }
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
  mapApiResultToDistrict,
}
