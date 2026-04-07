import { describe, it, expect } from 'vitest'
import {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatRatio,
  getLocaleLabel,
  getLocaleFromCode,
  getMetricColor,
  getGraduationRateColor,
  getStudentTeacherRatioColor,
  truncateText,
} from '@/lib/utils'

describe('formatNumber', () => {
  it('formats integers with commas', () => {
    expect(formatNumber(1000)).toBe('1,000')
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  it('formats small numbers without commas', () => {
    expect(formatNumber(42)).toBe('42')
    expect(formatNumber(0)).toBe('0')
  })
})

describe('formatCurrency', () => {
  it('formats as USD with no decimals', () => {
    expect(formatCurrency(15000)).toBe('$15,000')
    expect(formatCurrency(0)).toBe('$0')
  })

  it('handles large amounts', () => {
    expect(formatCurrency(28942)).toBe('$28,942')
  })
})

describe('formatPercent', () => {
  it('formats a number with one decimal and percent sign', () => {
    expect(formatPercent(85.23)).toBe('85.2%')
    expect(formatPercent(100)).toBe('100.0%')
    expect(formatPercent(0)).toBe('0.0%')
  })
})

describe('formatRatio', () => {
  it('formats as ratio with one decimal', () => {
    expect(formatRatio(15.3)).toBe('15.3:1')
    expect(formatRatio(20)).toBe('20.0:1')
  })
})

describe('getLocaleLabel', () => {
  it('returns correct labels for all locale types', () => {
    expect(getLocaleLabel('urban')).toBe('Urban')
    expect(getLocaleLabel('suburban')).toBe('Suburban')
    expect(getLocaleLabel('rural')).toBe('Rural')
    expect(getLocaleLabel('town')).toBe('Town')
  })
})

describe('getLocaleFromCode', () => {
  it('returns urban for codes 11-13', () => {
    expect(getLocaleFromCode(11)).toBe('urban')
    expect(getLocaleFromCode(12)).toBe('urban')
    expect(getLocaleFromCode(13)).toBe('urban')
  })

  it('returns suburban for codes 21-23', () => {
    expect(getLocaleFromCode(21)).toBe('suburban')
    expect(getLocaleFromCode(22)).toBe('suburban')
    expect(getLocaleFromCode(23)).toBe('suburban')
  })

  it('returns town for codes 31-33', () => {
    expect(getLocaleFromCode(31)).toBe('town')
    expect(getLocaleFromCode(32)).toBe('town')
    expect(getLocaleFromCode(33)).toBe('town')
  })

  it('returns rural for codes outside known ranges', () => {
    expect(getLocaleFromCode(41)).toBe('rural')
    expect(getLocaleFromCode(43)).toBe('rural')
    expect(getLocaleFromCode(0)).toBe('rural')
  })
})

describe('getMetricColor', () => {
  it('returns green for values at or above medium threshold', () => {
    expect(getMetricColor(90, { low: 70, medium: 85 })).toBe('text-green-600')
    expect(getMetricColor(85, { low: 70, medium: 85 })).toBe('text-green-600')
  })

  it('returns yellow for values between low and medium', () => {
    expect(getMetricColor(75, { low: 70, medium: 85 })).toBe('text-yellow-600')
    expect(getMetricColor(70, { low: 70, medium: 85 })).toBe('text-yellow-600')
  })

  it('returns red for values below low threshold', () => {
    expect(getMetricColor(60, { low: 70, medium: 85 })).toBe('text-red-600')
  })
})

describe('getGraduationRateColor', () => {
  it('returns green for high rates', () => {
    expect(getGraduationRateColor(90)).toBe('text-green-600')
    expect(getGraduationRateColor(85)).toBe('text-green-600')
  })

  it('returns yellow for medium rates', () => {
    expect(getGraduationRateColor(75)).toBe('text-yellow-600')
  })

  it('returns red for low rates', () => {
    expect(getGraduationRateColor(60)).toBe('text-red-600')
  })
})

describe('getStudentTeacherRatioColor', () => {
  it('returns green for low ratios (good)', () => {
    expect(getStudentTeacherRatioColor(10)).toBe('text-green-600')
    expect(getStudentTeacherRatioColor(15)).toBe('text-green-600')
  })

  it('returns yellow for medium ratios', () => {
    expect(getStudentTeacherRatioColor(18)).toBe('text-yellow-600')
    expect(getStudentTeacherRatioColor(20)).toBe('text-yellow-600')
  })

  it('returns red for high ratios (bad)', () => {
    expect(getStudentTeacherRatioColor(25)).toBe('text-red-600')
  })
})

describe('truncateText', () => {
  it('returns text unchanged if within limit', () => {
    expect(truncateText('Hello', 10)).toBe('Hello')
    expect(truncateText('Hello', 5)).toBe('Hello')
  })

  it('truncates and adds ellipsis when over limit', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...')
  })
})
