import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/districts/compare/route'

vi.mock('@/lib/api-client', () => ({
  getDistrictsByIds: vi.fn(),
}))

import { getDistrictsByIds } from '@/lib/api-client'

const mockGetDistrictsByIds = vi.mocked(getDistrictsByIds)

function createRequest(ids?: string): NextRequest {
  const url = new URL('http://localhost/api/districts/compare')
  if (ids !== undefined) url.searchParams.set('ids', ids)
  return new NextRequest(url)
}

describe('GET /api/districts/compare', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns compared districts', async () => {
    mockGetDistrictsByIds.mockResolvedValueOnce([
      {
        id: '001',
        name: 'A',
        state: 'CA',
        stateAbbreviation: 'CA',
        city: 'LA',
        locale: 'urban',
        enrollment: 1000,
        graduationRate: 80,
        studentTeacherRatio: 15,
        revenuePerPupil: 10000,
        expenditurePerPupil: 9000,
      },
    ])

    const res = await GET(createRequest('001'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.districts).toHaveLength(1)
  })

  it('returns 400 when ids param is missing', async () => {
    const res = await GET(createRequest())
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.message).toBe('At least one district ID is required')
  })

  it('returns 400 when ids param is empty string', async () => {
    const res = await GET(createRequest(''))
    expect(res.status).toBe(400)
  })

  it('returns 400 when more than 5 ids', async () => {
    const res = await GET(createRequest('1,2,3,4,5,6'))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.message).toBe('Maximum of 5 districts can be compared')
  })

  it('returns 500 when getDistrictsByIds throws', async () => {
    mockGetDistrictsByIds.mockRejectedValueOnce(new Error('fail'))

    const res = await GET(createRequest('001'))
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.message).toBe('Failed to fetch districts for comparison')
  })

  it('filters out empty ids from comma-separated list', async () => {
    mockGetDistrictsByIds.mockResolvedValueOnce([])

    await GET(createRequest('001,,002,'))

    expect(mockGetDistrictsByIds).toHaveBeenCalledWith(['001', '002'])
  })

  it('returns 400 when all ids are empty after filtering', async () => {
    const res = await GET(createRequest(',,,'))
    expect(res.status).toBe(400)
  })
})
