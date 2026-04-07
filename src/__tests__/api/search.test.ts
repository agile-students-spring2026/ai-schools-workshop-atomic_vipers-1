import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/districts/search/route'

vi.mock('@/lib/api-client', () => ({
  searchDistricts: vi.fn(),
}))

import { searchDistricts } from '@/lib/api-client'

const mockSearchDistricts = vi.mocked(searchDistricts)

function createRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL('http://localhost/api/districts/search')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return new NextRequest(url)
}

describe('GET /api/districts/search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns search results', async () => {
    mockSearchDistricts.mockResolvedValueOnce({
      districts: [],
      total: 0,
      page: 1,
      limit: 20,
    })

    const res = await GET(createRequest())
    const data = await res.json()

    expect(data.total).toBe(0)
    expect(data.page).toBe(1)
  })

  it('passes query parameters', async () => {
    mockSearchDistricts.mockResolvedValueOnce({
      districts: [],
      total: 0,
      page: 1,
      limit: 20,
    })

    await GET(
      createRequest({
        query: 'test',
        state: 'CA',
        locale: 'urban',
        sortBy: 'enrollment',
        sortOrder: 'desc',
        page: '2',
        limit: '10',
      })
    )

    expect(mockSearchDistricts).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'test',
        state: 'CA',
        locale: 'urban',
        sortBy: 'enrollment',
        sortOrder: 'desc',
        page: 2,
        limit: 10,
      })
    )
  })

  it('ignores invalid locale', async () => {
    mockSearchDistricts.mockResolvedValueOnce({
      districts: [],
      total: 0,
      page: 1,
      limit: 20,
    })

    await GET(createRequest({ locale: 'invalid' }))

    expect(mockSearchDistricts).toHaveBeenCalledWith(
      expect.objectContaining({ locale: undefined })
    )
  })

  it('ignores invalid sortBy', async () => {
    mockSearchDistricts.mockResolvedValueOnce({
      districts: [],
      total: 0,
      page: 1,
      limit: 20,
    })

    await GET(createRequest({ sortBy: 'invalid' }))

    expect(mockSearchDistricts).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: undefined })
    )
  })

  it('clamps page to minimum 1', async () => {
    mockSearchDistricts.mockResolvedValueOnce({
      districts: [],
      total: 0,
      page: 1,
      limit: 20,
    })

    await GET(createRequest({ page: '-5' }))

    expect(mockSearchDistricts).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1 })
    )
  })

  it('clamps limit between 1 and 100', async () => {
    mockSearchDistricts.mockResolvedValueOnce({
      districts: [],
      total: 0,
      page: 1,
      limit: 100,
    })

    await GET(createRequest({ limit: '500' }))

    expect(mockSearchDistricts).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 100 })
    )
  })

  it('handles NaN page/limit gracefully', async () => {
    mockSearchDistricts.mockResolvedValueOnce({
      districts: [],
      total: 0,
      page: 1,
      limit: 20,
    })

    await GET(createRequest({ page: 'abc', limit: 'xyz' }))

    expect(mockSearchDistricts).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 20 })
    )
  })

  it('defaults sortOrder to asc', async () => {
    mockSearchDistricts.mockResolvedValueOnce({
      districts: [],
      total: 0,
      page: 1,
      limit: 20,
    })

    await GET(createRequest({ sortOrder: 'invalid' }))

    expect(mockSearchDistricts).toHaveBeenCalledWith(
      expect.objectContaining({ sortOrder: 'asc' })
    )
  })

  it('returns 500 when searchDistricts throws', async () => {
    mockSearchDistricts.mockRejectedValueOnce(new Error('fail'))

    const res = await GET(createRequest())
    expect(res.status).toBe(500)

    const data = await res.json()
    expect(data.message).toBe('Failed to search districts')
  })
})
