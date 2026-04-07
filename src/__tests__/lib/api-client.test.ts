import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  searchDistricts,
  getDistrictById,
  getDistrictsByIds,
  filterDistricts,
  sortDistricts,
  paginateDistricts,
  mapApiResultToDistrict,
  fetchDistrictsFromApi,
} from '@/lib/api-client'
import { fallbackDistricts } from '@/lib/fallback-data'
import { District, SearchParams } from '@/lib/types'

const mockDistricts: District[] = [
  {
    id: '001',
    name: 'Alpha District',
    state: 'California',
    stateAbbreviation: 'CA',
    city: 'Los Angeles',
    locale: 'urban',
    enrollment: 5000,
    graduationRate: 90,
    studentTeacherRatio: 15,
    revenuePerPupil: 12000,
    expenditurePerPupil: 11000,
  },
  {
    id: '002',
    name: 'Beta District',
    state: 'New York',
    stateAbbreviation: 'NY',
    city: 'New York',
    locale: 'suburban',
    enrollment: 3000,
    graduationRate: 80,
    studentTeacherRatio: 18,
    revenuePerPupil: 15000,
    expenditurePerPupil: 14000,
  },
  {
    id: '003',
    name: 'Gamma District',
    state: 'Texas',
    stateAbbreviation: 'TX',
    city: 'Houston',
    locale: 'rural',
    enrollment: 1000,
    graduationRate: null,
    studentTeacherRatio: null,
    revenuePerPupil: null,
    expenditurePerPupil: null,
  },
]

describe('mapApiResultToDistrict', () => {
  it('maps Urban API result to District type', () => {
    const apiResult = {
      leaid: '1234567',
      lea_name: 'Test District',
      state_name: 'California',
      state_mailing: 'CA',
      city_mailing: 'Los Angeles',
      urban_centric_locale: 11,
      enrollment: 5000,
    }

    const result = mapApiResultToDistrict(apiResult)
    expect(result.id).toBe('1234567')
    expect(result.name).toBe('Test District')
    expect(result.state).toBe('California')
    expect(result.stateAbbreviation).toBe('CA')
    expect(result.city).toBe('Los Angeles')
    expect(result.locale).toBe('urban')
    expect(result.enrollment).toBe(5000)
    expect(result.graduationRate).toBeNull()
  })

  it('handles missing enrollment', () => {
    const apiResult = {
      leaid: '1234567',
      lea_name: 'Test District',
      state_name: 'California',
      state_mailing: 'CA',
      city_mailing: 'LA',
      urban_centric_locale: 21,
      enrollment: undefined as unknown as number,
    }

    const result = mapApiResultToDistrict(apiResult)
    expect(result.enrollment).toBe(0)
    expect(result.locale).toBe('suburban')
  })
})

