import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/districts/[id]/route'

vi.mock('@/lib/api-client', () => ({
  getDistrictById: vi.fn(),
}))

import { getDistrictById } from '@/lib/api-client'

const mockGetDistrictById = vi.mocked(getDistrictById)

function createRequest(): NextRequest {
  return new NextRequest('http://localhost/api/districts/0600001')
}

describe('GET /api/districts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a district when found', async () => {
    const district = {
      id: '0600001',
      name: 'LA Unified',
      state: 'California',
      stateAbbreviation: 'CA',
      city: 'LA',
      locale: 'urban' as const,
      enrollment: 500000,
      graduationRate: 80,
      studentTeacherRatio: 20,
      revenuePerPupil: 15000,
      expenditurePerPupil: 14000,
    }

    mockGetDistrictById.mockResolvedValueOnce(district)

    const res = await GET(createRequest(), {
      params: { id: '0600001' },
    })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.name).toBe('LA Unified')
  })

  it('returns 404 when not found', async () => {
    mockGetDistrictById.mockResolvedValueOnce(null)

    const res = await GET(createRequest(), {
      params: { id: 'unknown' },
    })

    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.message).toBe('District not found')
  })

  it('returns 400 when id is empty', async () => {
    const res = await GET(createRequest(), {
      params: { id: '' },
    })

    expect(res.status).toBe(400)
  })

  it('returns 500 when getDistrictById throws', async () => {
    mockGetDistrictById.mockRejectedValueOnce(new Error('fail'))

    const res = await GET(createRequest(), {
      params: { id: '0600001' },
    })

    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.message).toBe('Failed to fetch district')
  })
})
