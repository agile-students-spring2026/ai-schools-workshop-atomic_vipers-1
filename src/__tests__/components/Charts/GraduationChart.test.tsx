import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GraduationChart, {
  getBarColor,
  formatGraduationTooltip,
} from '@/components/Charts/GraduationChart'

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>()
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  }
})

describe('GraduationChart', () => {
  it('renders chart container when data provided', () => {
    render(<GraduationChart data={[{ name: 'Test', rate: 85 }]} />)
    expect(screen.getByTestId('graduation-chart')).toBeInTheDocument()
  })

  it('renders empty message when no data', () => {
    render(<GraduationChart data={[]} />)
    expect(screen.getByText('No data available.')).toBeInTheDocument()
  })
})

describe('getBarColor', () => {
  it('returns green for rates >= 85', () => {
    expect(getBarColor(85)).toBe('#16a34a')
    expect(getBarColor(95)).toBe('#16a34a')
  })

  it('returns yellow for rates 70-84', () => {
    expect(getBarColor(70)).toBe('#ca8a04')
    expect(getBarColor(84)).toBe('#ca8a04')
  })

  it('returns red for rates < 70', () => {
    expect(getBarColor(50)).toBe('#dc2626')
    expect(getBarColor(69)).toBe('#dc2626')
  })
})

describe('formatGraduationTooltip', () => {
  it('formats value as percentage with Graduation Rate label', () => {
    expect(formatGraduationTooltip(85.5)).toEqual(['85.5%', 'Graduation Rate'])
    expect(formatGraduationTooltip(100)).toEqual(['100.0%', 'Graduation Rate'])
  })
})
