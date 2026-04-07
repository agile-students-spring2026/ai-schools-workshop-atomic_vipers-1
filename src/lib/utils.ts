import { LocaleType } from './types'

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatRatio(value: number): string {
  return `${value.toFixed(1)}:1`
}

export function getLocaleLabel(locale: LocaleType): string {
  const labels: Record<LocaleType, string> = {
    urban: 'Urban',
    suburban: 'Suburban',
    rural: 'Rural',
    town: 'Town',
  }
  return labels[locale]
}

export function getLocaleFromCode(code: number): LocaleType {
  if (code >= 11 && code <= 13) return 'urban'
  if (code >= 21 && code <= 23) return 'suburban'
  if (code >= 31 && code <= 33) return 'town'
  return 'rural'
}

export function getMetricColor(
  value: number,
  thresholds: { low: number; medium: number }
): string {
  if (value >= thresholds.medium) return 'text-green-600'
  if (value >= thresholds.low) return 'text-yellow-600'
  return 'text-red-600'
}

export function getGraduationRateColor(rate: number): string {
  return getMetricColor(rate, { low: 70, medium: 85 })
}

export function getStudentTeacherRatioColor(ratio: number): string {
  if (ratio <= 15) return 'text-green-600'
  if (ratio <= 20) return 'text-yellow-600'
  return 'text-red-600'
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