describe('filterDistricts', () => {
  it('returns all districts with empty params', () => {
    const result = filterDistricts(mockDistricts, {})
    expect(result).toHaveLength(3)
  })

  it('filters by query matching name', () => {
    const result = filterDistricts(mockDistricts, { query: 'alpha' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alpha District')
  })

  it('filters by query matching state', () => {
    const result = filterDistricts(mockDistricts, { query: 'california' })
    expect(result).toHaveLength(1)
  })

  it('filters by query matching state abbreviation', () => {
    const result = filterDistricts(mockDistricts, { query: 'ny' })
    expect(result).toHaveLength(1)
    expect(result[0].stateAbbreviation).toBe('NY')
  })

  it('filters by query matching city', () => {
    const result = filterDistricts(mockDistricts, { query: 'houston' })
    expect(result).toHaveLength(1)
  })

  it('filters by state full name', () => {
    const result = filterDistricts(mockDistricts, { state: 'California' })
    expect(result).toHaveLength(1)
  })

  it('filters by state abbreviation', () => {
    const result = filterDistricts(mockDistricts, { state: 'TX' })
    expect(result).toHaveLength(1)
  })

  it('filters by locale', () => {
    const result = filterDistricts(mockDistricts, { locale: 'urban' })
    expect(result).toHaveLength(1)
    expect(result[0].locale).toBe('urban')
  })

  it('combines query and locale filters', () => {
    const result = filterDistricts(mockDistricts, {
      query: 'district',
      locale: 'suburban',
    })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Beta District')
  })

  it('returns empty array when no matches', () => {
    const result = filterDistricts(mockDistricts, { query: 'nonexistent' })
    expect(result).toHaveLength(0)
  })
})

describe('sortDistricts', () => {
  it('sorts by name ascending by default', () => {
    const result = sortDistricts(mockDistricts)
    expect(result[0].name).toBe('Alpha District')
    expect(result[2].name).toBe('Gamma District')
  })

  it('sorts by name descending', () => {
    const result = sortDistricts(mockDistricts, 'name', 'desc')
    expect(result[0].name).toBe('Gamma District')
    expect(result[2].name).toBe('Alpha District')
  })

  it('sorts by enrollment ascending', () => {
    const result = sortDistricts(mockDistricts, 'enrollment', 'asc')
    expect(result[0].enrollment).toBe(1000)
    expect(result[2].enrollment).toBe(5000)
  })

  it('sorts by enrollment descending', () => {
    const result = sortDistricts(mockDistricts, 'enrollment', 'desc')
    expect(result[0].enrollment).toBe(5000)
  })

  it('sorts by graduationRate with nulls treated as 0', () => {
    const result = sortDistricts(mockDistricts, 'graduationRate', 'asc')
    expect(result[0].graduationRate).toBeNull()
    expect(result[2].graduationRate).toBe(90)
  })

  it('sorts by expenditurePerPupil with nulls treated as 0', () => {
    const result = sortDistricts(
      mockDistricts,
      'expenditurePerPupil',
      'desc'
    )
    expect(result[0].expenditurePerPupil).toBe(14000)
  })
})

describe('paginateDistricts', () => {
  it('returns first page', () => {
    const result = paginateDistricts(mockDistricts, 1, 2)
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('001')
  })

  it('returns second page', () => {
    const result = paginateDistricts(mockDistricts, 2, 2)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('003')
  })

  it('returns empty array when page is beyond data', () => {
    const result = paginateDistricts(mockDistricts, 5, 2)
    expect(result).toHaveLength(0)
  })
})

describe('fetchDistrictsFromApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches districts from Urban API', async () => {
    const mockResponse = {
      results: [
        {
          leaid: '111',
          lea_name: 'Test',
          state_name: 'California',
          state_mailing: 'CA',
          city_mailing: 'LA',
          urban_centric_locale: 11,
          enrollment: 100,
        },
      ],
    }

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await fetchDistrictsFromApi('California')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Test')
  })

  it('fetches without state filter', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response)

    const result = await fetchDistrictsFromApi()
    expect(result).toHaveLength(0)
  })

  it('throws when API returns non-ok response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    await expect(fetchDistrictsFromApi()).rejects.toThrow(
      'API request failed with status 500'
    )
  })
})

describe('searchDistricts', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('falls back to fallback data when API fails', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))

    const result = await searchDistricts({ query: 'Los Angeles' })
    expect(result.districts.length).toBeGreaterThanOrEqual(1)
    expect(result.total).toBeGreaterThanOrEqual(1)
  })

  it('uses default page and limit', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('fail'))

    const result = await searchDistricts({})
    expect(result.page).toBe(1)
    expect(result.limit).toBe(20)
  })

  it('respects custom page and limit', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('fail'))

    const result = await searchDistricts({ page: 2, limit: 5 })
    expect(result.page).toBe(2)
    expect(result.limit).toBe(5)
  })

  it('sorts and filters correctly', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('fail'))

    const result = await searchDistricts({
      sortBy: 'enrollment',
      sortOrder: 'desc',
    })
    expect(result.districts.length).toBeGreaterThan(0)
    for (let i = 1; i < result.districts.length; i++) {
      expect(result.districts[i - 1].enrollment).toBeGreaterThanOrEqual(
        result.districts[i].enrollment
      )
    }
  })
})

describe('getDistrictById', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns district from API', async () => {
    const mockResponse = {
      results: [
        {
          leaid: '0600001',
          lea_name: 'Los Angeles Unified',
          state_name: 'California',
          state_mailing: 'CA',
          city_mailing: 'Los Angeles',
          urban_centric_locale: 11,
          enrollment: 574570,
        },
      ],
    }

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await getDistrictById('0600001')
    expect(result).not.toBeNull()
    expect(result!.name).toBe('Los Angeles Unified')
  })

  it('returns fallback when API returns no results', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response)

    const result = await getDistrictById('0600001')
    expect(result).not.toBeNull()
    expect(result!.name).toBe('Los Angeles Unified')
  })

  it('returns fallback when API fails', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network'))

    const result = await getDistrictById('0600001')
    expect(result).not.toBeNull()
  })

  it('returns fallback when API returns non-ok status', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    const result = await getDistrictById('0600001')
    expect(result).not.toBeNull()
  })

  it('returns null when not found anywhere', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response)

    const result = await getDistrictById('nonexistent')
    expect(result).toBeNull()
  })
})

describe('getDistrictsByIds', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns districts for valid ids', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('fail'))

    const result = await getDistrictsByIds(['0600001', '3600001'])
    expect(result.length).toBe(2)
  })

  it('filters out null results', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response)

    const result = await getDistrictsByIds(['nonexistent1', 'nonexistent2'])
    expect(result.length).toBe(0)
  })
})
