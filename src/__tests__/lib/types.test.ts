import { describe, it, expect } from 'vitest'
import { STATE_ABBREVIATIONS, STATES } from '@/lib/types'

describe('STATE_ABBREVIATIONS', () => {
  it('contains 50 states', () => {
    expect(Object.keys(STATE_ABBREVIATIONS).length).toBe(50)
  })

  it('maps state names to two-letter abbreviations', () => {
    expect(STATE_ABBREVIATIONS['California']).toBe('CA')
    expect(STATE_ABBREVIATIONS['New York']).toBe('NY')
    expect(STATE_ABBREVIATIONS['Texas']).toBe('TX')
  })
})

describe('STATES', () => {
  it('is an array of 50 state names', () => {
    expect(STATES.length).toBe(50)
    expect(STATES).toContain('California')
    expect(STATES).toContain('Wyoming')
  })
})
