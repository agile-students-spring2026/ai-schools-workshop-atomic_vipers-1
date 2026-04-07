import { describe, it, expect } from 'vitest'
import { fallbackDistricts } from '@/lib/fallback-data'

describe('fallbackDistricts', () => {
  it('contains at least 40 districts', () => {
    expect(fallbackDistricts.length).toBeGreaterThanOrEqual(40)
  })

  it('each district has all required fields', () => {
    for (const district of fallbackDistricts) {
      expect(district.id).toBeTruthy()
      expect(district.name).toBeTruthy()
      expect(district.state).toBeTruthy()
      expect(district.stateAbbreviation).toBeTruthy()
      expect(district.city).toBeTruthy()
      expect(['urban', 'suburban', 'rural', 'town']).toContain(
        district.locale
      )
      expect(typeof district.enrollment).toBe('number')
    }
  })

  it('has unique ids', () => {
    const ids = fallbackDistricts.map(d => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
